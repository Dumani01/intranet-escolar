import React from 'react';
import { AttendanceRecord, GradeRecord, User } from '../types';

interface AcademicModuleProps {
  currentUser: User;
  users: User[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  onAddGrade: (grade: Omit<GradeRecord, 'id' | 'date'>) => void;
  onAddAttendance: (attendance: Omit<AttendanceRecord, 'id'>) => void;
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({ currentUser, grades, attendance }) => (
  <section className="bg-white rounded-2xl border border-dashed border-blue-300 p-8">
    <h2 className="text-xl font-bold text-slate-900">Módulo académico pendiente</h2>
    <p className="mt-2 text-sm text-slate-600">La rama de Jared reemplazará este componente para {currentUser.name}.</p>
    <p className="mt-1 text-xs text-slate-500">Base: {grades.length} calificaciones y {attendance.length} asistencias.</p>
  </section>
);
