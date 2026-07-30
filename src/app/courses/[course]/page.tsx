import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TickBar } from "@/components/horizon/tick-bar";
import { CourseProgressBar, LessonTick } from "@/components/courses/progress";
import { getAllCourses, getCourse, type CourseMeta, type LessonMeta } from "@/lib/courses";
import { authorUrl } from "@/lib/authors";
import { siteConfig } from "@/lib/site";

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
  return {
    title: course.title,
    description: course.dek,
    alternates: { canonical: `/courses/${slug}` },
  };
}

/** Lessons grouped by declared module; a single unnamed group when none. */
function groupLessons(course: CourseMeta): { title: string | null; lessons: LessonMeta[] }[] {
  if (!course.modules.length) return [{ title: null, lessons: course.lessons }];
  return course.modules.map((m) => ({
    title: m.title,
    lessons: course.lessons.filter((l) => l.order >= m.from && l.order <= m.to),
  }));
}

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const groups = groupLessons(course);
  const lessonRefs = course.lessons.map((l) => ({ slug: l.slug, title: l.title }));

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.dek,
    url: `${siteConfig.url}/courses/${course.slug}`,
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    author: { "@type": "Person", name: "Burke Atkerson", url: authorUrl() },
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: `PT${course.totalMins}M`,
    },
    syllabusSections: course.lessons.map((l) => ({
      "@type": "Syllabus",
      name: l.title,
      description: l.dek,
      timeRequired: `PT${l.mins}M`,
    })),
  };

  return (
    <div className="flex flex-col gap-8 px-6 pb-20 pt-[52px] md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      {/* Course frame: the accent hairline that marks course territory */}
      <div
        aria-hidden
        className="h-px max-w-[780px]"
        style={{
          background:
            "linear-gradient(90deg, #9184d9 0%, rgba(145,132,217,0.35) 55%, transparent 100%)",
        }}
      />

      <header className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/courses"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent no-underline"
          >
            ← Courses
          </Link>
          <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent shadow-edge-accent-deep">
            Course
          </span>
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

      <CourseProgressBar courseSlug={course.slug} lessons={lessonRefs} />

      <div className="flex max-w-[780px] flex-col gap-7">
        {groups.map((group, gi) => (
          <section key={group.title ?? gi} className="flex flex-col gap-2.5">
            {group.title ? (
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-accent">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <h2 className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                  {group.title}
                </h2>
                <span
                  aria-hidden
                  className="h-px flex-1 self-center"
                  style={{ background: "rgba(145,132,217,0.18)" }}
                />
              </div>
            ) : null}
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {group.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/courses/${course.slug}/${lesson.slug}`}
                    className="flex cursor-pointer items-center gap-4 rounded-md bg-panel px-5 py-4 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent"
                  >
                    <LessonTick
                      courseSlug={course.slug}
                      lessonSlug={lesson.slug}
                      order={lesson.order}
                    />
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
          </section>
        ))}
      </div>
    </div>
  );
}
