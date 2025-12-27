// Mock data for EduCycle platform

export interface Book {
  id: string;
  title: string;
  subject: string;
  class: string;
  board: 'CBSE' | 'ICSE' | 'State' | 'University';
  year: number;
  edition: string;
  condition: 'Good' | 'Usable' | 'Damaged';
  coverImage: string;
  insideImage?: string;
  donorName: string;
  donorReputation: number;
  distance: string;
  available: boolean;
}

export interface Request {
  id: string;
  bookId: string;
  bookTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  pickupPreference: string;
  requestDate: string;
  pickupLocation?: string;
  pickupDate?: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  class: string;
  type: 'PDF' | 'Notes';
  downloads: number;
  uploadDate: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export interface ImpactStats {
  booksReceived: number;
  moneySaved: number;
  paperSaved: number;
  eduCredits: number;
  treesProtected: number;
}

export interface NGOStats {
  studentsHelped: number;
  booksReused: number;
  costSaved: number;
  co2Saved: number;
}

// Mock Books Data
export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Mathematics for Class 10',
    subject: 'Mathematics',
    class: '10',
    board: 'CBSE',
    year: 2023,
    edition: '2023 Edition',
    condition: 'Good',
    coverImage: '/placeholder.svg',
    insideImage: '/placeholder.svg',
    donorName: 'Priya S.',
    donorReputation: 4.8,
    distance: '2.5 km',
    available: true,
  },
  {
    id: '2',
    title: 'Science: Physics & Chemistry',
    subject: 'Science',
    class: '9',
    board: 'CBSE',
    year: 2023,
    edition: '2023 Edition',
    condition: 'Usable',
    coverImage: '/placeholder.svg',
    donorName: 'Rahul M.',
    donorReputation: 4.5,
    distance: '1.8 km',
    available: true,
  },
  {
    id: '3',
    title: 'English Literature',
    subject: 'English',
    class: '12',
    board: 'ICSE',
    year: 2022,
    edition: '2022 Edition',
    condition: 'Good',
    coverImage: '/placeholder.svg',
    donorName: 'Anita K.',
    donorReputation: 5.0,
    distance: '3.2 km',
    available: true,
  },
  {
    id: '4',
    title: 'History & Civics',
    subject: 'Social Studies',
    class: '8',
    board: 'State',
    year: 2023,
    edition: '2023 Edition',
    condition: 'Damaged',
    coverImage: '/placeholder.svg',
    donorName: 'Vikram R.',
    donorReputation: 4.2,
    distance: '4.0 km',
    available: true,
  },
  {
    id: '5',
    title: 'Hindi Sahitya',
    subject: 'Hindi',
    class: '11',
    board: 'CBSE',
    year: 2023,
    edition: '2023 Edition',
    condition: 'Good',
    coverImage: '/placeholder.svg',
    donorName: 'Meera P.',
    donorReputation: 4.9,
    distance: '1.2 km',
    available: true,
  },
  {
    id: '6',
    title: 'Biology: Living World',
    subject: 'Biology',
    class: '11',
    board: 'CBSE',
    year: 2022,
    edition: '2022 Edition',
    condition: 'Usable',
    coverImage: '/placeholder.svg',
    donorName: 'Suresh K.',
    donorReputation: 4.6,
    distance: '2.8 km',
    available: true,
  },
];

// Mock Requests Data
export const mockRequests: Request[] = [
  {
    id: 'req1',
    bookId: '1',
    bookTitle: 'Mathematics for Class 10',
    status: 'approved',
    reason: 'Need for board exams preparation',
    pickupPreference: 'School Library',
    requestDate: '2024-01-15',
    pickupLocation: 'Delhi Public School, Main Gate',
    pickupDate: '2024-01-20',
  },
  {
    id: 'req2',
    bookId: '3',
    bookTitle: 'English Literature',
    status: 'pending',
    reason: 'Required for class studies',
    pickupPreference: 'NGO Center',
    requestDate: '2024-01-18',
  },
  {
    id: 'req3',
    bookId: '4',
    bookTitle: 'History & Civics',
    status: 'rejected',
    reason: 'For project work',
    pickupPreference: 'Library',
    requestDate: '2024-01-10',
  },
];

