import React from 'react';
import { User } from '../types';
import { School, UserCheck, LogOut, Sparkles, Shield, GraduationCap, Users, UserCheck2 } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onSelectRole: (role: User['role']) => void;
  onOpenAuthModal: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onSelectRole, onOpenAuthModal, onOpenProfile }) => {
  const roleLabels: Record<User['role'], string> = {
    admin: 'Administración',
    docente: 'Docente',
    estudiante: 'Estudiante',
    familia: 'Familia',
  };

  const roleColors: Record<User['role'], string> = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    docente: 'bg-blue-100 text-blue-800 border-blue-200',
    estudiante: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    familia: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const roleIcons: Record<User['role'], React.ReactNode> = {
    admin: <Shield className="w-3.5 h-3.5 mr-1" />,
    docente: <UserCheck2 className="w-3.5 h-3.5 mr-1" />,
    estudiante: <GraduationCap className="w-3.5 h-3.5 mr-1" />,
    familia: <Users className="w-3.5 h-3.5 mr-1" />,
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
              Intranet Escolar
              <span className="text-xs font-normal bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                Pública
              </span>
            </h1>
            <p className="text-xs text-slate-500">Sistema de Gestión e Integración con IA</p>
          </div>
        </div>

        {/* User profile & Role switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium px-1">Cambio rápido:</span>
            {(['admin', 'docente', 'estudiante', 'familia'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onSelectRole(r)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium capitalize ${
                  currentUser.role === r
                    ? 'bg-white shadow-xs text-blue-700 border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div
            onClick={onOpenProfile}
            className="flex items-center space-x-3 pl-2 border-l border-slate-200 cursor-pointer group"
            title="Ver mi perfil"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-blue-500 transition-all"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-800 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                {currentUser.name}
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border font-medium ${roleColors[currentUser.role]}`}>
                  {roleIcons[currentUser.role]}
                  {roleLabels[currentUser.role]}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAuthModal();
              }}
              title="Cambiar usuario de prueba"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
