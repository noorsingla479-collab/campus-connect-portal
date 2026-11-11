export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ClassEntry {
  id: string;
  day: Day;
  startTime: string;
  endTime: string;
  subject: string;
  code: string;
  room: string;
  faculty: string;
}

export type EventCategory = 'Workshop' | 'Competition' | 'Cultural' | 'Society';

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  organizer: string;
}

export type Priority = 'High' | 'Medium' | 'Low';

export type NoticeCategory = 'Academic' | 'Events' | 'Examination' | 'General';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  priority: Priority;
  date: string;
  author: string;
}

export type LostCategory = 'Electronics' | 'Documents' | 'Accessories' | 'Books' | 'Clothing' | 'Other';

export interface LostFoundItem {
  id: string;
  type: 'Lost' | 'Found';
  name: string;
  description: string;
  location: string;
  category: LostCategory;
  contact: string;
  date: string;
}

export interface Facility {
  id: string;
  name: string;
  category: 'Library' | 'Academic Block' | 'Hostel' | 'Cafeteria' | 'Medical Centre' | 'Sports';
  description: string;
  building: string;
  hours: string;
  contact: string;
}

export interface Profile {
  name: string;
  studentId: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  bio: string;
}
