import React from 'react';
import { Announcement, AttendanceRecord, User } from '../types';

interface AIAssistantModuleProps {
  currentUser: User;
  users: User[];
  attendance: AttendanceRecord[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({ currentUser, attendance }) => (
  <section className="bg-white rounded-2xl border border-dashed border-purple-300 p-8">
    <h2 className="text-xl font-bold text-slate-900">Asistente de IA pendiente</h2>
    <p className="mt-2 text-sm text-slate-600">La rama del compañero reemplazará este módulo para {currentUser.name}.</p>
    <p className="mt-1 text-xs text-slate-500">Registros disponibles para análisis: {attendance.length}.</p>
  </section>
);