// Mock Notes Data
export const mockNotes: Note[] = [
  {
    id: 'note1',
    title: 'CBSE Class 10 Math Formulas',
    subject: 'Mathematics',
    class: '10',
    type: 'PDF',
    downloads: 1250,
    uploadDate: '2024-01-10',
  },
  {
    id: 'note2',
    title: 'Physics Chapter Summaries',
    subject: 'Science',
    class: '12',
    type: 'Notes',
    downloads: 890,
    uploadDate: '2024-01-08',
  },
  {
    id: 'note3',
    title: 'English Grammar Quick Guide',
    subject: 'English',
    class: '9',
    type: 'PDF',
    downloads: 2100,
    uploadDate: '2024-01-05',
  },
  {
    id: 'note4',
    title: 'Chemistry Reactions List',
    subject: 'Science',
    class: '11',
    type: 'PDF',
    downloads: 756,
    uploadDate: '2024-01-12',
  },
];

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'donor1',
    senderName: 'Priya (Donor)',
    message: 'Hi! I can meet at the school library tomorrow at 4 PM.',
    timestamp: '2024-01-19 14:30',
  },
  {
    id: 'msg2',
    senderId: 'student1',
    senderName: 'You',
    message: 'That works for me! I will be there.',
    timestamp: '2024-01-19 14:35',
  },
  {
    id: 'msg3',
    senderId: 'donor1',
    senderName: 'Priya (Donor)',
    message: 'Great! See you tomorrow. The book is in good condition.',
    timestamp: '2024-01-19 14:40',
  },
];

// Mock Impact Stats for Student
export const mockStudentImpact: ImpactStats = {
  booksReceived: 12,
  moneySaved: 4500,
  paperSaved: 24,
  eduCredits: 350,
  treesProtected: 2,
};

// Mock Impact Stats for NGO
export const mockNGOStats: NGOStats = {
  studentsHelped: 1250,
  booksReused: 3500,
  costSaved: 875000,
  co2Saved: 2100,
};

// Filter Options
export const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const boardOptions = ['CBSE', 'ICSE', 'State', 'University'];
export const subjectOptions = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Biology', 'Physics', 'Chemistry'];
export const yearOptions = [2024, 2023, 2022, 2021, 2020];

// NGO Bulk Requests
export interface BulkRequest {
  id: string;
  class: string;
  board: string;
  subject: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'partial' | 'fulfilled';
  fulfilled: number;
  requestDate: string;
}

export const mockBulkRequests: BulkRequest[] = [
  {
    id: 'bulk1',
    class: '10',
    board: 'CBSE',
    subject: 'Mathematics',
    quantity: 50,
    reason: 'For underprivileged students in our center',
    status: 'partial',
    fulfilled: 35,
    requestDate: '2024-01-10',
  },
  {
    id: 'bulk2',
    class: '8',
    board: 'State',
    subject: 'Science',
    quantity: 30,
    reason: 'New batch of students joining',
    status: 'fulfilled',
    fulfilled: 30,
    requestDate: '2024-01-05',
  },
  {
    id: 'bulk3',
    class: '12',
    board: 'CBSE',
    subject: 'English',
    quantity: 25,
    reason: 'Board exam preparation support',
    status: 'pending',
    fulfilled: 0,
    requestDate: '2024-01-18',
  },
];

// NGO Collection Data
export interface CollectionItem {
  id: string;
  donorName: string;
  booksCount: number;
  pickupLocation: string;
  scheduledDate: string;
  collected: boolean;
}

export const mockCollections: CollectionItem[] = [
  {
    id: 'col1',
    donorName: 'Sharma Family',
    booksCount: 15,
    pickupLocation: 'Community Center, Sector 12',
    scheduledDate: '2024-01-22',
    collected: false,
  },
  {
    id: 'col2',
    donorName: 'Green Valley School',
    booksCount: 100,
    pickupLocation: 'School Main Office',
    scheduledDate: '2024-01-20',
    collected: true,
  },
  {
    id: 'col3',
    donorName: 'Patel Store',
    booksCount: 25,
    pickupLocation: 'Patel Stationery, Main Market',
    scheduledDate: '2024-01-25',
    collected: false,
  },
];

// NGO Distribution Data
export interface DistributionItem {
  id: string;
  schoolName: string;
  studentsCount: number;
  booksDistributed: number;
  date: string;
  verified: boolean;
}

export const mockDistributions: DistributionItem[] = [
  {
    id: 'dist1',
    schoolName: 'Government Primary School, Ward 5',
    studentsCount: 45,
    booksDistributed: 90,
    date: '2024-01-15',
    verified: true,
  },
  {
    id: 'dist2',
    schoolName: 'Sunrise Foundation Center',
    studentsCount: 30,
    booksDistributed: 60,
    date: '2024-01-18',
    verified: true,
  },
  {
    id: 'dist3',
    schoolName: 'Hope Learning Center',
    studentsCount: 25,
    booksDistributed: 0,
    date: '2024-01-28',
    verified: false,
  },
];
