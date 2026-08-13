import React from 'react';
import { School, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onSelectRole: (role: User['role']) => void;
  onOpenAuthModal: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onOpenAuthModal, onOpenProfile }) => (
  <header className="bg-white border-b border-slate-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 text-blue-700">
          <School className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-none">Intranet Escolar</h1>
          <p className="text-[11px] text-slate-500 mt-1">Base compartida del equipo</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpenProfile} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </span>
          {currentUser.name}
        </button>
        <button type="button" onClick={onOpenAuthModal} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition">
          <ShieldCheck className="w-4 h-4" />
          Cambiar sesión
        </button>
      </div>
    </div>
  </header>
);
