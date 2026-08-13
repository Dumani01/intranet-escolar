import React from 'react';
import { User } from '../types';

interface AuthModalProps {
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ users, currentUser, onSelectUser, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
    <section className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-xl">Cambiar sesión</h2>
        <button type="button" onClick={onClose} className="text-sm text-slate-500">Cerrar</button>
      </div>
      <p className="mt-2 text-sm text-slate-600">Usuario actual: {currentUser.name}</p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => {
              onSelectUser(user);
              onClose();
            }}
            className={`text-left p-3 rounded-xl border transition ${currentUser.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
          >
            <div className="font-semibold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role}</div>
          </button>
        ))}
      </div>
    </section>
  </div>
);
