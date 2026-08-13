import React, { useState } from 'react';
import { Announcement, AttendanceRecord, User } from '../types';
import { Sparkles, Wand2, FileText, AlertCircle } from 'lucide-react';
import { fetchAIDraftAnnouncement, fetchAIAttendanceAnalysis } from '../services/aiService';

interface AIAssistantModuleProps {
  currentUser: User;
  users: User[];
  attendance: AttendanceRecord[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({ currentUser, users, attendance, onAddAnnouncement }) => {
  const [topic, setTopic] = useState('Reunión de padres');
  const [audience, setAudience] = useState('Familias');
  const [tone, setTone] = useState('Formal y claro');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const handleGenerateDraft = async () => {
    setLoadingDraft(true);
    const result = await fetchAIDraftAnnouncement(topic, audience, tone);
    setDraftTitle(result.draftTitle || 'Comunicado escolar');
    setDraftContent(result.draftContent || '');
    setLoadingDraft(false);
  };

  const handleAnalyzeAttendance = async () => {
    setLoadingAnalysis(true);
    const student = users.find((u) => u.role === 'estudiante') || users[0];
    const lastRecords = attendance.slice(-8);
    const summary = await fetchAIAttendanceAnalysis(student?.name || currentUser.name, lastRecords);
    setAnalysis(summary);
    setLoadingAnalysis(false);
  };

  const handleUseDraft = () => {
    if (!draftTitle || !draftContent) return;
    onAddAnnouncement({
      title: draftTitle,
      content: draftContent,
      category: 'Aviso',
      targetRole: audience === 'Familias' ? 'Familias' : audience === 'Docentes' ? 'Docentes' : audience === 'Estudiantes' ? 'Estudiantes' : 'Todos',
      author: currentUser.name,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
          <Sparkles className="w-5 h-5" />
          Asistente IA para la Intranet Escolar
        </div>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Generación y análisis inteligente</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Wand2 className="w-4 h-4 text-purple-600" />
            Redactar comunicado
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Tema del comunicado" className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl">
              <option>Familias</option>
              <option>Docentes</option>
              <option>Estudiantes</option>
              <option>Todos</option>
            </select>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl">
              <option>Formal y claro</option>
              <option>Amigable</option>
              <option>Urgente</option>
            </select>
            <button onClick={handleGenerateDraft} disabled={loadingDraft} className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-60">
              {loadingDraft ? 'Generando...' : 'Generar borrador con IA'}
            </button>
          </div>

          {draftTitle && (
            <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 p-4">
              <p className="font-semibold text-slate-900">{draftTitle}</p>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{draftContent}</p>
              <button onClick={handleUseDraft} className="mt-3 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium">
                Publicar como comunicado
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Análisis de asistencia
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Revisa la tendencia de asistencia reciente para detectar incidencias o avisos tempranos.
          </p>
          <button onClick={handleAnalyzeAttendance} disabled={loadingAnalysis} className="mt-4 w-full px-4 py-2 bg-amber-500 text-white rounded-xl font-medium disabled:opacity-60">
            {loadingAnalysis ? 'Analizando...' : 'Analizar asistencia'}
          </button>

          {analysis && (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-slate-700 whitespace-pre-line">
              {analysis}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
