// API response types that match backend schemas

export interface Book {
  id: string;
  title: string;
  subject: string;
  class_level: string;
  board: string;
  condition: string;
  city?: string;
  area?: string;
  description?: string;
  image_urls: string[];
  donor_uid: string;
  donor_name?: string;
  available: boolean;
  is_set?: boolean;
  created_at?: string;
}

export interface BookRequest {
  id: string;
  book_id: string;
  requester_uid: string;
  requester_name?: string;
  requester_location?: string;
  donor_uid: string;
  donor_name?: string;
  donor_location?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  pickup_location?: string;
  reason?: string;
  quantity?: number;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_uid: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  request_id: string;
  users: string[];
  active: boolean;
  created_at?: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  class_level: string;
  board: string;
  file_url: string;
  owner_uid: string;
  created_at?: string;
}

export interface ImpactStats {
  books_reused?: number;
  students_helped?: number;
  paper_saved_kg?: number;
  money_saved_inr?: number;
}

