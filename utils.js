export function splitTextIntoSegments(text) {
  return text
    .split(/\n\n+/) // split on blank lines
    .map(s => s.trim())
    .filter(Boolean);
}
