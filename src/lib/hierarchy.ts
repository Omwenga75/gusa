/**
 * Hierarchy ranking for leadership positions in GUSA.
 *
 * Rank Order (fixed top positions regardless of when they were added or edited):
 * 1. Chairperson
 * 2. Vice Chairperson
 * 3. Secretary General
 * 4. Finance / Treasurer
 * 5. Speaker
 * 6. Legal Advisor
 * ... All other positions (any order among themselves)
 */

export function getPositionRank(position?: string | null): number {
  if (!position) return 999;
  const p = position.toLowerCase().trim();

  // Vice Chairperson must be matched before the generic "chair" check
  if (p.includes('vice') && (p.includes('chair') || p.includes('president'))) return 2;

  // Top Executives (in fixed order)
  if (p.includes('chair') || p.includes('president')) return 1; // Chairperson

  if (
    p.includes('secretary general') ||
    p.includes('sec gen') ||
    p === 'sg' ||
    p.includes('past secretary general')
  ) {
    return 3; // Secretary General
  }

  if (p.includes('finance') || p.includes('treasurer')) return 4; // Finance

  if (p.includes('speaker')) return 5; // Speaker

  if (p.includes('legal')) return 6; // Legal Advisor

  return 50; // All other positions
}

export function compareLeaderHierarchy<T extends { position: string; name?: string }>(a: T, b: T): number {
  const rankA = getPositionRank(a.position);
  const rankB = getPositionRank(b.position);
  if (rankA !== rankB) return rankA - rankB;
  return (a.name || '').localeCompare(b.name || '');
}
