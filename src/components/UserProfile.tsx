import React, { useState } from 'react';
import { User } from '../types';

interface UserProfileProps {
  currentUser: User;
  users: User[];
  onUpdateUser: (id: string, updated: Partial<User>) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ currentUser, onUpdateUser }) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [status, setStatus] = useState(currentUser.status);

  const handleSave = () => {
    onUpdateUser(currentUser.id, { name, email, status });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900">Perfil de usuario</h2>
      <div className="mt-5 grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Correo</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as User['status'])} className="w-full px-3 py-2 border border-slate-200 rounded-xl">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      <button type="button" onClick={handleSave} className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium">Guardar cambios</button>
    </div>
  );
};
