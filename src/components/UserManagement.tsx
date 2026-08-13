import React, { useState } from 'react';
import { User } from '../types';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (id: string, user: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'estudiante' as User['role'],
    status: 'activo' as User['status'],
    grade: '',
    subject: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onAddUser({
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
      grade: form.grade || undefined,
      subject: form.subject || undefined,
    });
    setForm({ name: '', email: '', role: 'estudiante', status: 'activo', grade: '', subject: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900">Gestión de usuarios</h2>
        <p className="mt-1 text-sm text-slate-500">Sesión activa: {currentUser.name}</p>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Listado de usuarios</h3>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200 rounded-xl p-3">
                <div>
                  <div className="font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email} • {user.role}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateUser(user.id, { status: user.status === 'activo' ? 'inactivo' : 'activo' })}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  >
                    {user.status === 'activo' ? 'Desactivar' : 'Activar'}
                  </button>
                  <button type="button" onClick={() => onDeleteUser(user.id)} className="px-2.5 py-1.5 text-xs rounded-lg bg-rose-600 text-white">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Nuevo usuario</h3>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo electrónico" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })} className="w-full px-3 py-2 border border-slate-200 rounded-xl">
              <option value="admin">Administrador</option>
              <option value="docente">Docente</option>
              <option value="estudiante">Estudiante</option>
              <option value="familia">Familia</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as User['status'] })} className="w-full px-3 py-2 border border-slate-200 rounded-xl">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="Curso (opcional)" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Asignatura (opcional)" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-medium">Añadir usuario</button>
          </form>
        </section>
      </div>
    </div>
  );
};
