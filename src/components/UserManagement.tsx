import React from 'react';
import { User } from '../types';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (id: string, user: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser }) => (
  <section className="bg-white rounded-2xl border border-dashed border-purple-300 p-8">
    <h2 className="text-xl font-bold text-slate-900">Gestión de usuarios pendiente</h2>
    <p className="mt-2 text-sm text-slate-600">La rama del compañero reemplazará este módulo.</p>
    <p className="mt-1 text-xs text-slate-500">Sesión: {currentUser.name}. Usuarios cargados: {users.length}.</p>
  </section>
);
