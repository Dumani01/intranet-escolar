import React from 'react';
import { UserRole } from '../types';
import { Megaphone, GraduationCap, Users, Sparkles, UserCircle } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
}

const tabs = [
  ['comunicados', 'Comunicados', Megaphone],
  ['academico', 'Académico', GraduationCap],
  ['usuarios', 'Usuarios', Users],
  ['asistente-ia', 'Asistente IA', Sparkles],
  ['perfil', 'Perfil', UserCircle],
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, userRole }) => (
  <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4">
    <div className="mb-4 rounded-xl bg-white border border-slate-200 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Rol activo</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 capitalize">{userRole}</p>
    </div>
    <nav className="space-y-1">
      {tabs.map(([id, label, Icon]) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${currentTab === id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  </aside>
);
