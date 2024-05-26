export default function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }