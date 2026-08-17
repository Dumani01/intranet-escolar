# Plan de colaboración

Este repositorio base contiene componentes provisionales para que las dos ramas puedan compilar de manera independiente. Cada integrante reemplaza exclusivamente los archivos asignados a su módulo.

| Rama | Integrante | Módulos |
| --- | --- | --- |
| `feature/kendall-academico-comunicados` | kendall | Navbar, Sidebar, comunicados, académico y gráfico de asistencia |
| `feature/companero-usuarios-ia` | Bernny| Autenticación, gestión de usuarios, perfil y asistente de IA |

Los archivos compartidos, como `App.tsx`, tipos, datos, servicios y configuración, pertenecen a `main` y no deben modificarse desde las ramas de características. Esta separación permite fusionar ambos Pull Requests sin conflictos.
