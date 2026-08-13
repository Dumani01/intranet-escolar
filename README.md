# Intranet Escolar — Sistema de Gestión Educativa e Integración con IA

Prototipo funcional de una Intranet Escolar para instituciones educativas públicas. El sistema permite gestionar la información y comunicación entre cuatro perfiles de usuario: **Administración**, **Docentes**, **Estudiantes** y **Familias**.

Este proyecto está diseñado bajo estándares de código limpio y estructurado en Markdown (GFM) para maximizar la legibilidad y colaboración entre desarrolladores humanos y Agentes de Inteligencia Artificial Generativa.

## Características Principales

- **Control de Acceso Basado en Roles (RBAC)**: Sesión activa y vistas personalizadas según el rol autenticado.
- **Módulo de Usuarios**: Alta, edición, filtrado y baja de usuarios con permisos específicos por rol.
- **Módulo Académico**: Registro y visualización de calificaciones por asignatura, período lectivo y seguimiento de asistencia.
- **Tablón de Comunicados**: Publicación de noticias, circulares y avisos oficiales del centro con filtros de visibilidad.
- **Asistente e Integración con IA Generativa (Gemini API)**:
  - Resumen automático de comunicados complejos para familias.
  - Detección inteligente de anomalías en el control de asistencia.
  - Redacción asistida de circulares oficiales para docentes y administración.

## Requisitos de Instalación y Ejecución

### Prerrequisitos
- Node.js versión 18 o superior.
- npm o bun instalados.

### Pasos de Instalación

1. Clonar el repositorio:
   git clone https://github.com/tu-usuario/intranet-escolar.git

2. Navegar al directorio del proyecto:
   cd intranet-escolar

3. Instalar las dependencias:
   npm install

4. Configurar variables de entorno:
   Copiar `.env.example` a `.env` y configurar la clave `GEMINI_API_KEY` para habilitar funciones de IA Generativa.

5. Iniciar el servidor de desarrollo:
   npm run dev

6. Abrir en el navegador:
   Acceder a `http://localhost:3000`.

## Ejemplo de Uso

1. Seleccione un rol en la pantalla de inicio de sesión de prueba (ej. **Administrador**, **Docente**, **Estudiante** o **Familia**).
2. Explore los módulos disponibles en el menú lateral de navegación según sus permisos.
3. En el **Tablón de Comunicados**, utilice la función "Resumir con IA" para obtener una versión ejecutiva simplificada de los anuncios.
4. En el **Módulo Académico**, alterne entre la vista de calificaciones y la gráfica de asistencia.

## Estructura de Documentación

Toda la documentación técnica del proyecto se encuentra en formato Markdown dentro del repositorio:

- `README.md`: Presentación y guía rápida de uso.
- `AGENTS.md`: Memoria del agente de IA y normas de colaboración.
- `CONTRIBUTING.md`: Guía de contribución, flujo de trabajo con Git y Pull Requests.
- `CHANGELOG.md`: Historial estructurado de versiones del proyecto.
- `docs/arquitectura.md`: Decisiones arquitectónicas, stack y flujo de datos.
- `docs/requerimientos.md`: Lista detallada de requerimientos funcionales y no funcionales.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo de licencia para más detalles.
