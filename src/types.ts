export type UserRole = 'admin' | 'docente' | 'estudiante' | 'familia';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade?: string; // e.g. "1º ESO A", "2º Bachillerato B"
  subject?: string; // e.g. "Matemáticas", "Lengua y Literatura" (for teachers)
  representedStudentId?: string; // for families
  avatarUrl?: string;
  status: 'activo' | 'inactivo';
  password?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  term: 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3';
  score: number; // 0 to 10
  comments?: string;
  date: string;
}

export type AttendanceStatus = 'presente' | 'ausente_injustificada' | 'ausente_justificada' | 'tardanza';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Aviso' | 'Urgente' | 'Evento';
  targetRole: 'Todos' | 'Docentes' | 'Estudiantes' | 'Familias';
  author: string;
  date: string;
  aiSummary?: string;
}
