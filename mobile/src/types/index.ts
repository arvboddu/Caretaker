export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'caretaker';
}

export interface Caretaker {
  id: string;
  fullName: string;
  bio: string;
  skills: string[];
  yearsExperience: number;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  profilePhoto: string;
  availability: Record<string, { start: string; end: string } | null>;
}

export interface Booking {
  id: string;
  patientId: string;
  caretakerId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  serviceNotes: string;
  address: string;
  caretaker?: Caretaker;
  patient?: { fullName: string };
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  status: string;
}

export interface ChatThread {
  id: string;
  otherUser: { id: string; fullName: string; profilePhoto: string };
  lastMessage?: { content: string; createdAt: string };
  unreadCount: number;
}
