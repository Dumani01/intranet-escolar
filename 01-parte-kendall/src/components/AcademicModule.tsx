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

  // Student list filter states
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('todos');

  // Academic record filter states
  const [subjectFilter, setSubjectFilter] = useState('todos');
  const [termFilter, setTermFilter] = useState('todos');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('todos');
  const [recordSearchTerm, setRecordSearchTerm] = useState('');

  // Modals state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // New Grade form
  const [newGradeStudentId, setNewGradeStudentId] = useState('');
  const [newSubject, setNewSubject] = useState('Matemáticas');
  const [newTerm, setNewTerm] = useState<GradeRecord['term']>('Trimestre 1');
  const [newScore, setNewScore] = useState<number>(8.0);
  const [newComments, setNewComments] = useState('');

  // New Attendance form
  const [newAttStudentId, setNewAttStudentId] = useState('');
  const [newAttSubject, setNewAttSubject] = useState('Matemáticas');
  const [newAttStatus, setNewAttStatus] = useState<AttendanceStatus>('presente');
  const [newAttNotes, setNewAttNotes] = useState('');

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'docente';
  const studentsList = users.filter((u) => u.role === 'estudiante');

  // Available unique courses/grades for students
  const availableStudentGrades = Array.from(
    new Set(studentsList.map((s) => s.grade).filter((g): g is string => Boolean(g)))
  );

  // Available unique subjects across grades and attendance
  const availableSubjects = Array.from(
    new Set([
      ...grades.map((g) => g.subject),
      ...attendance.map((a) => a.subject),
    ])
  );

  // Filter student selection list
  const filteredStudentsList = studentsList.filter((s) => {
    if (studentGradeFilter !== 'todos' && s.grade !== studentGradeFilter) return false;
    if (studentSearchTerm && !s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())) return false;
    return true;
  });

  // Determine target student ID based on logged in role
  const targetStudentId = (() => {
    if (currentUser.role === 'estudiante') return currentUser.id;
    if (currentUser.role === 'familia') return currentUser.representedStudentId || 'u-5';
    return selectedStudentId || (filteredStudentsList[0]?.id || studentsList[0]?.id || '');
  })();

  // Filtered dataset for student
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

  // Stats calculation
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
      {/* Header */}
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

        {/* Student Selector for Admin / Teacher with advanced search & course filter */}
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
                {filteredStudentsList.length === 0 ? (
                  <option value="">Sin coincidencia</option>
                ) : (
                  filteredStudentsList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.grade || 'Sin curso'})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Promedio General</div>
            <div className="text-2xl font-bold text-slate-900">{averageGrade} / 10</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Índice de Asistencia</div>
            <div className="text-2xl font-bold text-slate-900">{attendancePercentage}%</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Materias Registradas</div>
            <div className="text-2xl font-bold text-slate-900">{filteredGrades.length} Asignaturas</div>
          </div>
        </div>
      </div>

      {/* Sub-tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('calificaciones')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'calificaciones'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Boletín de Calificaciones
          </button>
          <button
            onClick={() => setActiveTab('asistencia')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'asistencia'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Registro de Asistencia
          </button>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {activeTab === 'calificaciones' ? (
              <button
                onClick={() => {
                  setNewGradeStudentId(targetStudentId);
                  setShowGradeModal(true);
                }}
                className="inline-flex items-center px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Registrar Calificación
              </button>
            ) : (
              <button
                onClick={() => {
                  setNewAttStudentId(targetStudentId);
                  setShowAttendanceModal(true);
                }}
                className="inline-flex items-center px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Registrar Asistencia
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recharts Attendance Trend Chart */}
      {activeTab === 'asistencia' && (
        <AttendanceChart
          attendance={attendance}
          students={studentsList}
          selectedStudentId={targetStudentId}
        />
      )}

      {/* Table Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Record Search input */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por asignatura u observación..."
              value={recordSearchTerm}
              onChange={(e) => setRecordSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-500">Materia:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Tab specific filter */}
          {activeTab === 'calificaciones' ? (
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-500">Período:</span>
              <select
                value={termFilter}
                onChange={(e) => setTermFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los trimestres</option>
                <option value="Trimestre 1">Trimestre 1</option>
                <option value="Trimestre 2">Trimestre 2</option>
                <option value="Trimestre 3">Trimestre 3</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-500">Estado:</span>
              <select
                value={attendanceStatusFilter}
                onChange={(e) => setAttendanceStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="presente">Presente</option>
                <option value="ausente_justificada">Ausencia Justificada</option>
                <option value="ausente_injustificada">Inasistencia</option>
                <option value="tardanza">Tardanza</option>
              </select>
            </div>
          )}

          {(subjectFilter !== 'todos' || termFilter !== 'todos' || attendanceStatusFilter !== 'todos' || recordSearchTerm !== '') && (
            <button
              onClick={() => {
                setSubjectFilter('todos');
                setTermFilter('todos');
                setAttendanceStatusFilter('todos');
                setRecordSearchTerm('');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold underline text-2xs"
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        <div className="text-2xs text-slate-400 font-medium">
          Mostrando {activeTab === 'calificaciones' ? filteredGrades.length : filteredAttendance.length} registros
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'calificaciones' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Asignatura</th>
                  <th className="py-3.5 px-4">Período</th>
                  <th className="py-3.5 px-4">Calificación</th>
                  <th className="py-3.5 px-4">Comentarios Pedagógicos</th>
                  <th className="py-3.5 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Sin calificaciones registradas para este alumno.
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{g.subject}</td>
                      <td className="py-3.5 px-4 text-slate-600">{g.term}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-md font-bold ${
                          g.score >= 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">{g.comments || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{g.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Asignatura</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">
                      Sin registros de asistencia para este alumno.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-800">{a.date}</td>
                      <td className="py-3.5 px-4 text-slate-600">{a.subject}</td>
                      <td className="py-3.5 px-4">{getAttendanceBadge(a.status)}</td>
                      <td className="py-3.5 px-4 text-slate-500">{a.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Registrar Nueva Calificación</h3>

            <form onSubmit={handleGradeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estudiante</label>
                <select
                  value={newGradeStudentId}
                  onChange={(e) => setNewGradeStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {studentsList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asignatura</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Matemáticas">Matemáticas</option>
                  <option value="Lengua y Literatura">Lengua y Literatura</option>
                  <option value="Ciencias Naturales">Ciencias Naturales</option>
                  <option value="Historia">Historia</option>
                  <option value="Inglés">Inglés</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Período</label>
                  <select
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Trimestre 1">Trimestre 1</option>
                    <option value="Trimestre 2">Trimestre 2</option>
                    <option value="Trimestre 3">Trimestre 3</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nota (0 a 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newScore}
                    onChange={(e) => setNewScore(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Comentarios</label>
                <textarea
                  rows={2}
                  value={newComments}
                  onChange={(e) => setNewComments(e.target.value)}
                  placeholder="Observación técnica o recomendación pedagógica..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs"
                >
                  Guardar Calificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Registrar Asistencia</h3>

            <form onSubmit={handleAttendanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estudiante</label>
                <select
                  value={newAttStudentId}
                  onChange={(e) => setNewAttStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {studentsList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estado</label>
                <select
                  value={newAttStatus}
                  onChange={(e) => setNewAttStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="presente">Presente</option>
                  <option value="ausente_justificada">Ausencia Justificada</option>
                  <option value="ausente_injustificada">Inasistencia Injustificada</option>
                  <option value="tardanza">Tardanza</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notas / Justificación</label>
                <input
                  type="text"
                  value={newAttNotes}
                  onChange={(e) => setNewAttNotes(e.target.value)}
                  placeholder="Detalle de justificación si corresponde..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs"
                >
                  Guardar Asistencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
