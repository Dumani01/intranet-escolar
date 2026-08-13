import React from 'react';
import { User } from '../types';

interface UserProfileProps {
  currentUser: User;
  users: User[];
  onUpdateUser: (id: string, updated: Partial<User>) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ currentUser }) => (
  <section className="bg-white rounded-2xl border border-dashed border-purple-300 p-8">
    <h2 className="text-xl font-bold text-slate-900">Perfil pendiente</h2>
    <p className="mt-2 text-sm text-slate-600">La rama del compañero reemplazará el perfil de {currentUser.name}.</p>
  </section>
);
