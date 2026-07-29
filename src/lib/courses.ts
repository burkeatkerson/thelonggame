import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { clampYear, stageForYear, type StageSlug } from "@/lib/horizon";
import { isPillarSlug, type PillarSlug } from "@/lib/pillars";

export const COURSES_DIR = path.join(process.cwd(), "src", "content", "courses");

/**
 * A course is a directory under src/content/courses/<slug>/ containing
 * course.json (metadata) and lessons/NN-<lesson-slug>.mdx. The numeric
 * prefix orders the lessons; it is stripped from the URL.
 */
export type CourseModule = {
  title: string;
  /** 1-indexed lesson order range, inclusive */
  from: number;
  to: number;
};

export type CourseMeta = {
  slug: string;
  title: string;
  dek: string;
  /** where on the horizon the course is filed */
  year: number;
  stage: StageSlug;
  stageName: string;
  pillar: PillarSlug;
  draft: boolean;
  lessons: LessonMeta[];
  totalMins: number;
  /** optional named groupings of lessons, declared in course.json */
  modules: CourseModule[];
};

export type LessonMeta = {
  /** URL slug — the filename without its ordering prefix */
  slug: string;
  /** filename without extension, used to import the MDX */
  file: string;
  order: number;
  title: string;
  dek: string;
  mins: number;
};

function readLessons(courseSlug: string): LessonMeta[] {
  const dir = path.join(COURSES_DIR, courseSlug, "lessons");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f, i) => {
      const file = f.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/^\d+-/, ""),
        file,
        order: i + 1,
        title: String(data.title ?? file),
        dek: String(data.dek ?? ""),
        mins: Math.max(1, Math.round(readingTime(content).minutes)),
      };
    });
}

function readCourse(slug: string): CourseMeta | null {
  const metaPath = path.join(COURSES_DIR, slug, "course.json");
  if (!fs.existsSync(metaPath)) return null;
  const data = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  const year = clampYear(Number(data.year ?? 1));
  const stage = stageForYear(year);
  const lessons = readLessons(slug);
  return {
    slug,
    title: String(data.title),
    dek: String(data.dek ?? ""),
    year,
    stage: stage.slug,
    stageName: stage.name,
    pillar:
      data.pillar && isPillarSlug(String(data.pillar))
        ? (String(data.pillar) as PillarSlug)
        : stage.focus[0],
    draft: data.draft === true,
    lessons,
    totalMins: lessons.reduce((sum, l) => sum + l.mins, 0),
    modules: Array.isArray(data.modules)
      ? data.modules
          .map((m: { title?: unknown; from?: unknown; to?: unknown }) => ({
            title: String(m.title ?? ""),
            from: Number(m.from ?? 0),
            to: Number(m.to ?? 0),
          }))
          .filter((m: CourseModule) => m.title && m.from >= 1 && m.to >= m.from)
      : [],
  };
}

export function getAllCourses(): CourseMeta[] {
  if (!fs.existsSync(COURSES_DIR)) return [];
  return fs
    .readdirSync(COURSES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => readCourse(d.name))
    .filter((c): c is CourseMeta => c !== null)
    .filter((c) => !c.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => a.year - b.year);
}

export function getCourse(slug: string): CourseMeta | null {
  const course = readCourse(slug);
  if (!course) return null;
  if (course.draft && process.env.NODE_ENV !== "development") return null;
  return course;
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return null;
  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;
  const index = course.lessons.indexOf(lesson);
  return {
    course,
    lesson,
    prev: course.lessons[index - 1] ?? null,
    next: course.lessons[index + 1] ?? null,
  };
}
