# Intranet Escolar - Colegio Dumani

Una aplicación web SPA (Single Page Application) moderna, interactiva y responsiva diseñada para la gestión académica. Utiliza un diseño premium basado en **Glassmorphism**, efectos translúcidos, variables de color estandarizadas y transiciones de alto rendimiento, optimizado con HTML5, CSS3 vainilla y JavaScript.

## 🚀 Características Principales

*   **Arquitectura SPA**: Enrutamiento interno rápido entre vistas sin recargar la página.
*   **Diseño Premium**: Interfaz estética adaptada a las últimas tendencias de diseño (Glassmorphism, sombras suaves, degradados activos y micro-interacciones).
*   **Persistencia Local**: Simulación de base de datos a través de `localStorage`. Los cambios en calificaciones, asistencia o usuarios se guardan de inmediato y persisten al recargar.
*   **Iconografía Estilizada**: Integración moderna de Lucide Icons.
*   **Notificaciones Toast**: Confirmaciones visuales interactivas para cada acción realizada.

---

## 🔑 Credenciales de Acceso Rápido (Demostración)

La pantalla de inicio incluye botones de **Acceso Rápido** para ingresar de forma inmediata a los distintos roles. Si prefieres ingresar manualmente, las credenciales son (contraseña por defecto `123` para todos):

| Rol | Usuario | Contraseña | Descripción |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `123` | Control total, estadísticas escolares, creación/edición/eliminación de usuarios y publicación de anuncios escolares. |
| **Profesor** | `roberto` | `123` | Profesor de Matemáticas y Física. Modificación de notas y pase de lista diario por fecha. |
| **Profesor** | `carmen` | `123` | Profesora de Lengua e Historia. Modificación de notas y pase de lista diario por fecha. |
| **Estudiante** | `ana` | `123` | Estudiante de 10° Grado A. Consulta de notas del periodo, porcentaje de asistencia, tareas asignadas y anuncios. |
| **Estudiante** | `carlos` | `123` | Estudiante de 10° Grado A. |
| **Estudiante** | `sofia` | `123` | Estudiante de 11° Grado B. |

---

## 🛠️ Estructura del Proyecto

```text
├── index.html         # Estructura HTML5 principal de la SPA y modales
├── styles.css         # Hoja de estilos del sistema de diseño y Glassmorphism
├── js/
│   ├── data.js        # Estructura de datos semilla e inicialización de LocalStorage
│   └── app.js         # Controlador lógico, enrutamiento, renderizadores y eventos
└── README.md          # Documentación del proyecto
```

---

## 💻 Instrucciones de Uso

1.  Abre el archivo [index.html](file:///c:/Users/HP8CZ/Desktop/bernny%20dumani/proyecto%20intranet/index.html) en tu navegador preferido.
2.  Usa los botones de acceso rápido para probar los diferentes flujos:
    *   **Paso 1 (Administrador)**: Entra como `admin`, dirígete a "Usuarios" y crea un nuevo estudiante (ej. "Juan Pérez").
    *   **Paso 2 (Docente)**: Entra como `roberto` (profesor), selecciona tu asignatura e ingresa calificaciones para el estudiante recién creado o modifica las calificaciones existentes de "Ana Gómez". Haz clic en guardar.
    *   **Paso 3 (Estudiante)**: Entra como `ana` y verifica que sus calificaciones y estadísticas de asistencia se han actualizado de forma instantánea de acuerdo con lo registrado por el docente.
