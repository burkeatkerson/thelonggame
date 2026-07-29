/** Content types — what a piece is, orthogonal to where on the horizon it sits. */

export type ContentType =
  | "roadmap"
  | "deep-dive"
  | "case-study"
  | "template"
  | "glossary"
  | "mindset";

export const CONTENT_TYPES: Record<ContentType, { name: string; blurb: string }> = {
  roadmap: {
    name: "Roadmap",
    blurb: "What to do at this point of the plan, in order.",
  },
  "deep-dive": {
    name: "Deep dive",
    blurb: "One mechanism, taken apart until it stops being mysterious.",
  },
  "case-study": {
    name: "Case study",
    blurb: "A real deal with real numbers, including the mistakes.",
  },
  template: {
    name: "Template",
    blurb: "A document, checklist or calendar you can use as-is.",
  },
  glossary: {
    name: "Glossary",
    blurb: "A term, defined the way it behaves on an actual closing statement.",
  },
  mindset: {
    name: "Mindset",
    blurb: "The psychology of holding a twenty-year position in a this-quarter world.",
  },
};

export const CONTENT_TYPE_ORDER: ContentType[] = [
  "roadmap",
  "deep-dive",
  "case-study",
  "template",
  "glossary",
  "mindset",
];

export function isContentType(value: string): value is ContentType {
  return value in CONTENT_TYPES;
}
