# Requerimientos del Sistema — Intranet Escolar

Este documento lista de forma estructurada los requerimientos funcionales y no funcionales del prototipo de la Intranet Escolar.

## Requerimientos Funcionales (RF)

### 1. Autenticación y Control de Acceso
- [x] **RF1.1**: El sistema debe permitir el inicio de sesión mediante credenciales o selector de rol rápido de prueba (Administración, Docente, Estudiante, Familia).
- [x] **RF1.2**: El sistema debe mantener el estado de sesión activa y permitir el cierre de sesión seguro.
- [x] **RF1.3**: El sistema debe filtrar el menú de navegación y las vistas en función del rol del usuario activo.

### 2. Gestión de Usuarios
- [x] **RF2.1**: Los administradores deben poder listar la totalidad de los usuarios registrados en el centro educativo.
- [x] **RF2.2**: Los administradores deben poder registrar nuevos usuarios especificando nombre, correo, rol y curso/grado asignado.
- [x] **RF2.3**: Los administradores deben poder editar y dar de baja a usuarios existentes.
- [x] **RF2.4**: Los usuarios no administradores no deben poder acceder a las acciones de modificación de cuentas.

### 3. Módulo Académico (Calificaciones y Asistencia)
- [x] **RF3.1**: Los docentes y administradores deben poder ingresar y actualizar calificaciones por asignatura y período lectivo (Trimestre 1, 2, 3).
- [x] **RF3.2**: Los estudiantes y familias deben poder consultar únicamente su boletín de calificaciones correspondiente.
- [x] **RF3.3**: Los docentes y administradores deben poder registrar ausencias, justificaciones y retrasos en el control de asistencia.
- [x] **RF3.4**: El sistema debe calcular promedios automáticos de calificaciones y porcentajes globales de asistencia.

### 4. Tablón de Comunicados
- [x] **RF4.1**: Los administradores y docentes deben poder crear y publicar avisos oficiales clasificándolos por categoría (Aviso, Urgente, Evento) y audiencia.
- [x] **RF4.2**: Los usuarios deben poder consultar los avisos institucionales filtrados por su categoría o búsqueda de texto.
- [x] **RF4.3**: Integración de botón "Resumir con IA" para condensar párrafos extensos en viñetas claras para familias.

### 5. Asistente con IA Generativa
- [x] **RF5.1**: Generación asistida de texto para redacción de circulares y comunicados con tono institucional.
- [x] **RF5.2**: Análisis automático de patrones de asistencia para identificar alumnos con riesgo de ausentismo escolar.

## Requerimientos No Funcionales (RNF)

- [x] **RNF1 (Accesibilidad)**: Cumplimiento de estándares de contraste visual, soporte de navegación por teclado y etiquetas ARIA para lectores de pantalla.
- [x] **RNF2 (Privacidad de Datos)**: No exponer datos personales ni identificadores sensibles de menores en la interfaz pública ni en consolas de desarrollo.
- [x] **RNF3 (Rendimiento)**: Carga instantánea de la interfaz mediante separación de componentes modulares y bajo consumo de memoria.
- [x] **RNF4 (Documentación Markdown)**: Documentación en formato Markdown legible en crudo, versionada en Git y estructurada sin diagramas en texto plano.
