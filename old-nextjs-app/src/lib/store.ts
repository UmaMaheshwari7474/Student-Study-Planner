// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Mock password check
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  date: string; // ISO String for Date
  time?: string; // e.g. "14:00"
  type: "exam" | "assignment" | "reading";
  completed: boolean;
  priority: "high" | "medium" | "low";
  reminders: string[]; // e.g. ["1 day before", "1 hour before"]
}

export interface ScheduleBlock {
  id: string;
  userId: string;
  subjectId: string;
  dayOfWeek: number; // 0-6 (Sun-Sat)
  startTime: string; // "14:00"
  endTime: string; // "16:00"
}

// Data Stores
let users: User[] = [];
let subjects: Subject[] = [];
let tasks: Task[] = [];
let schedules: ScheduleBlock[] = [];

// ---- USERS ----
export const getUser = (email: string) => users.find(u => u.email === email);
export const getUserById = (id: string) => users.find(u => u.id === id);
export const createUser = (user: Omit<User, "id">) => {
  const newUser = { ...user, id: Math.random().toString(36).substring(2, 9) };
  users.push(newUser);
  return newUser;
};

// ---- SUBJECTS ----
export const getSubjects = (userId: string) => subjects.filter(s => s.userId === userId);
export const getSubject = (id: string) => subjects.find(s => s.id === id);
export const addSubject = (subject: Omit<Subject, "id">) => {
  const newSubject = { ...subject, id: Math.random().toString(36).substring(2, 9) };
  subjects.push(newSubject);
  return newSubject;
};

// ---- TASKS ----
export const getTasks = (userId: string) => tasks.filter(t => t.userId === userId);
export const addTask = (task: Omit<Task, "id">) => {
  const newTask = { ...task, id: Math.random().toString(36).substring(2, 9) };
  tasks.push(newTask);
  return newTask;
};
export const updateTask = (id: string, userId: string, updates: Partial<Task>) => {
  const index = tasks.findIndex(t => t.id === id && t.userId === userId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  }
  return null;
};
export const deleteTask = (id: string, userId: string) => {
  tasks = tasks.filter(t => !(t.id === id && t.userId === userId));
};

// ---- SCHEDULES ----
export const getSchedules = (userId: string) => schedules.filter(s => s.userId === userId);
export const addSchedule = (schedule: Omit<ScheduleBlock, "id">) => {
  const newSchedule = { ...schedule, id: Math.random().toString(36).substring(2, 9) };
  schedules.push(newSchedule);
  return newSchedule;
};
export const deleteSchedule = (id: string, userId: string) => {
  schedules = schedules.filter(s => !(s.id === id && s.userId === userId));
};
