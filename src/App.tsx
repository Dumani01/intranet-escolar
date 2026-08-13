import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AnnouncementsModule } from './components/AnnouncementsModule';
import { AcademicModule } from './components/AcademicModule';
import { UserManagement } from './components/UserManagement';
import { AIAssistantModule } from './components/AIAssistantModule';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';

import { User, GradeRecord, AttendanceRecord, Announcement, UserRole } from './types';
import {
  getClients,
  saveClients,
  getGrades,
  saveGrades,
  getAttendance,
  saveAttendance,
  getAnnouncements,
  saveAnnouncements,
  getSession,
  saveSession,
  clearSession,
} from './services/storage';

export default function App() {
  const [users, setUsers] = useState<User[]>(() => getClients());
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const session = getSession();
    if (session) return session;
    const initial = getClients();
    return initial.find((u) => u.role === 'admin') || initial[0];
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => getGrades());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getAttendance());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getAnnouncements());

  const [currentTab, setCurrentTab] = useState<string>('comunicados');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Sync states to LocalStorage on changes
  useEffect(() => {
    saveClients(users);
  }, [users]);

  useEffect(() => {
    saveGrades(grades);
  }, [grades]);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    saveAnnouncements(announcements);
  }, [announcements]);

  // Switch role handler
  const handleQuickRoleSwitch = (role: UserRole) => {
    const matchingUser = users.find((u) => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
      saveSession(matchingUser);
    } else {
      const tempUser = { ...currentUser, role };
      setCurrentUser(tempUser);
      saveSession(tempUser);
    }
  };

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    saveSession(user);
  };

  // Handlers for CRUD
  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const created: User = {
      ...newUser,
      id: `u-${Date.now()}`,
    };
    setUsers((prev) => {
      const updated = [created, ...prev];
      saveClients(updated);
      return updated;
    });
  };

  const handleUpdateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) => {
      const nextUsers = prev.map((u) => (u.id === id ? { ...u, ...updated } : u));
      saveClients(nextUsers);
      return nextUsers;
    });
    if (currentUser.id === id) {
      setCurrentUser((prev) => {
        const nextCurr = { ...prev, ...updated };
        saveSession(nextCurr);
        return nextCurr;
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => {
      const remaining = prev.filter((u) => u.id !== id);
      saveClients(remaining);
      return remaining;
    });
  };

  const handleAddGrade = (grade: Omit<GradeRecord, 'id' | 'date'>) => {
    const created: GradeRecord = {
      ...grade,
      id: `g-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setGrades((prev) => {
      const nextGrades = [created, ...prev];
      saveGrades(nextGrades);
      return nextGrades;
    });
  };

  const handleAddAttendance = (att: Omit<AttendanceRecord, 'id'>) => {
    const created: AttendanceRecord = {
      ...att,
      id: `a-${Date.now()}`,
    };
    setAttendance((prev) => {
      const nextAtt = [created, ...prev];
      saveAttendance(nextAtt);
      return nextAtt;
    });
  };

  const handleAddAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const created: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => {
      const nextAnn = [created, ...prev];
      saveAnnouncements(nextAnn);
      return nextAnn;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col">
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleQuickRoleSwitch}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenProfile={() => setCurrentTab('perfil')}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          userRole={currentUser.role}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {currentTab === 'comunicados' && (
            <AnnouncementsModule
              announcements={announcements}
              userRole={currentUser.role}
              onAddAnnouncement={handleAddAnnouncement}
            />
          )}

          {currentTab === 'academico' && (
            <AcademicModule
              currentUser={currentUser}
              users={users}
              grades={grades}
              attendance={attendance}
              onAddGrade={handleAddGrade}
              onAddAttendance={handleAddAttendance}
            />
          )}

          {currentTab === 'usuarios' && (
            <UserManagement
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {currentTab === 'asistente-ia' && (
            <AIAssistantModule
              currentUser={currentUser}
              users={users}
              attendance={attendance}
              onAddAnnouncement={handleAddAnnouncement}
            />
          )}

          {currentTab === 'perfil' && (
            <UserProfile
              currentUser={currentUser}
              users={users}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </main>
      </div>

      {showAuthModal && (
        <AuthModal
          users={users}
          currentUser={currentUser}
          onSelectUser={setCurrentUser}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
