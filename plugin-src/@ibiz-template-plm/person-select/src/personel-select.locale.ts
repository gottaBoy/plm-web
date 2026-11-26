export function personSelectText(english: string, chinese: string): string {
  return /^en(?:[-_]|$)/i.test(ibiz.i18n.getLang()) ? english : chinese;
}
