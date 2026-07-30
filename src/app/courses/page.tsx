import Link from "next/link";
import type { Metadata } from "next";
import { getAllCourses } from "@/lib/courses";

export const metadata: Metadata = {
  alternates: { canonical: "/courses" },
  title: "Courses",
  description:
    "Structured sequences for the gates of the roadmap — when a stack of articles isn't enough and you need the steps in order.",
};

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <div className="flex flex-col gap-7 px-6 pb-20 pt-[52px] md:px-10">
      <div className="flex flex-col gap-3">
        <div className="kicker-accent">Courses</div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          The gates, taught in order.
        </h1>
        <p className="m-0 max-w-[620px] text-neutral-400 [text-wrap:pretty]">
          Articles answer questions; courses clear gates. Each one is a short,
          sequenced walk through one stage transition — start to finish, no filler.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-md bg-panel p-6 text-neutral-500 shadow-edge">
          The first courses are being built. The library already covers every stage —{" "}
          <Link href="/library" className="text-accent">
            start there
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="flex cursor-pointer flex-col gap-2.5 rounded-md bg-surface p-[22px] text-inherit no-underline shadow-edge transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-edge-accent"
            >
              <span className="flex items-center gap-2">
                <span className="rounded-sm bg-accent-900 px-[7px] py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-accent-300">
                  Course
                </span>
                <span className="font-mono text-[11px] text-neutral-600">
                  Y{c.year} · {c.stageName} · {c.lessons.length} lessons ·{" "}
                  {c.totalMins} min
                </span>
              </span>
              <span className="text-[19px] font-medium leading-[1.22] tracking-[-0.015em]">
                {c.title}
              </span>
              <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">
                {c.dek}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
