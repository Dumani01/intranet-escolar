import React from 'react';
import { AttendanceRecord, User } from '../types';

interface AttendanceChartProps {
  attendance: AttendanceRecord[];
  students: User[];
  selectedStudentId?: string;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ attendance, students }) => (
  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
    Gráfico pendiente: {attendance.length} registros para {students.length} estudiantes.
  </div>
);
