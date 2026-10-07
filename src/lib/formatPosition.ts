export const SCHOOL_ABBREVIATIONS: Record<string, string> = {
  'School of Agriculture & Food Science': 'SAFS',
  'School of Agriculture and Food Science': 'SAFS',
  'School of Business & Economics': 'SBE',
  'School of Business and Economics': 'SBE',
  'School of Computing & Informatics': 'SCI',
  'School of Computing and Informatics': 'SCI',
  'School of Education': 'SED',
  'School of Engineering & Architecture': 'SEA',
  'School of Engineering and Architecture': 'SEA',
  'School of Health Sciences': 'SHS',
  'School of Nursing': 'SON',
  'School of Pure & Applied Sciences': 'SPA',
  'School of Pure and Applied Sciences': 'SPA',
};

export const formatPositionName = (position: string): string => {
  if (!position) return position;
  let formatted = position;
  for (const [full, short] of Object.entries(SCHOOL_ABBREVIATIONS)) {
    formatted = formatted.split(full).join(short);
  }
  return formatted;
};
