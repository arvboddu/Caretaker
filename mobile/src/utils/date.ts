export function format(date: Date, formatStr: string): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
  
  return formatStr
    .replace('yyyy', String(year))
    .replace('MM', String(month + 1).padStart(2, '0'))
    .replace('dd', String(day).padStart(2, '0'))
    .replace('d', String(day))
    .replace('EEE', dayName)
    .replace('MMM', monthName)
    .replace('HH:mm', '00:00')
    .replace('HH', '00');
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfWeek(date: Date, options?: { weekStartsOn?: number }): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day - (options?.weekStartsOn || 0);
  d.setDate(d.getDate() - diff);
  return d;
}
