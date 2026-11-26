export function commentListText(english: string, chinese: string): string {
  return /^en(?:[-_]|$)/i.test(ibiz.i18n.getLang()) ? english : chinese;
}

export function formatCommentTime(
  value: string | undefined,
  language: string,
  now = new Date(),
): string | undefined {
  if (!value) return value;
  const parts = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!parts) return value;
  const [, year, month, day, hour, minute, second] = parts;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() + 1 !== Number(month) ||
    date.getDate() !== Number(day) ||
    Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59
  ) return value;
  const calendarDay = (current: Date): number =>
    Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
  const days = (calendarDay(now) - calendarDay(date)) / 86400000;
  const labels = /^en(?:[-_]|$)/i.test(language)
    ? ['Today', 'Yesterday', 'The day before yesterday']
    : ['今天', '昨天', '前天'];
  const time = `${hour}:${minute}`;
  if (days >= 0 && days <= 2) return `${labels[days]} ${time}`;
  return `${date.getFullYear() === now.getFullYear() ? `${month}-${day}` : `${year}-${month}-${day}`} ${time}`;
}
