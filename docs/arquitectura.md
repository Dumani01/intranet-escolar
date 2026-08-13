# Arquitectura del Sistema — Intranet Escolar

Este documento describe la arquitectura técnica, las decisiones de diseño y la estructura de componentes de la Intranet Escolar.

## Stack Tecnológico

El proyecto está construido sobre las siguientes tecnologías:

- **Frontend**: React 19 con TypeScript, Vite y Tailwind CSS v4 para una interfaz modular, adaptativa y accesible.
- **Iconografía e Interacción**: Lucide React / Lucide icons y Motion para transiciones fluidas de interfaz.
- **Backend / Servidor de API**: Express.js ejecutado mediante Node.js en entorno contenedorizado Cloud Run.
- **Integración de IA Generativa**: Google GenAI SDK (`@google/genai`) utilizando los modelos Gemini 2.5 Flash para procesamiento seguro en el servidor.
- **Herramientas de Compilación**: Vite y esbuild para el empaquetado optimizado en desarrollo y producción.

## Estructura del Repositorio

La organización del proyecto sigue el patrón de separación de responsabilidades:

- `/src/types.ts`: Definición de interfaces TypeScript (usuarios, roles, comunicados, calificaciones, asistencias).
- `/src/data/mockData.ts`: Colección inicial de datos de prueba para la intranet escolar.
- `/src/services/aiService.ts`: Cliente de llamadas a los endpoints de IA Generativa para resúmenes y análisis.
- `/src/components/`: Componentes modulares reutilizables para la interfaz del usuario.
  - `Navbar.tsx`: Barra superior con indicador de rol, usuario activo y acciones de sesión.
  - `Sidebar.tsx`: Menú lateral adaptativo con control de acceso por rol.
  - `AuthModal.tsx`: Panel de inicio de sesión y cambio rápido de perfil de prueba.
  - `UserManagement.tsx`: Módulo de administración de usuarios (Alta, Baja, Edición).
  - `AcademicModule.tsx`: Gestión de calificaciones y mapa de asistencia interactivo.
  - `AnnouncementsModule.tsx`: Tablón de comunicados con síntesis con IA integrada.
  - `AIAssistantModule.tsx`: Módulo especializado en análisis predictivo e informes asistidos.
- `/server.ts`: Servidor Express que actúa como proxy seguro para las llamadas a la API de Gemini y sirve los estáticos.
- `/docs/`: Documentación técnica detallada del sistema.

## Seguridad y Control de Acceso Basado en Roles (RBAC)

El sistema aplica filtrado estricto en el lado del cliente y del servidor para asegurar el cumplimiento del principio de menor privilegio:

### Matriz de Permisos por Rol

| Módulo / Acción | Administración | Docente | Estudiante | Familia |
|---|---|---|---|---|
| Gestionar usuarios (Crear/Editar/Eliminar) | Permitido | Denegado | Denegado | Denegado |
| Editar calificaciones y asistencia | Permitido | Permitido | Denegado | Denegado |
| Ver calificaciones del alumno autenticado | Todos los alumnos | Sus materias asignadas | Solo sus calificaciones | Solo sus representados |
| Publicar comunicados oficiales | Permitido | Permitido | Denegado | Denegado |
| Ver comunicados generales / por aula | Todos | Todos | Asignados a su curso | Asignados a su representado |
| Usar Asistente de IA (Generación de circulares) | Permitido | Permitido | Denegado | Denegado |
| Usar Asistente de IA (Resumen de avisos) | Permitido | Permitido | Permitido | Permitido |

## Integración con IA Generativa (Gemini API)

Las llamadas a la API de Inteligencia Artificial se procesan de forma **servidor-servidor** a través del endpoint `/api/ai/*` alojado en Express (`server.ts`). Esto garantiza que las claves de API (`GEMINI_API_KEY`) permanezcan protegidas en las variables de entorno sin exponerse al cliente web.
