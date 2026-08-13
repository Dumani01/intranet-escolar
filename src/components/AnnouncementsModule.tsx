import React, { useState } from 'react';
import { Announcement, UserRole } from '../types';
import { fetchAISummary } from '../services/aiService';
import { Megaphone, Plus, Search, Sparkles, Calendar, Bell, Bot } from 'lucide-react';

interface AnnouncementsModuleProps {
  announcements: Announcement[];
  userRole: UserRole;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

export const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({
  announcements,
  userRole,
  onAddAnnouncement,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('Aviso');
  const [newTargetRole, setNewTargetRole] = useState<Announcement['targetRole']>('Todos');
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [activeSummaries, setActiveSummaries] = useState<Record<string, string>>({});

  const canCreate = userRole === 'admin' || userRole === 'docente';

  const visibleAnnouncements = announcements.filter((ann) => {
    if (ann.targetRole !== 'Todos') {
      if (userRole === 'docente' && ann.targetRole !== 'Docentes') return false;
      if (userRole === 'estudiante' && ann.targetRole !== 'Estudiantes') return false;
      if (userRole === 'familia' && ann.targetRole !== 'Familias') return false;
    }

    if (selectedCategory !== 'Todos' && ann.category !== selectedCategory) return false;

    if (
      searchTerm &&
      !ann.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !ann.content.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const summaryCards = [
    { label: 'Total', value: announcements.length, tone: 'blue' },
    { label: 'Urgentes', value: announcements.filter((a) => a.category === 'Urgente').length, tone: 'red' },
    { label: 'Para docentes', value: announcements.filter((a) => a.targetRole === 'Docentes' || a.targetRole === 'Todos').length, tone: 'violet' },
    { label: 'Para familias', value: announcements.filter((a) => a.targetRole === 'Familias' || a.targetRole === 'Todos').length, tone: 'emerald' },
  ];

  const handleGenerateSummary = async (ann: Announcement) => {
    setSummarizingId(ann.id);
    const summary = await fetchAISummary(ann.title, ann.content);
    setActiveSummaries((prev) => ({ ...prev, [ann.id]: summary }));
    setSummarizingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddAnnouncement({
      title: newTitle,
      content: newContent,
      category: newCategory,
      targetRole: newTargetRole,
      author: userRole === 'admin' ? 'Administración' : 'Docente',
    });

    setNewTitle('');
    setNewContent('');
    setShowNewModal(false);
  };

  const getCategoryBadge = (category: Announcement['category']) => {
    switch (category) {
      case 'Urgente':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Evento':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-600" />
            Tablón de Comunicados Institucionales
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Circulares oficiales, eventos y avisos importantes del centro escolar.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 mr-2" />
            Publicar Comunicado
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-2xl border p-4 ${card.tone === 'blue' ? 'bg-blue-50 border-blue-100' : card.tone === 'red' ? 'bg-red-50 border-red-100' : card.tone === 'violet' ? 'bg-violet-50 border-violet-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${card.tone === 'blue' ? 'text-blue-700' : card.tone === 'red' ? 'text-red-700' : card.tone === 'violet' ? 'text-violet-700' : 'text-emerald-700'}`}>
              {card.label}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['Todos', 'Aviso', 'Urgente', 'Evento'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en comunicados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {visibleAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No hay comunicados disponibles</h3>
            <p className="text-xs text-slate-500 mt-1">
              No se encontraron avisos que coincidan con la categoría o filtro de búsqueda seleccionado.
            </p>
          </div>
        ) : (
          visibleAnnouncements.map((ann) => {
            const hasSummary = activeSummaries[ann.id] || ann.aiSummary;
            const isSummarizing = summarizingId === ann.id;

            return (
              <article
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2.5 py-1 rounded-md border font-semibold ${getCategoryBadge(ann.category)}`}>
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Dirigido a: {ann.targetRole}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {ann.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{ann.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                  {ann.content}
                </p>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Publicado por: <strong className="text-slate-700">{ann.author}</strong>
                  </span>

                  <button
                    onClick={() => handleGenerateSummary(ann)}
                    disabled={isSummarizing}
                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 hover:text-purple-900 border border-purple-200 rounded-lg transition-all hover:shadow-xs disabled:opacity-50"
                  >
                    <Bot className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                    {isSummarizing ? 'Generando resumen...' : hasSummary ? 'Actualizar Resumen IA' : 'Resumir con IA (Gemini)'}
                  </button>
                </div>

                {hasSummary && (
                  <div className="mt-4 p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 space-y-1.5">
                    <div className="flex items-center font-bold text-purple-900">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                      Resumen Ejecutivo (Generado por IA)
                    </div>
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                      {activeSummaries[ann.id] || ann.aiSummary}
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Publicar Nuevo Comunicado</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Aviso</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Suspensión de actividades extraescolares"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Announcement['category'])}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Aviso">Aviso</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Evento">Evento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dirigido A</label>
                  <select
                    value={newTargetRole}
                    onChange={(e) => setNewTargetRole(e.target.value as Announcement['targetRole'])}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Docentes">Docentes</option>
                    <option value="Estudiantes">Estudiantes</option>
                    <option value="Familias">Familias</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contenido del Comunicado</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Escriba aquí el cuerpo detallado del comunicado..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
