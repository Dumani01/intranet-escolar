// js/app.js

// Variables de estado de la sesión actual
let currentUser = null;

// Ejecución al iniciar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar base de datos de localStorage
  window.schoolDb.init();
  
  // Verificar si hay sesión activa
  const savedUser = sessionStorage.getItem("current_user");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showDashboard(currentUser.role);
  } else {
    showView("login-view");
  }
  
  // Renderizar iconos
  lucide.createIcons();
});

// ================= SISTEMA DE TOASTS =================
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconName = "check-circle";
  if (type === "error") iconName = "alert-triangle";
  if (type === "info") iconName = "info";
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  // Animación de salida y remoción
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s reverse forwards";
    toast.addEventListener("animationend", () => toast.remove());
  }, 4000);
}

// ================= AUTENTICACIÓN =================

function handleLogin() {
  const usernameInput = document.getElementById("login-username").value.trim().toLowerCase();
  const passwordInput = document.getElementById("login-password").value;
  
  const db = window.schoolDb.get();
  const user = db.users.find(u => u.username.toLowerCase() === usernameInput && u.password === passwordInput);
  
  if (user) {
    currentUser = user;
    sessionStorage.setItem("current_user", JSON.stringify(user));
    showToast(`¡Bienvenido de nuevo, ${user.name}!`);
    showDashboard(user.role);
  } else {
    showToast("Usuario o contraseña incorrectos", "error");
  }
}

function quickLogin(username) {
  const db = window.schoolDb.get();
  const user = db.users.find(u => u.username === username);
  if (user) {
    document.getElementById("login-username").value = user.username;
    document.getElementById("login-password").value = user.password;
    handleLogin();
  }
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem("current_user");
  showToast("Sesión cerrada correctamente", "info");
  
  // Limpiar campos de login
  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
  
  showView("login-view");
}

// ================= CONTROLADOR DE VISTAS =================

function showView(viewId) {
  // Ocultar todas las vistas
  document.querySelectorAll(".view-section").forEach(view => {
    view.classList.remove("active");
  });
  
  // Mostrar la vista deseada
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.add("active");
  }
}

function showDashboard(role) {
  showView(`${role}-view`);
  
  // Cargar datos del dashboard según rol
  if (role === "admin") {
    initAdminDashboard();
  } else if (role === "teacher") {
    initTeacherDashboard();
  } else if (role === "student") {
    initStudentDashboard();
  }
  
  // Actualizar datos de usuario en sidebars
  updateSidebarUserInfo(role);
}

function updateSidebarUserInfo(role) {
  const avatarEl = document.getElementById(`${role}-avatar`);
  const nameEl = document.getElementById(`${role}-name`);
  
  if (avatarEl && currentUser) {
    // Generar iniciales del nombre
    const initials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    avatarEl.innerText = initials;
  }
  
  if (nameEl && currentUser) {
    nameEl.innerText = currentUser.name;
  }

  // Grado específico si es estudiante
  if (role === "student") {
    const gradeEl = document.getElementById("student-grade");
    if (gradeEl) gradeEl.innerText = currentUser.grade;
  }
}

// Cambiar de pestaña (tabs) dentro de un dashboard
function switchDashboardTab(role, tabName) {
  const viewEl = document.getElementById(`${role}-view`);
  
  // Quitar active de los menús
  viewEl.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
  });
  
  // Ocultar contenidos de pestañas
  viewEl.querySelectorAll(".dashboard-tab-content").forEach(content => {
    content.style.display = "none";
  });
  
  // Activar menú seleccionado
  const clickedMenuItem = Array.from(viewEl.querySelectorAll(".menu-item")).find(item => 
    item.getAttribute("onclick").includes(`'${tabName}'`)
  );
  if (clickedMenuItem) clickedMenuItem.classList.add("active");
  
  // Mostrar contenido seleccionado
  const activeTabContent = document.getElementById(`${role}-tab-${tabName}`);
  if (activeTabContent) {
    activeTabContent.style.display = "block";
  }
  
  // Actualizar datos cuando se cambia de pestaña
  if (role === "admin" && tabName === "users") {
    loadAdminUsersList();
  }
}

