export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function getTimeUntilDue(dueDate: Date): string {
  const now = new Date()
  const diffMs = dueDate.getTime() - now.getTime()
  
  if (diffMs < 0) {
    return 'Overdue'
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h left`
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m left`
  } else {
    return `${diffMinutes}m left`
  }
}

export function calculateXP(priority: 'low' | 'medium' | 'high' | 'critical'): number {
  const xpMap = {
    low: 10,
    medium: 25,
    high: 50,
    critical: 100,
  }
  return xpMap[priority] || 10
}