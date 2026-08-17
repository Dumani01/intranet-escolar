# Intranet Escolar — Sistema de Gestión Educativa e Integración con IA

Prototipo funcional de una **Intranet Escolar** diseñada para instituciones educativas públicas. El sistema centraliza y optimiza la interacción, la gestión académica y la comunicación institucional entre cuatro perfiles de usuario: **Administración**, **Docentes**, **Estudiantes** y **Familias**.

Este proyecto ha sido desarrollado bajo estrictos estándares de código limpio y estructurado en **Markdown (GitHub Flavored Markdown - GFM)** para garantizar la máxima legibilidad, mantenibilidad y colaboración entre desarrolladores humanos y modelos de *Inteligencia Artificial Generativa*.

---

## Características Principales

- **Control de Acceso Basado en Roles (RBAC)**: Autenticación con permisos diferenciados y vistas dinámicas para 4 perfiles.
- **Gestión Integral de Usuarios**: Módulo administrativo para alta, edición, consulta y baja de integrantes de la comunidad escolar.
- **Módulo Académico**:
  - Registro y consulta de calificaciones por períodos trimestrales y materias.
  - Control de asistencia interactivo con métricas de puntualidad y ausentismo.
- **Tablón de Comunicados Oficiales**: Publicación, filtrado por categorías y lectura de avisos y circulares del centro.
- **Asistencia Inteligente con Gemini API**:
  - *Síntesis de comunicados*: Resumen automático en viñetas claras para familias.
  - *Detección de patrones*: Análisis pedagógico de asistencia escolar para alertar sobre ausentismo.
  - *Redacción asistida*: Generación de circulares oficiales con tono institucional para docentes y directivos.

---

## Stack Tecnológico

| Componente | Tecnología | Versión / Detalle |
|---|---|---|
| **Frontend** | React + TypeScript | React 19, componentes funcionales |
| **Estilos** | Tailwind CSS | v4 con diseño responsivo y accesible |
| **Herramientas de Build** | Vite + esbuild | Compilación ultra rápida y bundles optimizados |
| **Backend & API** | Node.js + Express | Servidor proxy seguro en puerto 3000 |
| **Inteligencia Artificial** | Google GenAI SDK | Modelos Gemini 2.5 Flash en el servidor |
| **Iconografía** | Lucide React | Iconos vectoriales accesibles |

---

## Requisitos del Sistema e Instalación

### Prerrequisitos

Antes de comenzar, asegúrate de contar con los siguientes elementos instalados en tu equipo:

- **Node.js**: Versión 18.0.0 o superior ([Descargar Node.js](https://nodejs.org/)).
- **npm**: Versión 9.0.0 o superior (incluido con Node.js).
- **Clave de API de Gemini (Opcional)**: Para habilitar las funciones generativas de IA ([Google AI Studio](https://aistudio.google.com/)).

### Instrucciones de Instalación Paso a Paso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-organizacion/intranet-escolar.git
   ```

2. **Navegar a la carpeta del proyecto:**
   ```bash
   cd intranet-escolar
   ```

3. **Instalar las dependencias:**
   ```bash
   npm install
   ```

4. **Configurar las variables de entorno:**
   Copia el archivo de ejemplo para crear tu configuración local:
   ```bash
   cp .env.example .env
   ```
   Abre el archivo `.env` y asigna tu clave de Google Gemini:
   ```env
   GEMINI_API_KEY=tu_clave_de_api_aqui
   ```
   > *Nota*: Si no se proporciona una clave de API, el sistema utilizará respuestas simuladas predefinidas para no interrumpir el flujo de prueba.

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación:**
   Abre tu navegador web e ingresa a:
   [http://localhost:3000](http://localhost:3000)

---

## Ejemplo de Uso

A continuación se describen los pasos recomendados para explorar todas las funcionalidades del sistema:

1. **Selección de Perfil de Prueba**:
   - Haz clic en el botón de **Cambiar Rol** en la barra superior de navegación.
   - Selecciona el rol deseado: **Administrador**, **Docente**, **Estudiante** o **Familia**.
   - Observa cómo la barra lateral de navegación adapta sus opciones automáticamente según los permisos de cada usuario.

2. **Gestión de Calificaciones y Asistencia (Perfil Docente o Admin)**:
   - Dirígete al módulo **Académico**.
   - Selecciona una materia y haz clic en *Nueva Calificación* para asentar una nota a un alumno.
   - En la pestaña de *Asistencia*, registra presentes, ausencias o justificaciones del día.

3. **Consulta de Boletín (Perfil Estudiante o Familia)**:
   - Cambia al perfil de *Estudiante* o *Familia*.
   - Accede a **Académico** y verifica que únicamente se muestran las notas y asistencias correspondientes al alumno autenticado.

4. **Uso del Asistente de IA en Comunicados**:
   - Ve a la sección **Comunicados**.
   - En cualquier anuncio institucional extenso, presiona el botón **Resumir con IA** para obtener de inmediato los 3 puntos clave redactados de forma clara.
   - En la sección **Asistente IA**, utiliza el redactor para generar un borrador institucional a partir de un tema y público objetivo.

---

## Estructura de Documentación

Toda la documentación técnica del proyecto se encuentra disponible en formato Markdown dentro del repositorio:

- [`README.md`](./README.md): Presentación general, requisitos, instalación y ejemplo de uso.
- [`AGENTS.md`](./AGENTS.md): Memoria del agente de IA, contexto, directrices de desarrollo y buenas prácticas.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md): Guía de contribución, flujo de ramas Git, commits y revisión de PRs.
- [`CHANGELOG.md`](./CHANGELOG.md): Historial cronológico de cambios bajo la especificación *Keep a Changelog*.
- [`docs/arquitectura.md`](./docs/arquitectura.md): Decisiones arquitectónicas, flujo de datos y matriz RBAC.
- [`docs/requerimientos.md`](./docs/requerimientos.md): Especificación de requerimientos funcionales y no funcionales.

---

## Estado del Proyecto y Verificaciones

- [x] Autenticación por roles (RBAC) operativa.
- [x] Módulo de gestión de usuarios con validación de permisos.
- [x] Registro y cálculo de calificaciones y asistencia.
- [x] Tablón de comunicados con filtros de visibilidad.
- [x] Endpoints seguros de IA Generativa con `@google/genai`.
- [x] Documentación completa en Markdown estándar (GFM).

---

## Licencia

Este proyecto se encuentra distribuido bajo la **Licencia MIT**.

> Se autoriza el uso, modificación, distribución y comercialización del software de acuerdo con los términos estipulados en la [Licencia MIT](https://opensource.org/licenses/MIT).
