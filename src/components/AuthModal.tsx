import React from 'react';
import { User } from '../types';

interface AuthModalProps {
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentUser, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
    <section className="bg-white rounded-2xl p-6 max-w-md w-full">
      <h2 className="font-bold text-slate-900">Autenticación pendiente</h2>
      <p className="mt-2 text-sm text-slate-600">La rama del compañero reemplazará este módulo. Usuario actual: {currentUser.name}.</p>
      <button type="button" onClick={onClose} className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white">Cerrar</button>
    </section>
  </div>
);
