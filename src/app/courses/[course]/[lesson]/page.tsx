import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  const { default: Content } = await import(
    `../../../../content/courses/${courseSlug}/lessons/${lesson.file}.mdx`
  );

  return (
    <div className="flex flex-col gap-6 px-6 pb-20 pt-[52px] md:px-14">
      <header className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/courses/${course.slug}`}
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent no-underline"
          >
            ← {course.title}
          </Link>
          <span className="kicker">
            Lesson {lesson.order} of {course.lessons.length} · {lesson.mins} min
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

      <nav className="flex max-w-[680px] justify-between gap-4 border-t border-divider pt-6">
        {prev ? (
          <Link
            href={`/courses/${course.slug}/${prev.slug}`}
            className="text-sm text-accent no-underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${course.slug}/${next.slug}`}
            className="text-right text-sm text-accent no-underline"
          >
            {next.title} →
          </Link>
        ) : (
          <Link
            href={`/courses/${course.slug}`}
            className="text-right text-sm text-accent no-underline"
          >
            Course complete — back to overview →
          </Link>
        )}
      </nav>
    </div>
  );
}
