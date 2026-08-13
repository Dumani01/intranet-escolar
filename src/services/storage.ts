import { User, GradeRecord, AttendanceRecord, Announcement } from '../types';
import { initialUsers, initialGrades, initialAttendance, initialAnnouncements } from '../data/mockData';

const STORAGE_KEYS = {
  SESSION: 'intranet_session',
  USERS: 'intranet_users',
  GRADES: 'intranet_grades',
  ATTENDANCE: 'intranet_attendance',
  ANNOUNCEMENTS: 'intranet_announcements',
};

// --- SESSION MANAGEMENT ---
export function getSession(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error al leer la sesión de localStorage:', error);
    return null;
  }
}

export function saveSession(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar la sesión en localStorage:', error);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (error) {
    console.error('Error al eliminar la sesión de localStorage:', error);
  }
}

// --- USERS CRUD STORAGE ---
export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      saveUsers(initialUsers);
      return initialUsers;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar usuarios de localStorage:', error);
    return initialUsers;
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuarios en localStorage:', error);
  }
}

export function deleteUser(id: string): User[] {
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
  return users;
}

// Aliases for compatibility
export const getClients = getUsers;
export const saveClients = saveUsers;
export const deleteClient = deleteUser;

// --- GRADES STORAGE ---
export function getGrades(): GradeRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GRADES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(initialGrades));
      return initialGrades;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar calificaciones de localStorage:', error);
    return initialGrades;
  }
}

export function saveGrades(grades: GradeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  } catch (error) {
    console.error('Error al guardar calificaciones en localStorage:', error);
  }
}

// --- ATTENDANCE STORAGE ---
export function getAttendance(): AttendanceRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));
      return initialAttendance;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar asistencias de localStorage:', error);
    return initialAttendance;
  }
}

export function saveAttendance(attendance: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  } catch (error) {
    console.error('Error al guardar asistencias en localStorage:', error);
  }
}

// --- ANNOUNCEMENTS STORAGE ---
export function getAnnouncements(): Announcement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(initialAnnouncements));
      return initialAnnouncements;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar comunicados de localStorage:', error);
    return initialAnnouncements;
  }
}

export function saveAnnouncements(announcements: Announcement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  } catch (error) {
    console.error('Error al guardar comunicados en localStorage:', error);
  }
}