// ================= PORTAL DEL ESTUDIANTE =================

function initStudentDashboard() {
  switchDashboardTab("student", "grades");
  loadStudentGrades();
  loadStudentAnnouncements();
  loadStudentTasks();
}

function loadStudentGrades() {
  const db = schoolDb.get();
  
  // Filtrar calificaciones del estudiante actual
  const studentGrades = db.grades.filter(g => g.studentId === currentUser.id);
  const tbody = document.getElementById("student-grades-table-body");
  tbody.innerHTML = "";
  
  let totalScoreSum = 0;
  let subjectCount = 0;
  
  studentGrades.forEach(g => {
    const subject = db.subjects.find(s => s.id === g.subjectId);
    if (!subject) return;
    
    subjectCount++;
    totalScoreSum += g.finalScore;
    
    const score1 = g.scores[0] !== undefined ? g.scores[0] : "-";
    const score2 = g.scores[1] !== undefined ? g.scores[1] : "-";
    const score3 = g.scores[2] !== undefined ? g.scores[2] : "-";
    
    const finalScore = g.finalScore !== null ? g.finalScore : "-";
    const isApproved = g.finalScore >= 70;
    const badgeClass = isApproved ? "badge-success" : "badge-danger";
    const badgeText = isApproved ? "Aprobado" : "Reprobado";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 500;">${subject.name}</td>
      <td>${score1}</td>
      <td>${score2}</td>
      <td>${score3}</td>
      <td style="font-weight: 700; color: ${isApproved ? 'var(--color-success)' : 'var(--color-danger)'}">${finalScore}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
    `;
    tbody.appendChild(tr);
  });
  
  if (subjectCount === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No tienes materias registradas.</td></tr>`;
  }
  
  // Actualizar métricas del estudiante
  const studentGpa = subjectCount > 0 ? (totalScoreSum / subjectCount).toFixed(1) : "0.0";
  document.getElementById("student-gpa").innerText = studentGpa;
  
  // Calcular porcentaje de asistencia
  const studentAttendance = db.attendance.filter(a => a.studentId === currentUser.id);
  const totalDays = studentAttendance.length;
  if (totalDays > 0) {
    const presentDays = studentAttendance.filter(a => a.status === "present" || a.status === "late").length;
    const percentage = Math.round((presentDays / totalDays) * 100);
    document.getElementById("student-attendance-percentage").innerText = `${percentage}%`;
  } else {
    document.getElementById("student-attendance-percentage").innerText = "100%";
  }
}

function loadStudentTasks() {
  const db = schoolDb.get();
  const list = document.getElementById("student-tasks-list");
  list.innerHTML = "";
  
  // Obtener materias del grado del estudiante
  const studentSubjects = db.subjects.filter(s => s.grade === currentUser.grade);
  const studentSubjectIds = studentSubjects.map(s => s.id);
  
  // Filtrar tareas asociadas a esas materias
  const studentTasks = db.tasks.filter(t => studentSubjectIds.includes(t.subjectId));
  
  studentTasks.forEach(t => {
    const subject = studentSubjects.find(s => s.id === t.subjectId);
    
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerHTML = `
      <div class="task-info">
        <span class="task-title">${t.title}</span>
        <span class="task-desc">${t.description}</span>
        <span class="badge badge-primary" style="margin-top: 6px; width: fit-content;">${subject ? subject.name : "Asignatura"}</span>
      </div>
      <div>
        <span class="task-date"><i data-lucide="clock" style="width: 14px; height: 14px;"></i> Vence: ${t.dueDate}</span>
      </div>
    `;
    list.appendChild(div);
  });
  
  if (studentTasks.length === 0) {
    list.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">No tienes tareas pendientes.</p>`;
  } else {
    lucide.createIcons();
  }
}

function loadStudentAnnouncements() {
  const db = schoolDb.get();
  const list = document.getElementById("student-announcements-list");
  list.innerHTML = "";
  
  db.announcements.forEach(a => {
    const div = document.createElement("div");
    div.className = "announcement-item";
    div.innerHTML = `
      <div class="announcement-meta">
        <span>Por: ${a.author}</span>
        <span>${a.date}</span>
      </div>
      <h4 class="announcement-title">${a.title}</h4>
      <p class="announcement-body">${a.content}</p>
    `;
    list.appendChild(div);
  });
  
  if (db.announcements.length === 0) {
    list.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">No hay anuncios escolares.</p>`;
  }
}

// ================= PORTAL DEL DOCENTE =================

let teacherSubjects = [];

function initTeacherDashboard() {
  switchDashboardTab("teacher", "grades");
  
  const db = schoolDb.get();
  
  // Buscar materias asociadas al profesor
  teacherSubjects = db.subjects.filter(s => s.teacherId === currentUser.id);
  
  // Llenar selectores de materias
  const gradeSelect = document.getElementById("teacher-subject-select");
  const attendanceSelect = document.getElementById("teacher-attendance-subject-select");
  
  gradeSelect.innerHTML = "";
  attendanceSelect.innerHTML = "";
  
  teacherSubjects.forEach(s => {
    const opt = `<option value="${s.id}">${s.name} (${s.grade})</option>`;
    gradeSelect.innerHTML += opt;
    attendanceSelect.innerHTML += opt;
  });
  
  // Cargar fecha actual por defecto en pase de asistencia
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("attendance-date").value = today;
  
  if (teacherSubjects.length > 0) {
    loadTeacherStudentsForGrades();
    loadTeacherStudentsForAttendance();
  } else {
    document.getElementById("teacher-grades-table-body").innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No tienes materias asignadas.</td></tr>`;
    document.getElementById("teacher-attendance-table-body").innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No tienes materias asignadas.</td></tr>`;
  }
}

function loadTeacherStudentsForGrades() {
  const db = schoolDb.get();
  const subjectId = document.getElementById("teacher-subject-select").value;
  const subject = db.subjects.find(s => s.id === subjectId);
  
  if (!subject) return;
  
  // Actualizar badge de información de la materia
  document.getElementById("subject-info-badge").innerText = `${subject.name} - ${subject.grade}`;
  
  // Filtrar estudiantes inscritos en este grado
  const studentsInGrade = db.users.filter(u => u.role === "student" && u.grade === subject.grade);
  const tbody = document.getElementById("teacher-grades-table-body");
  tbody.innerHTML = "";
  
  studentsInGrade.forEach(student => {
    // Buscar o crear registro de notas de este estudiante en esta materia
    let studentGradeRecord = db.grades.find(g => g.studentId === student.id && g.subjectId === subject.id);
    
    if (!studentGradeRecord) {
      studentGradeRecord = { studentId: student.id, subjectId: subject.id, scores: [0, 0, 0], finalScore: 0 };
      db.grades.push(studentGradeRecord);
      schoolDb.save(db);
    }
    
    const sc = studentGradeRecord.scores;
    const finalScore = studentGradeRecord.finalScore;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 500;">${student.name}</td>
      <td><input type="number" min="0" max="100" class="score-input" value="${sc[0] || 0}" id="score-${student.id}-0"></td>
      <td><input type="number" min="0" max="100" class="score-input" value="${sc[1] || 0}" id="score-${student.id}-1"></td>
      <td><input type="number" min="0" max="100" class="score-input" value="${sc[2] || 0}" id="score-${student.id}-2"></td>
      <td style="font-weight: 700; font-size: 1.1rem;" id="final-${student.id}">${finalScore}</td>
      <td>
        <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 6px;" onclick="saveStudentScore('${student.id}', '${subject.id}')">
          <i data-lucide="check" style="width: 14px; height: 14px;"></i> Guardar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  if (studentsInGrade.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No hay estudiantes registrados en este grado.</td></tr>`;
  } else {
    lucide.createIcons();
  }
}

function saveStudentScore(studentId, subjectId) {
  const db = schoolDb.get();
  
  // Obtener inputs numéricos
  const s0 = parseInt(document.getElementById(`score-${studentId}-0`).value) || 0;
  const s1 = parseInt(document.getElementById(`score-${studentId}-1`).value) || 0;
  const s2 = parseInt(document.getElementById(`score-${studentId}-2`).value) || 0;
  
  // Validar límites
  if (s0 < 0 || s0 > 100 || s1 < 0 || s1 > 100 || s2 < 0 || s2 > 100) {
    showToast("Las calificaciones deben estar entre 0 y 100", "error");
    return;
  }
  
  // Calcular nota final ponderada: 30%, 30%, 40%
  const finalScore = Math.round((s0 * 0.3) + (s1 * 0.3) + (s2 * 0.4));
  
  // Guardar en la BD
  const recordIndex = db.grades.findIndex(g => g.studentId === studentId && g.subjectId === subjectId);
  if (recordIndex !== -1) {
    db.grades[recordIndex].scores = [s0, s1, s2];
    db.grades[recordIndex].finalScore = finalScore;
  } else {
    db.grades.push({ studentId, subjectId, scores: [s0, s1, s2], finalScore });
  }
  
  schoolDb.save(db);
  
  // Actualizar UI en vivo
  document.getElementById(`final-${studentId}`).innerText = finalScore;
  
  showToast("Calificación actualizada con éxito");
}

function loadTeacherStudentsForAttendance() {
  const db = schoolDb.get();
  const subjectId = document.getElementById("teacher-attendance-subject-select").value;
  const dateVal = document.getElementById("attendance-date").value;
  const subject = db.subjects.find(s => s.id === subjectId);
  
  if (!subject || !dateVal) return;
  
  const studentsInGrade = db.users.filter(u => u.role === "student" && u.grade === subject.grade);
  const tbody = document.getElementById("teacher-attendance-table-body");
  tbody.innerHTML = "";
  
  studentsInGrade.forEach(student => {
    // Buscar si ya se registró asistencia para este estudiante en este día
    const attRecord = db.attendance.find(a => a.studentId === student.id && a.date === dateVal);
    const status = attRecord ? attRecord.status : "present"; // Presente por defecto
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 500;">${student.name}</td>
      <td style="display: flex; gap: 20px;">
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
          <input type="radio" name="att-${student.id}" value="present" ${status === 'present' ? 'checked' : ''}> Presente
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
          <input type="radio" name="att-${student.id}" value="late" ${status === 'late' ? 'checked' : ''}> Tarde
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
          <input type="radio" name="att-${student.id}" value="absent" ${status === 'absent' ? 'checked' : ''}> Ausente
        </label>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  if (studentsInGrade.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No hay estudiantes en este grado.</td></tr>`;
  }
}

function saveDailyAttendance() {
  const db = schoolDb.get();
  const subjectId = document.getElementById("teacher-attendance-subject-select").value;
  const dateVal = document.getElementById("attendance-date").value;
  const subject = db.subjects.find(s => s.id === subjectId);
  
  if (!subject || !dateVal) return;
  
  const studentsInGrade = db.users.filter(u => u.role === "student" && u.grade === subject.grade);
  
  studentsInGrade.forEach(student => {
    const radioName = `att-${student.id}`;
    const selectedRadio = document.querySelector(`input[name="${radioName}"]:checked`);
    if (!selectedRadio) return;
    
    const statusVal = selectedRadio.value;
    
    // Buscar registro existente para actualizarlo, o crear uno nuevo
    const recordIndex = db.attendance.findIndex(a => a.studentId === student.id && a.date === dateVal);
    if (recordIndex !== -1) {
      db.attendance[recordIndex].status = statusVal;
    } else {
      db.attendance.push({ date: dateVal, studentId: student.id, status: statusVal });
    }
  });
  
  schoolDb.save(db);
  showToast("Asistencia guardada con éxito");
}

// ================= PORTAL DEL ADMINISTRADOR =================

function initAdminDashboard() {
  switchDashboardTab("admin", "stats");
  loadAdminStats();
}

function loadAdminStats() {
  const db = schoolDb.get();
  
  // Cantidades
  const studentsCount = db.users.filter(u => u.role === "student").length;
  const teachersCount = db.users.filter(u => u.role === "teacher").length;
  
  document.getElementById("stat-students").innerText = studentsCount;
  document.getElementById("stat-teachers").innerText = teachersCount;
  
  // Calcular asistencia promedio de toda la escuela
  const totalAttendance = db.attendance.length;
  if (totalAttendance > 0) {
    const presentCount = db.attendance.filter(a => a.status === "present" || a.status === "late").length;
    const avgAttendance = Math.round((presentCount / totalAttendance) * 100);
    document.getElementById("stat-attendance").innerText = `${avgAttendance}%`;
  } else {
    document.getElementById("stat-attendance").innerText = "100%";
  }
  
  // Cargar anuncios en admin
  const annList = document.getElementById("admin-announcements-list");
  annList.innerHTML = "";
  db.announcements.forEach(a => {
    const div = document.createElement("div");
    div.className = "announcement-item";
    div.innerHTML = `
      <div class="announcement-meta">
        <span>Por: ${a.author}</span>
        <span>${a.date}</span>
      </div>
      <h4 class="announcement-title">${a.title}</h4>
      <p class="announcement-body">${a.content}</p>
    `;
    annList.appendChild(div);
  });
  
  if (db.announcements.length === 0) {
    annList.innerHTML = `<p style="color: var(--text-muted); text-align: center;">No hay anuncios.</p>`;
  }

  // Cargar materias
  const subjectsTbody = document.getElementById("admin-subjects-table-body");
  subjectsTbody.innerHTML = "";
  db.subjects.forEach(s => {
    const teacher = db.users.find(u => u.id === s.teacherId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 500;">${s.name}</td>
      <td><span class="badge badge-primary">${s.grade}</span></td>
    `;
    subjectsTbody.appendChild(tr);
  });
}

function loadAdminUsersList() {
  const db = schoolDb.get();
  const tbody = document.getElementById("admin-users-table-body");
  tbody.innerHTML = "";
  
  db.users.forEach(u => {
    // Definir detalle específico por rol
    let detail = "";
    if (u.role === "student") {
      detail = u.grade;
    } else if (u.role === "teacher") {
      // Buscar materias asignadas
      const tSubjects = db.subjects.filter(s => s.teacherId === u.id).map(s => s.name).join(", ");
      detail = tSubjects || "Ninguna materia asignada";
    } else {
      detail = "Control Total";
    }
    
    let badgeClass = "badge-primary";
    if (u.role === "admin") badgeClass = "badge-danger";
    if (u.role === "teacher") badgeClass = "badge-warning";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 500;">${u.name}</td>
      <td>${u.username}</td>
      <td><span class="badge ${badgeClass}">${u.role}</span></td>
      <td style="font-size: 0.85rem; max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${detail}</td>
      <td>${u.email}</td>
      <td style="display: flex; gap: 8px;">
        <button class="btn btn-secondary" style="padding: 6px 10px; border-radius: 6px;" onclick="openEditUserModal('${u.id}')">
          <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
        </button>
        <button class="btn btn-secondary" style="padding: 6px 10px; border-radius: 6px; border-color: var(--color-danger); color: var(--color-danger);" onclick="deleteUser('${u.id}')">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  lucide.createIcons();
}

function handleCreateAnnouncement() {
  const title = document.getElementById("ann-title").value.trim();
  const content = document.getElementById("ann-content").value.trim();
  
  if (!title || !content) return;
  
  const db = schoolDb.get();
  
  const newAnn = {
    id: `ANN00${db.announcements.length + 1}`,
    title,
    content,
    date: new Date().toISOString().split("T")[0],
    author: currentUser.name
  };
  
  db.announcements.unshift(newAnn); // Agregar al inicio
  schoolDb.save(db);
  
  // Limpiar campos
  document.getElementById("ann-title").value = "";
  document.getElementById("ann-content").value = "";
  
  showToast("Anuncio escolar publicado correctamente");
  loadAdminStats();
  switchDashboardTab("admin", "stats");
}

// ================= MODAL DE USUARIO =================

function openCreateUserModal() {
  document.getElementById("modal-title").innerText = "Crear Nuevo Usuario";
  document.getElementById("edit-user-id").value = "";
  document.getElementById("user-fullname").value = "";
  document.getElementById("user-username").value = "";
  document.getElementById("user-email").value = "";
  document.getElementById("user-role-select").value = "student";
  document.getElementById("user-role-select").disabled = false;
  
  toggleGradeInput();
  
  const modal = document.getElementById("user-modal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("active"), 10);
}

function openEditUserModal(userId) {
  const db = schoolDb.get();
  const user = db.users.find(u => u.id === userId);
  if (!user) return;
  
  document.getElementById("modal-title").innerText = "Editar Usuario";
  document.getElementById("edit-user-id").value = user.id;
  document.getElementById("user-fullname").value = user.name;
  document.getElementById("user-username").value = user.username;
  document.getElementById("user-email").value = user.email;
  document.getElementById("user-role-select").value = user.role;
  document.getElementById("user-role-select").disabled = true; // No permitir cambiar de rol en edición rápida
  
  toggleGradeInput();
  
  if (user.role === "student") {
    document.getElementById("user-grade").value = user.grade;
  }
  
  const modal = document.getElementById("user-modal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("active"), 10);
}

function closeUserModal(event) {
  // Solo cerrar si da clic en el fondo difuminado
  if (event.target === document.getElementById("user-modal")) {
    closeUserModalDirect();
  }
}

function closeUserModalDirect() {
  const modal = document.getElementById("user-modal");
  modal.classList.remove("active");
  setTimeout(() => modal.style.display = "none", 300);
}

function toggleGradeInput() {
  const role = document.getElementById("user-role-select").value;
  const gradeGroup = document.getElementById("grade-input-group");
  
  if (role === "student") {
    gradeGroup.style.display = "flex";
  } else {
    gradeGroup.style.display = "none";
  }
}

function saveUser() {
  const db = schoolDb.get();
  const userId = document.getElementById("edit-user-id").value;
  const fullname = document.getElementById("user-fullname").value.trim();
  const username = document.getElementById("user-username").value.trim().toLowerCase();
  const email = document.getElementById("user-email").value.trim();
  const role = document.getElementById("user-role-select").value;
  
  if (userId) {
    // Editar existente
    const idx = db.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      db.users[idx].name = fullname;
      db.users[idx].username = username;
      db.users[idx].email = email;
      
      if (role === "student") {
        db.users[idx].grade = document.getElementById("user-grade").value;
      }
      
      showToast("Usuario modificado con éxito");
    }
  } else {
    // Crear nuevo usuario
    // Validar si username ya existe
    const exists = db.users.some(u => u.username.toLowerCase() === username);
    if (exists) {
      showToast("El nombre de usuario ya está registrado", "error");
      return;
    }
    
    const newId = `USR0${db.users.length + 1}`;
    const newUser = {
      id: newId,
      username,
      password: "123", // Contraseña por defecto para testeo
      name: fullname,
      role,
      email
    };
    
    if (role === "student") {
      newUser.grade = document.getElementById("user-grade").value;
      
      // Auto-matricular al nuevo estudiante en todas las materias de su grado con notas en 0
      const classSubjects = db.subjects.filter(s => s.grade === newUser.grade);
      classSubjects.forEach(sub => {
        db.grades.push({
          studentId: newUser.id,
          subjectId: sub.id,
          scores: [0, 0, 0],
          finalScore: 0
        });
      });
    }
    
    db.users.push(newUser);
    showToast("Usuario creado con éxito");
  }
  
  schoolDb.save(db);
  closeUserModalDirect();
  loadAdminUsersList();
}

function deleteUser(userId) {
  if (userId === currentUser.id) {
    showToast("No puedes eliminar tu propio usuario actual", "error");
    return;
  }
  
  if (confirm("¿Estás seguro de que deseas eliminar este usuario de forma permanente?")) {
    const db = schoolDb.get();
    
    // Filtrar usuario de la lista
    db.users = db.users.filter(u => u.id !== userId);
    
    // Limpiar notas y asistencia del usuario eliminado
    db.grades = db.grades.filter(g => g.studentId !== userId);
    db.attendance = db.attendance.filter(a => a.studentId !== userId);
    
    schoolDb.save(db);
    showToast("Usuario eliminado correctamente", "info");
    loadAdminUsersList();
  }
}
