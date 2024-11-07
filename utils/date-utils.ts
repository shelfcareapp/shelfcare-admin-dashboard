export function removeDuplicates(dates: any[]) {
  const uniqueDates = new Map();
  dates.forEach((date) => {
    uniqueDates.set(date.date.toISOString(), date);
  });
  return Array.from(uniqueDates.values());
}

export function formatTxtToDates(datesText: string): any[] {
  const lines = datesText.split('\n');

  const formatted = lines
    .filter((line) => line.trim())
    .map((line) => {
      const [datePart, timePart] = line.split(' klo ');

      const startTime = timePart.split('-')[0];

      const formattedTime = startTime.replace('.', ':');

      const dateTimeStr = `${datePart} ${formattedTime}`;

      const parsedDate = new Date(dateTimeStr);

      return {
        date: parsedDate,
        details: timePart.trim(),
        displayTime: timePart.trim()
      };
    })
    .filter((item) => !isNaN(item.date.getTime()));

  return formatted;
}

export function isAfter(date: Date, today: Date): boolean {
  return date.getTime() > today.getTime();
}
