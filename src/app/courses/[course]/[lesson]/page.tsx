import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  LessonCompleteNav,
  LessonProgressRail,
} from "@/components/courses/progress";
import { getAllCourses, getLesson } from "@/lib/courses";

type Params = { course: string; lesson: string };

export function generateStaticParams(): Params[] {
  return getAllCourses().flatMap((c) =>
    c.lessons.map((l) => ({ course: c.slug, lesson: l.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { course, lesson } = await params;
  const found = getLesson(course, lesson);
  if (!found) return {};
  return {
    title: `${found.lesson.title} — ${found.course.title}`,
    description: found.lesson.dek,
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) notFound();
  const { course, lesson, prev, next } = found;

  const moduleTitle = course.modules.find(
    (m) => lesson.order >= m.from && lesson.order <= m.to,
  )?.title;
  const lessonRefs = course.lessons.map((l) => ({ slug: l.slug, title: l.title }));

  const { default: Content } = await import(
    `../../../../content/courses/${courseSlug}/lessons/${lesson.file}.mdx`
  );

  return (
    <div className="flex flex-col gap-6 px-6 pb-20 pt-[52px] md:px-14">
      {/* Course frame: hairline + per-lesson progress rail */}
      <div className="flex max-w-[680px] flex-col gap-2.5">
        <div
          aria-hidden
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, #9184d9 0%, rgba(145,132,217,0.35) 55%, transparent 100%)",
          }}
        />
        <LessonProgressRail
          courseSlug={course.slug}
          lessons={lessonRefs}
          currentSlug={lesson.slug}
        />
      </div>

      <header className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/courses/${course.slug}`}
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent no-underline"
          >
            ← {course.title}
          </Link>
          <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent shadow-edge-accent-deep">
            Course
          </span>
          <span className="kicker">
            {moduleTitle ? `${moduleTitle} · ` : ""}Lesson {lesson.order} of{" "}
            {course.lessons.length} · {lesson.mins} min
          </span>
        </div>
        <h1 className="m-0 max-w-[780px] text-4xl font-medium leading-[1.02] tracking-[-0.032em] md:text-[44px]">
          {lesson.title}
        </h1>
        {lesson.dek ? (
          <p className="m-0 max-w-[680px] text-lg leading-[1.45] text-neutral-400 [text-wrap:pretty]">
            {lesson.dek}
          </p>
        ) : null}
      </header>

      <div className="prose prose-invert prose-longgame max-w-[680px] text-[17px] leading-[1.62]">
        <Content />
      </div>

      <LessonCompleteNav
        courseSlug={course.slug}
        courseTitle={course.title}
        currentSlug={lesson.slug}
        prev={prev ? { slug: prev.slug, title: prev.title } : null}
        next={next ? { slug: next.slug, title: next.title } : null}
      />
    </div>
  );
}
