import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// created by chatgpt
export const isBase64Image = (imageData: string) => {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
export const formatDateString = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString([], options);

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${time} - ${formattedDate}`;
}

// created by chatgpt
export const formatThreadCount = (count: number) => {
  if (count === 0) {
    return 'No Threads';
  } else {
    const threadCount = count.toString().padStart(2, '0');
    const threadWord = count === 1 ? 'Thread' : 'Threads';
    return `${threadCount} ${threadWord}`;
  }
}
