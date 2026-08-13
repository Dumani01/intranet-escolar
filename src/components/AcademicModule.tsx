import React, { useState } from 'react';
import { GradeRecord, AttendanceRecord, User, UserRole, AttendanceStatus } from '../types';
import { GraduationCap, Calendar, CheckCircle2, XCircle, Clock, Plus, Award, BookOpen, AlertCircle, Search, Filter } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';

interface AcademicModuleProps {
  currentUser: User;
  users: User[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  onAddGrade: (grade: Omit<GradeRecord, 'id' | 'date'>) => void;
  onAddAttendance: (att: Omit<AttendanceRecord, 'id'>) => void;
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({
  currentUser,
  users,
  grades,
  attendance,
  onAddGrade,
  onAddAttendance,
}) => {
  const [activeTab, setActiveTab] = useState<'calificaciones' | 'asistencia'>('calificaciones');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('todos');
  const [subjectFilter, setSubjectFilter] = useState('todos');
  const [termFilter, setTermFilter] = useState('todos');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('todos');
  const [recordSearchTerm, setRecordSearchTerm] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [newGradeStudentId, setNewGradeStudentId] = useState('');
  const [newSubject, setNewSubject] = useState('Matemáticas');
  const [newTerm, setNewTerm] = useState<GradeRecord['term']>('Trimestre 1');
  const [newScore, setNewScore] = useState<number>(8.0);
  const [newComments, setNewComments] = useState('');
  const [newAttStudentId, setNewAttStudentId] = useState('');
  const [newAttSubject, setNewAttSubject] = useState('Matemáticas');
  const [newAttStatus, setNewAttStatus] = useState<AttendanceStatus>('presente');
  const [newAttNotes, setNewAttNotes] = useState('');

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'docente';
  const studentsList = users.filter((u) => u.role === 'estudiante');
  const availableStudentGrades = Array.from(new Set(studentsList.map((s) => s.grade).filter((g): g is string => Boolean(g))));
  const availableSubjects = Array.from(new Set([...grades.map((g) => g.subject), ...attendance.map((a) => a.subject)]));

  const filteredStudentsList = studentsList.filter((s) => {
    if (studentGradeFilter !== 'todos' && s.grade !== studentGradeFilter) return false;
    if (studentSearchTerm && !s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())) return false;
    return true;
  });

  const targetStudentId = (() => {
    if (currentUser.role === 'estudiante') return currentUser.id;
    if (currentUser.role === 'familia') return currentUser.representedStudentId || 'u-5';
    return selectedStudentId || (filteredStudentsList[0]?.id || studentsList[0]?.id || '');
  })();

  const baseStudentGrades = grades.filter((g) => g.studentId === targetStudentId);
  const baseStudentAttendance = attendance.filter((a) => a.studentId === targetStudentId);

  const filteredGrades = baseStudentGrades.filter((g) => {
    if (subjectFilter !== 'todos' && g.subject !== subjectFilter) return false;
    if (termFilter !== 'todos' && g.term !== termFilter) return false;
    if (
      recordSearchTerm &&
      !g.subject.toLowerCase().includes(recordSearchTerm.toLowerCase()) &&
      !g.comments?.toLowerCase().includes(recordSearchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const filteredAttendance = baseStudentAttendance.filter((a) => {
    if (subjectFilter !== 'todos' && a.subject !== subjectFilter) return false;
    if (attendanceStatusFilter !== 'todos' && a.status !== attendanceStatusFilter) return false;
    if (
      recordSearchTerm &&
      !a.subject.toLowerCase().includes(recordSearchTerm.toLowerCase()) &&
      !a.notes?.toLowerCase().includes(recordSearchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const averageGrade = filteredGrades.length > 0
    ? (filteredGrades.reduce((acc, curr) => acc + curr.score, 0) / filteredGrades.length).toFixed(1)
    : 'N/A';

  const totalAttendanceDays = filteredAttendance.length;
  const presentDays = filteredAttendance.filter((a) => a.status === 'presente').length;
  const attendancePercentage = totalAttendanceDays > 0
    ? Math.round((presentDays / totalAttendanceDays) * 100)
    : 100;

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = users.find((u) => u.id === newGradeStudentId);
    if (!student) return;

    onAddGrade({
      studentId: student.id,
      studentName: student.name,
      subject: newSubject,
      term: newTerm,
      score: Number(newScore),
      comments: newComments,
    });

    setShowGradeModal(false);
    setNewComments('');
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = users.find((u) => u.id === newAttStudentId);
    if (!student) return;

    onAddAttendance({
      studentId: student.id,
      studentName: student.name,
      subject: newAttSubject,
      date: new Date().toISOString().split('T')[0],
      status: newAttStatus,
      notes: newAttNotes,
    });

    setShowAttendanceModal(false);
    setNewAttNotes('');
  };

  const getAttendanceBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'presente':
        return <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold"><CheckCircle2 className="w-3 h-3 mr-1" />Presente</span>;
      case 'ausente_justificada':
        return <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold"><CheckCircle2 className="w-3 h-3 mr-1" />Ausencia Justificada</span>;
      case 'ausente_injustificada':
        return <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold"><XCircle className="w-3 h-3 mr-1" />Inasistencia</span>;
      case 'tardanza':
        return <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold"><Clock className="w-3 h-3 mr-1" />Tardanza</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Módulo Académico
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Seguimiento de rendimiento escolar, boletines de calificaciones y control de asistencia.
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={studentGradeFilter}
                onChange={(e) => setStudentGradeFilter(e.target.value)}
                className="bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los cursos</option>
                {availableStudentGrades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar alumno..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-600 shrink-0 hidden md:inline">Alumno:</span>
              <select
                value={targetStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-white text-xs font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate"
              >
                {filteredStudentsList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide">
            <Award className="w-4 h-4 text-violet-600" />
            Media general
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{averageGrade}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Asignaturas
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{filteredGrades.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 text-emerald-600" />
            Asistencia
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{attendancePercentage}%</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('calificaciones')}
            className={`px-3 py-2 rounded-xl text-sm font-medium ${activeTab === 'calificaciones' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Calificaciones
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('asistencia')}
            className={`px-3 py-2 rounded-xl text-sm font-medium ${activeTab === 'asistencia' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Asistencia
          </button>
          {canEdit && (
            <>
              <button type="button" onClick={() => setShowGradeModal(true)} className="ml-auto px-3 py-2 rounded-xl text-sm font-medium bg-violet-600 text-white">
                <Plus className="w-4 h-4 inline mr-1" /> Añadir nota
              </button>
              <button type="button" onClick={() => setShowAttendanceModal(true)} className="px-3 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white">
                <Plus className="w-4 h-4 inline mr-1" /> Registrar asistencia
              </button>
            </>
          )}
        </div>

        {activeTab === 'calificaciones' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                <option value="todos">Todas las asignaturas</option>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                <option value="todos">Todos los trimestres</option>
                <option value="Trimestre 1">Trimestre 1</option>
                <option value="Trimestre 2">Trimestre 2</option>
                <option value="Trimestre 3">Trimestre 3</option>
              </select>
              <input
                type="text"
                value={recordSearchTerm}
                onChange={(e) => setRecordSearchTerm(e.target.value)}
                placeholder="Buscar por asignatura u observación..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div className="space-y-3">
              {filteredGrades.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">No hay calificaciones con estos filtros.</div>
              ) : (
                filteredGrades.map((grade) => (
                  <div key={grade.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{grade.subject}</p>
                        <p className="text-xs text-slate-500">{grade.term} • {grade.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{grade.score.toFixed(1)}</p>
                        <p className="text-xs text-slate-500">/10</p>
                      </div>
                    </div>
                    {grade.comments && <p className="mt-2 text-sm text-slate-600">{grade.comments}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'asistencia' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                <option value="todos">Todas las asignaturas</option>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select value={attendanceStatusFilter} onChange={(e) => setAttendanceStatusFilter(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                <option value="todos">Todos los estados</option>
                <option value="presente">Presente</option>
                <option value="ausente_justificada">Ausencia Justificada</option>
                <option value="ausente_injustificada">Ausencia Injustificada</option>
                <option value="tardanza">Tardanza</option>
              </select>
              <input
                type="text"
                value={recordSearchTerm}
                onChange={(e) => setRecordSearchTerm(e.target.value)}
                placeholder="Buscar por asignatura u observación..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div className="space-y-3">
              {filteredAttendance.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">No hay registros de asistencia con estos filtros.</div>
              ) : (
                filteredAttendance.map((att) => (
                  <div key={att.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-between items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{att.subject}</p>
                      <p className="text-xs text-slate-500">{att.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getAttendanceBadge(att.status)}
                      {att.notes && <span className="text-xs text-slate-500">{att.notes}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <AttendanceChart attendance={attendance} students={users} selectedStudentId={targetStudentId} />

      {showGradeModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registrar calificación</h3>
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <select value={newGradeStudentId} onChange={(e) => setNewGradeStudentId(e.target.value)} required className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                <option value="">Selecciona un estudiante</option>
                {studentsList.map((student) => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                  <option>Matemáticas</option>
                  <option>Lengua y Literatura</option>
                  <option>Ciencias Naturales</option>
                  <option>Historia</option>
                  <option>Inglés</option>
                </select>
                <select value={newTerm} onChange={(e) => setNewTerm(e.target.value as GradeRecord['term'])} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                  <option value="Trimestre 1">Trimestre 1</option>
                  <option value="Trimestre 2">Trimestre 2</option>
                  <option value="Trimestre 3">Trimestre 3</option>
                </select>
              </div>
              <input type="number" min={0} max={10} step={0.1} value={newScore} onChange={(e) => setNewScore(Number(e.target.value))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white" />
              <textarea value={newComments} onChange={(e) => setNewComments(e.target.value)} placeholder="Comentario del profesor..." rows={3} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowGradeModal(false)} className="px-4 py-2 text-xs font-medium text-slate-600 rounded-xl hover:bg-slate-100">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAttendanceModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registrar asistencia</h3>
            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <select value={newAttStudentId} onChange={(e) => setNewAttStudentId(e.target.value)} required className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                <option value="">Selecciona un estudiante</option>
                {studentsList.map((student) => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={newAttSubject} onChange={(e) => setNewAttSubject(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                  <option>Matemáticas</option>
                  <option>Lengua y Literatura</option>
                  <option>Ciencias Naturales</option>
                  <option>Historia</option>
                  <option>Inglés</option>
                </select>
                <select value={newAttStatus} onChange={(e) => setNewAttStatus(e.target.value as AttendanceStatus)} className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                  <option value="presente">Presente</option>
                  <option value="tardanza">Tardanza</option>
                  <option value="ausente_justificada">Ausencia Justificada</option>
                  <option value="ausente_injustificada">Ausencia Injustificada</option>
                </select>
              </div>
              <textarea value={newAttNotes} onChange={(e) => setNewAttNotes(e.target.value)} rows={3} placeholder="Notas o observaciones..." className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAttendanceModal(false)} className="px-4 py-2 text-xs font-medium text-slate-600 rounded-xl hover:bg-slate-100">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
