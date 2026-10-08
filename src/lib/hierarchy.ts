/**
 * Hierarchy ranking for leadership positions in GUSA.
 *
 * Rank Order:
 * 1. Chairperson / Past Chairperson
 * 2. Vice Chairperson / Past Vice Chairperson
 * 3. Secretary General / Past Secretary General
 * 4. Finance / Treasurer
 * 5. Speaker
 * 6. Deputy Speaker
 * 7. HCA
 * 8. Sports, Gender & Social Welfare Secretary
 * 9. Academics & Affairs Secretary
 * 10. Delegates
 * ... Other positions
 */

export function getPositionRank(position?: string | null): number {
  if (!position) return 999;
  const p = position.toLowerCase().trim();

  // Vice / Deputy checks first
  if (p.includes('vice') || p.includes('deputy')) {
    if (p.includes('chair') || p.includes('president')) return 2; // Vice Chairperson / Past Vice Chairperson
    if (p.includes('speaker')) return 6; // Deputy Speaker
    if (p.includes('sec') || p.includes('sg')) return 4; // Deputy SG
    return 20;
  }

  // Top Executives
  if (p.includes('chair') || p.includes('president')) return 1; // Chairperson / Past Chairperson
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
  if (p.includes('hca')) return 7; // HCA
  if (p.includes('sport') || p.includes('gender') || p.includes('welfare')) return 8; // Sports & Welfare
  if (p.includes('academic') || p.includes('affairs')) return 9; // Academics
  if (p.includes('delegate')) return 10; // Delegates

  return 50; // Other roles
}

export function compareLeaderHierarchy<T extends { position: string; name?: string }>(a: T, b: T): number {
  const rankA = getPositionRank(a.position);
  const rankB = getPositionRank(b.position);
  if (rankA !== rankB) return rankA - rankB;
  return (a.name || '').localeCompare(b.name || '');
}
