import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TickBar } from "@/components/horizon/tick-bar";
import { getAllCourses, getCourse } from "@/lib/courses";

type Params = { course: string };

export function generateStaticParams(): Params[] {
  return getAllCourses().map((c) => ({ course: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return { title: course.title, description: course.dek };
}

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <div className="flex flex-col gap-8 px-6 pb-20 pt-[52px] md:px-10">
      <header className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <Link
            href="/courses"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent no-underline"
          >
            ← Courses
          </Link>
          <span className="kicker">
            {course.stageName} · Year {course.year} · {course.lessons.length} lessons ·{" "}
            {course.totalMins} min
          </span>
        </div>
        <h1 className="m-0 max-w-[780px] text-4xl font-medium leading-[1.02] tracking-[-0.032em] md:text-[52px]">
          {course.title}
        </h1>
        <p className="m-0 max-w-[680px] text-xl leading-[1.45] text-neutral-400 [text-wrap:pretty]">
          {course.dek}
        </p>
        <div className="flex max-w-[400px] items-center gap-3">
          <TickBar selected={course.year} height={22} />
        </div>
      </header>

      <ol className="m-0 flex max-w-[780px] list-none flex-col gap-2 p-0">
        {course.lessons.map((lesson) => (
          <li key={lesson.slug}>
            <Link
              href={`/courses/${course.slug}/${lesson.slug}`}
              className="flex cursor-pointer items-baseline gap-4 rounded-md bg-panel px-5 py-4 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent"
            >
              <span className="w-6 flex-none font-mono text-xs text-accent">
                {String(lesson.order).padStart(2, "0")}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[17px] tracking-[-0.01em]">{lesson.title}</span>
                {lesson.dek ? (
                  <span className="text-[13px] text-neutral-500 [text-wrap:pretty]">
                    {lesson.dek}
                  </span>
                ) : null}
              </span>
              <span className="font-mono text-[11px] text-neutral-600">
                {lesson.mins} min
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
