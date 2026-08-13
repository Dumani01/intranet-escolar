# Historial de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo. El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-08-12

### Añadido
- **Autenticación por Roles**: Implementación de inicio de sesión mock con soporte para roles de Administración, Docente, Estudiante y Familia.
- **Gestión de Usuarios (RBAC)**: Módulo interactivo para listar, crear, editar y eliminar usuarios con restricciones de privacidad según rol.
- **Módulo Académico**:
  - Registro y visualización de calificaciones por asignatura y período lectivo.
  - Registro y control de asistencia con indicadores de ausencias e imprevistos.
- **Tablón de Comunicados Institucionales**:
  - Publicación y clasificación de avisos por categoría (Avisos, Urgente, Eventos).
  - Filtro automático de comunicados según la audiencia destino de cada perfil.
- **Asistente e Integración con IA Generativa (Gemini API)**:
  - Función de síntesis y resumen automático de comunicados oficiales.
  - Detección de patrones y anomalías en el historial de asistencia escolar.
  - Generador de circulares institucionales para docentes y administrativos.
- **Documentación Técnica Completa**:
  - Creación de `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CHANGELOG.md`.
  - Creación de `docs/arquitectura.md` y `docs/requerimientos.md`.
