// js/data.js

const INITIAL_DATA = {
  users: [
    { id: "USR001", username: "admin", password: "123", name: "Carlos Fuentes", role: "admin", email: "c.fuentes@colegio.edu" },
    
    { id: "USR002", username: "roberto", password: "123", name: "Roberto Martínez", role: "teacher", email: "r.martinez@colegio.edu", subjects: ["SUBJ001", "SUBJ002"] },
    { id: "USR003", username: "carmen", password: "123", name: "Carmen López", role: "teacher", email: "c.lopez@colegio.edu", subjects: ["SUBJ003", "SUBJ004"] },
    
    { id: "USR004", username: "ana", password: "123", name: "Ana Gómez", role: "student", email: "ana.gomez@colegio.edu", grade: "10° Grado A" },
    { id: "USR005", username: "carlos", password: "123", name: "Carlos Ruiz", role: "student", email: "carlos.ruiz@colegio.edu", grade: "10° Grado A" },
    { id: "USR006", username: "sofia", password: "123", name: "Sofía Pérez", role: "student", email: "sofia.perez@colegio.edu", grade: "11° Grado B" }
  ],
  subjects: [
    { id: "SUBJ001", name: "Matemáticas", grade: "10° Grado A", teacherId: "USR002" },
    { id: "SUBJ002", name: "Física", grade: "10° Grado A", teacherId: "USR002" },
    { id: "SUBJ003", name: "Lengua y Literatura", grade: "10° Grado A", teacherId: "USR003" },
    { id: "SUBJ004", name: "Historia", grade: "11° Grado B", teacherId: "USR003" }
  ],
  grades: [
    // Ana Gómez (USR004) - 10° Grado A
    { studentId: "USR004", subjectId: "SUBJ001", scores: [85, 90, 88], finalScore: 88 },
    { studentId: "USR004", subjectId: "SUBJ002", scores: [78, 82, 80], finalScore: 80 },
    { studentId: "USR004", subjectId: "SUBJ003", scores: [92, 95, 94], finalScore: 94 },
    
    // Carlos Ruiz (USR005) - 10° Grado A
    { studentId: "USR005", subjectId: "SUBJ001", scores: [60, 75, 70], finalScore: 68 },
    { studentId: "USR005", subjectId: "SUBJ002", scores: [88, 85, 90], finalScore: 88 },
    { studentId: "USR005", subjectId: "SUBJ003", scores: [80, 82, 85], finalScore: 82 },
    
    // Sofía Pérez (USR006) - 11° Grado B
    { studentId: "USR006", subjectId: "SUBJ004", scores: [90, 92, 91], finalScore: 91 }
  ],
  attendance: [
    { date: "2026-08-10", studentId: "USR004", status: "present" },
    { date: "2026-08-10", studentId: "USR005", status: "present" },
    { date: "2026-08-10", studentId: "USR006", status: "absent" },
    { date: "2026-08-11", studentId: "USR004", status: "present" },
    { date: "2026-08-11", studentId: "USR005", status: "late" },
    { date: "2026-08-11", studentId: "USR006", status: "present" },
    { date: "2026-08-12", studentId: "USR004", status: "present" },
    { date: "2026-08-12", studentId: "USR005", status: "present" },
    { date: "2026-08-12", studentId: "USR006", status: "present" }
  ],
  announcements: [
    { id: "ANN001", title: "Feria de Ciencias 2026", content: "Se les invita a todos los estudiantes de 10° y 11° grado a registrar sus proyectos para la feria científica anual que se llevará a cabo el 25 de Agosto. Habrá premios para los tres mejores proyectos de innovación tecnológica.", date: "2026-08-12", author: "Dirección Escolar" },
    { id: "ANN002", title: "Mantenimiento de la Plataforma", content: "Este fin de semana, la plataforma de intranet escolar estará en mantenimiento desde el sábado a las 20:00 hasta el domingo a las 08:00 por actualizaciones del sistema de calificaciones.", date: "2026-08-11", author: "Soporte TI" }
  ],
  tasks: [
    { id: "TSK001", subjectId: "SUBJ001", title: "Taller de Ecuaciones Cuadráticas", description: "Resolver los ejercicios del 1 al 15 de la página 84 del libro de texto. Subir en formato PDF.", dueDate: "2026-08-18", status: "pending" },
    { id: "TSK002", subjectId: "SUBJ002", title: "Informe de Laboratorio: Péndulo Simple", description: "Escribir el reporte en base a los datos tomados en la sesión práctica del lunes. Incluir gráficas e incertidumbres.", dueDate: "2026-08-20", status: "pending" },
    { id: "TSK003", subjectId: "SUBJ003", title: "Análisis Literario: Don Quijote", description: "Escribir un ensayo crítico de 2 páginas analizando los capítulos I al V del Quijote de la Mancha.", dueDate: "2026-08-15", status: "pending" }
  ]
};

// Inicializar base de datos en localStorage
function initDatabase() {
  if (!localStorage.getItem("intranet_db")) {
    localStorage.setItem("intranet_db", JSON.stringify(INITIAL_DATA));
  }
}

// Obtener datos
function getDatabase() {
  initDatabase();
  return JSON.parse(localStorage.getItem("intranet_db"));
}

// Guardar datos
function saveDatabase(data) {
  localStorage.setItem("intranet_db", JSON.stringify(data));
}

// Exportar funciones globalmente para uso en otros scripts
window.schoolDb = {
  get: getDatabase,
  save: saveDatabase,
  init: initDatabase
};
