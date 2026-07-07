/** Strip non-style metadata before StyleSheet.create (react-pdf rejects unknown keys). */
export function sanitizePdfSheet<T extends Record<string, Record<string, unknown>>>(
  sheet: T,
): T {
  const next: Record<string, Record<string, unknown>> = { ...sheet };

  if (next.contact && "linkColor" in next.contact) {
    const { linkColor: _lc, ...contact } = next.contact;
    next.contact = contact;
  }

  if (next.bullet && "markColor" in next.bullet) {
    const { markColor: _mc, ...bullet } = next.bullet;
    next.bullet = bullet;
  }

  if (next.skillsGrid && "gap" in next.skillsGrid) {
    const { gap: _g, ...skillsGrid } = next.skillsGrid;
    next.skillsGrid = skillsGrid;
  }

  return next as T;
}