import React from 'react';
import { UserRole } from '../types';
import { Megaphone, GraduationCap, Users, Sparkles, UserCircle, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, userRole }) => {
  const navItems = [
    {
      id: 'comunicados',
      label: 'Tablón de Comunicados',
      icon: <Megaphone className="w-5 h-5" />,
      allowedRoles: ['admin', 'docente', 'estudiante', 'familia'],
    },
    {
      id: 'academico',
      label: 'Módulo Académico',
      icon: <GraduationCap className="w-5 h-5" />,
      allowedRoles: ['admin', 'docente', 'estudiante', 'familia'],
    },
    {
      id: 'usuarios',
      label: 'Gestión de Usuarios',
      icon: <Users className="w-5 h-5" />,
      allowedRoles: ['admin'], // Strictly RBAC restricted to admin
    },
    {
      id: 'asistente-ia',
      label: 'Asistente de IA (Gemini)',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      allowedRoles: ['admin', 'docente'],
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: <UserCircle className="w-5 h-5" />,
      allowedRoles: ['admin', 'docente', 'estudiante', 'familia'],
    },
  ];

  const visibleItems = navItems.filter((item) => item.allowedRoles.includes(userRole));

  return (
    <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200 shrink-0 p-4 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navegación Intranet
          </h2>
          <nav className="space-y-1">
            {visibleItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* RBAC Info Card */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1.5">
          <div className="flex items-center font-semibold text-blue-800">
            <ShieldAlert className="w-4 h-4 mr-1.5 shrink-0 text-blue-600" />
            Acceso Basado en Rol
          </div>
          <p className="text-slate-600 leading-relaxed">
            Vista activa ajustada a los permisos de <strong>{userRole.toUpperCase()}</strong>. Los accesos están protegidos en el cliente y servidor.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 text-xs text-slate-400 text-center">
        Intranet Escolar v1.0.0
      </div>
    </aside>
  );
};
