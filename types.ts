export type Recurrence = 'none' | 'yearly' | 'monthly';
export interface SavedEvent { id: string; name: string; emoji: string; date: string; recurrence: Recurrence; leapRule: 'feb28' | 'mar1'; createdAt: string; }
