import React from 'react';
import { Announcement, UserRole } from '../types';

interface AnnouncementsModuleProps {
  announcements: Announcement[];
  userRole: UserRole;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

export const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({ announcements, userRole }) => (
  <section className="bg-white rounded-2xl border border-dashed border-blue-300 p-8">
    <h2 className="text-xl font-bold text-slate-900">Módulo de comunicados pendiente</h2>
    <p className="mt-2 text-sm text-slate-600">La rama de Jared reemplazará este componente. Rol activo: {userRole}.</p>
    <p className="mt-1 text-xs text-slate-500">Registros disponibles en la base: {announcements.length}</p>
  </section>
);
