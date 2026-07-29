"use client";

import Link from "next/link";
import { useCallback, useSyncExternalStore } from "react";

/**
 * Course progress, kept in this browser — same external-store-over-
 * localStorage pattern as the horizon provider, so completion state
 * survives reloads, syncs across tabs, and hydrates cleanly.
 *
 * Shape in storage: { [courseSlug]: lessonSlug[] }
 */
const STORAGE_KEY = "long-game-course-progress";

const listeners = new Set<() => void>();
let cache: { raw: string | null; value: Record<string, string[]> } = {
  raw: null,
  value: {},
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Record<string, string[]> {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cache.raw) {
    let value: Record<string, string[]> = {};
    try {
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === "object") value = parsed;
    } catch {
      value = {};
    }
    cache = { raw, value };
  }
  return cache.value;
}

const EMPTY: Record<string, string[]> = {};
function getServerSnapshot() {
  return EMPTY;
}

function write(next: Record<string, string[]>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function useProgress(courseSlug: string) {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const done = all[courseSlug] ?? [];

  const markComplete = useCallback(
    (lessonSlug: string) => {
      const current = getSnapshot();
      const set = new Set(current[courseSlug] ?? []);
      set.add(lessonSlug);
      write({ ...current, [courseSlug]: Array.from(set) });
    },
    [courseSlug],
  );

  const toggle = useCallback(
    (lessonSlug: string) => {
      const current = getSnapshot();
      const set = new Set(current[courseSlug] ?? []);
      if (set.has(lessonSlug)) set.delete(lessonSlug);
      else set.add(lessonSlug);
      write({ ...current, [courseSlug]: Array.from(set) });
    },
    [courseSlug],
  );

  return { done, markComplete, toggle };
}

/* ------------------------------------------------------------------ */

type LessonRef = { slug: string; title: string };

/** The course-overview progress header: bar, count, and resume link. */
export function CourseProgressBar({
  courseSlug,
  lessons,
}: {
  courseSlug: string;
  lessons: LessonRef[];
}) {
  const { done } = useProgress(courseSlug);
  const completed = lessons.filter((l) => done.includes(l.slug));
  const pct = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;
  const next = lessons.find((l) => !done.includes(l.slug));
  const started = completed.length > 0;

  return (
    <div className="flex max-w-[780px] flex-col gap-2.5 rounded-md bg-panel p-5 shadow-edge-accent-deep">
      <div className="flex items-baseline justify-between gap-4">
        <span className="kicker-accent">Your progress</span>
        <span className="font-mono text-xs text-neutral-400">
          {completed.length} of {lessons.length} lessons · {pct}%
        </span>
      </div>
      <div className="h-[6px] overflow-hidden rounded-full bg-[rgba(233,233,237,0.08)]">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${Math.max(pct, 2)}%`, opacity: started ? 1 : 0.25 }}
        />
      </div>
      {next ? (
        <Link
          href={`/courses/${courseSlug}/${next.slug}`}
          className="mt-1 self-start text-sm text-accent no-underline"
        >
          {started ? `Continue → ${next.title}` : `Start the course → ${next.title}`}
        </Link>
      ) : (
        <span className="mt-1 text-sm text-neutral-300">
          Course complete — every lesson finished. Go make the first offer.
        </span>
      )}
    </div>
  );
}

/** Completion tick shown on each lesson row in the course outline. */
export function LessonTick({
  courseSlug,
  lessonSlug,
  order,
}: {
  courseSlug: string;
  lessonSlug: string;
  order: number;
}) {
  const { done } = useProgress(courseSlug);
  const isDone = done.includes(lessonSlug);
  return (
    <span
      className={`flex h-6 w-6 flex-none items-center justify-center rounded-full font-mono text-[11px] ${
        isDone
          ? "bg-accent text-[#161826]"
          : "text-accent shadow-edge-accent-deep"
      }`}
      aria-label={isDone ? "Completed" : `Lesson ${order}`}
    >
      {isDone ? "✓" : String(order).padStart(2, "0")}
    </span>
  );
}

/** Thin progress rail at the top of every lesson page. */
export function LessonProgressRail({
  courseSlug,
  lessons,
  currentSlug,
}: {
  courseSlug: string;
  lessons: LessonRef[];
  currentSlug: string;
}) {
  const { done } = useProgress(courseSlug);
  return (
    <div className="flex max-w-[680px] items-center gap-1" aria-hidden>
      {lessons.map((l) => {
        const isDone = done.includes(l.slug);
        const isCurrent = l.slug === currentSlug;
        return (
          <span
            key={l.slug}
            className="h-[3px] flex-1 rounded-full transition-colors duration-300"
            style={{
              background: isDone
                ? "#9184d9"
                : isCurrent
                  ? "rgba(145,132,217,0.45)"
                  : "rgba(233,233,237,0.1)",
            }}
          />
        );
      })}
    </div>
  );
}

/** Lesson footer: mark-complete + prev/next, replacing the static nav. */
export function LessonCompleteNav({
  courseSlug,
  courseTitle,
  currentSlug,
  prev,
  next,
}: {
  courseSlug: string;
  courseTitle: string;
  currentSlug: string;
  prev: LessonRef | null;
  next: LessonRef | null;
}) {
  const { done, markComplete, toggle } = useProgress(courseSlug);
  const isDone = done.includes(currentSlug);

  return (
    <div className="flex max-w-[680px] flex-col gap-4 border-t border-divider pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {next ? (
          <Link
            href={`/courses/${courseSlug}/${next.slug}`}
            onClick={() => markComplete(currentSlug)}
            className="rounded-md px-4 py-2.5 text-sm text-accent no-underline shadow-edge-accent transition-[box-shadow] duration-150 hover:shadow-edge-accent"
          >
            Mark complete & continue → {next.title}
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            onClick={() => markComplete(currentSlug)}
            className="rounded-md px-4 py-2.5 text-sm text-accent no-underline shadow-edge-accent"
          >
            Mark complete — finish the course →
          </Link>
        )}
        <button
          type="button"
          onClick={() => toggle(currentSlug)}
          className="cursor-pointer border-none bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-500 hover:text-neutral-300"
        >
          {isDone ? "✓ Completed — undo" : "Mark complete without advancing"}
        </button>
      </div>
      <nav className="flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/courses/${courseSlug}/${prev.slug}`}
            className="text-sm text-neutral-400 no-underline hover:text-neutral-200"
          >
            ← {prev.title}
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="text-sm text-neutral-400 no-underline hover:text-neutral-200"
          >
            ← {courseTitle}
          </Link>
        )}
        {next ? (
          <Link
            href={`/courses/${courseSlug}/${next.slug}`}
            className="text-right text-sm text-neutral-400 no-underline hover:text-neutral-200"
          >
            Skip ahead →
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
