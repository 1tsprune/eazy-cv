export function sanitizeText(str: string): string {
  if (!str || typeof str !== "string") return "";
  let result = str;

  result = result.replace(/[\u2014\u2013\u2011]/g, "-");
  result = result.replace(/[\u2018\u2019]/g, "'");
  result = result.replace(/[\u201C\u201D]/g, '"');
  result = result.replace(/\u00A0/g, " ");
  result = result.replace(/ +([,.])/g, "$1");
  result = result.replace(/ {2,}/g, " ");

  return result.trim();
}

export function sanitizeResumeData<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") return sanitizeText(data) as T;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeResumeData(item)) as T;
  }
  if (typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(data as object)) {
      result[key] = sanitizeResumeData(
        (data as Record<string, unknown>)[key],
      );
    }
    return result as T;
  }
  return data;
}