# Guía de Contribución — Intranet Escolar

Agradecemos las contribuciones a la Intranet Escolar. Este documento establece los estándares de trabajo y colaboración entre el equipo de desarrolladores humanos y las herramientas de Inteligencia Artificial.

## Flujo de Trabajo con Git

### Estrategia de Ramas (Git Flow Simplificado)

- `main`: Rama de producción estable. Todo código en `main` debe ser funcional y pasar las verificaciones de compilación.
- `develop`: Rama de integración para el desarrollo continuo.
- `feat/<nombre-funcionalidad>`: Ramas para la creación de nuevas características (ejemplo: `feat/modulo-calificaciones`).
- `fix/<nombre-error>`: Ramas para la corrección de errores (ejemplo: `fix/error-sesion-roles`).
- `docs/<nombre-documento>`: Ramas exclusivas para documentación en Markdown (ejemplo: `docs/actualizar-arquitectura`).

### Convención de Commits

Utilizamos el estándar de **Conventional Commits** para mantener un historial claro:

- `feat`: Nueva funcionalidad para el usuario.
- `fix`: Corrección de un error en el código.
- `docs`: Cambios en la documentación (archivos `.md`).
- `style`: Cambios de formato o estilos CSS sin alterar la lógica.
- `refactor`: Reestructuración de código sin cambiar la funcionalidad.
- `test`: Añadir o corregir pruebas unitarias o de integración.

Ejemplo de mensaje de commit:
`feat(academico): agregar filtro de calificaciones por periodo lectivo`

## Normas de Código y Estilo

1. **Modularidad**: Dividir las responsabilidades en archivos y componentes delgados con un propósito único.
2. **Nombres Semánticos**: Utilizar `camelCase` para variables y funciones, `PascalCase` para componentes y clases, y `UPPER_SNAKE_CASE` para constantes globalmente configuradas.
3. **Formatos de Código**:
   - Todo código debe incluir comentarios descriptivos en funciones complejas.
   - Respetar la regla de no incluir diagramas en texto plano en la documentación.
4. **Accesibilidad**: Comprobar el uso de etiquetas HTML semánticas y la navegabilidad completa mediante teclado.

## Proceso de Revisión de Pull Requests (PR)

1. Crear un Pull Request desde la rama de trabajo hacia `develop`.
2. Completar la plantilla de PR describiendo:
   - Resumen del cambio efectuado.
   - Requerimiento asociado en `docs/requerimientos.md`.
   - Pruebas realizadas.
3. Se requiere la aprobación de al menos un integrante del equipo de desarrolladores antes de fusionar el código.
