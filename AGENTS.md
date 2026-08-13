# AGENTS.md — Memoria del Agente de IA y Contexto de Colaboración

## Contexto
Este proyecto es un prototipo funcional de **Intranet Escolar** para una institución educativa pública. El sistema permite la interacción y gestión de información entre cuatro perfiles de usuarios: Administración, Docentes, Estudiantes y Familias. 

El repositorio está optimizado para la colaboración entre un equipo de dos desarrolladores humanos y agentes de Inteligencia Artificial Generativa. El stack real del proyecto está compuesto por React 19, TypeScript, Vite, Tailwind CSS v4 y un servidor Express, priorizando componentes funcionales, tipado compartido y módulos con responsabilidades claras.

## Requerimientos
- **Autenticación por Roles**: Sistema de inicio de sesión con control de acceso basado en roles (RBAC) para Administración, Docentes y Estudiantes/Familias.
- **Gestión de Usuarios**: Módulo de alta, baja, edición y consulta de personas con alcance restringido por rol.
- **Módulo Académico**: Registro y visualización de calificaciones y control de asistencia por asignaturas y períodos lectivos.
- **Tablón de Comunicados**: Publicación, filtrado y lectura de avisos institucionales y circulares del centro.
- **Control de Visibilidad**: Filtrado estricto en el lado del cliente y servidor para asegurar que cada perfil vea exclusivamente la información autorizada.
- **Asistencia con IA Generativa**: Estructuración de datos en esquemas JSON limpios para permitir procesamiento por LLMs (resumen de comunicados, detección de anomalías en asistencia y generación de reportes).

## Reglas
- **Modularidad en React y TypeScript**: La interfaz debe organizarse en componentes funcionales tipados, hooks y servicios separados, evitando componentes monolíticos y responsabilidades mezcladas.
- **Entregas de Código JS**: Todo código JavaScript compartido o generado debe proporcionarse en texto plano sin bloques de código Markdown ni comillas invertidas.
- **Nombres Semánticos**: Variables y funciones en `camelCase` e inglés o español técnico consistente (ej. `currentUser`, `renderGradesTable`).
- **HTML Semántico y Accesibilidad**: Uso obligatorio de etiquetas HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) y atributos ARIA para la navegación por teclado y lectores de pantalla.
- **Documentación en Markdown**: Toda la documentación del proyecto se mantiene en Markdown estricto (GFM) respetando la jerarquía de encabezados (`#`, `##`, `###`).

## Restricciones
- **PROHIBICIÓN ABSOLUTA DE DIAGRAMAS EN TEXTO**: Bajo ninguna circunstancia se deben incluir diagramas ASCII, esquemas dibujados con caracteres o gráficos de texto dentro de la documentación o las respuestas.
- **SIN FORMATO EN BLOQUES PARA JS**: Está estrictamente prohibido envolver código JavaScript en bloques de Markdown (```js ... ```) en las interacciones o respuestas.
- **Protección de Datos Sensibles**: Queda estrictamente prohibido exponer información sensible o identificadores personales de menores en la interfaz pública o en registros de consola.
- **Almacenamiento Seguro**: No guardar contraseñas ni tokens en texto plano ni en variables globales accesibles sin sanitización.
- **Conservar el stack existente**: Mantener React, TypeScript, Vite, Tailwind CSS y Express. No migrar a otro framework ni añadir dependencias pesadas sin una necesidad documentada y aprobación del equipo.

## Objetivos
- Alcanzar un prototipo 100% funcional y probado para la intranet escolar.
- Demostrar la máxima calidad técnica en documentación para habilitar un flujo de trabajo asistido por IA listo para producción.
- Posicionar al equipo de desarrollo con estándares profesionales para el mercado laboral en ingeniería de software orientada a IA Generativa.
- Facilitar la integración de modelos LLM (como Gemini) mediante endpoints y funciones puras listas para consumir context window y JSON estructurado.

## Memoria del Proyecto
- **2026-08-12**: Creación de la estructura del repositorio y establecimiento del archivo `AGENTS.md` como fuente única de verdad para agentes de IA y desarrolladores humanos.
- **2026-08-12**: Corrección de la documentación del stack para reflejar la implementación real en React 19, TypeScript, Vite, Tailwind CSS v4 y Express.
- **2026-08-12**: Establecimiento de la política de autenticación mock basada en roles y almacenamiento en estado local sanitizado.

## Buenas Prácticas
- **Documentación orientada a contexto (RAG-Ready)**: Explicar siempre el "por qué" de las decisiones arquitectónicas en lugar de solo el "qué".
- **Descomposición Paso a Paso**: Explicar conceptualmente y paso a paso cualquier manipulación compleja del DOM, filtrado de arreglos o lógica de estados antes de entregar la solución en código.
- **Commits Atómicos**: Mensajes de commit claros y descriptivos siguiendo la convención Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).
- **Procesamiento de IA eficiente**: Diseñar estructuras de datos orientadas a arrays de objetos sencillos (`{ id, role, name, grade }`) que permitan a modelos de IA realizar análisis de datos o resúmenes sin costo computacional excesivo.
