import React from 'react';
import { School } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onSelectRole: (role: User['role']) => void;
  onOpenAuthModal: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onOpenAuthModal, onOpenProfile }) => (
  <header className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <School className="w-7 h-7 text-blue-600" />
        <div>
          <h1 className="font-bold text-slate-900">Intranet Escolar</h1>
          <p className="text-xs text-slate-500">Base compartida del equipo</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpenProfile} className="text-sm font-medium text-slate-700">
          {currentUser.name}
        </button>
        <button type="button" onClick={onOpenAuthModal} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">
          Cambiar sesión
        </button>
      </div>
    </div>
  </header>
);
