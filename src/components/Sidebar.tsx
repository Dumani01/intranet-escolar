import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
}

const tabs = [
  ['comunicados', 'Comunicados'],
  ['academico', 'Académico'],
  ['usuarios', 'Usuarios'],
  ['asistente-ia', 'Asistente IA'],
  ['perfil', 'Perfil'],
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, userRole }) => (
  <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4">
    <p className="px-3 mb-3 text-xs font-semibold uppercase text-slate-400">Rol: {userRole}</p>
    <nav className="space-y-1">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${currentTab === id ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
        >
          {label}
        </button>
      ))}
    </nav>
  </aside>
);
