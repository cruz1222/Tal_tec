# TalTec · Inscripción a talleres extraescolares

Página web para que los alumnos se inscriban a talleres, para que los entrenadores registren horas de asistencia y para que la jefatura administre todo. Los datos se guardan en una hoja de Google Sheets y un script de Google Apps Script hace de servidor.

```
Alumno / Entrenador / Jefatura  →  TalTec_v2.html  →  Apps Script (/exec)  →  Google Sheets
```

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `TalTec.html` | La página. Es un solo archivo, sin instalar nada. |
| `TalTec_Codigo.gs` | El servidor. Se pega en Apps Script dentro de la hoja. |
| `TalTec_base_de_datos.xlsx` | Base inicial con los 16 talleres. Se sube a Google Drive. |
| `logo.png` | Logo de la escuela. Debe estar en la misma carpeta que el HTML. |

## Qué hace cada rol

| Rol | Entra con | Puede |
|---|---|---|
| **Alumno** | Número de control + NIP | Ver talleres, inscribirse, cambiar de taller, registrar su información de salud, ver sus horas, descargar su comprobante y su constancia |
| **Entrenador** | Contraseña de su taller | Ver los inscritos de su taller (con teléfono y salud), registrar horas de cada sesión |
| **Jefatura** | Contraseña de jefatura | Ver todos los talleres y alumnos, abrir o cerrar el periodo, copiar listas, entrar a cualquier taller |

Solo pueden inscribirse los alumnos que estén en la hoja **Alumnos** (el padrón).

## Instalación

### 1. Crear la hoja de Google
1. Sube `TalTec_base_de_datos.xlsx` a Google Drive y ábrelo con Google Sheets.
2. Ve a **Archivo → Guardar como hoja de cálculo de Google**. Trabaja siempre en esa copia (sin la etiqueta `.XLSX`); si no, no aparece el menú *Extensiones*.

### 2. Poner el servidor
1. En la hoja: **Extensiones → Apps Script**.
2. Borra el código de ejemplo y pega todo `TalTec_Codigo_v2.gs`. Guarda.
3. Elige la función **configurar** y pulsa **Ejecutar** (acepta los permisos). Crea las hojas `Ajustes`, `Alumnos`, `Entrenadores` y `Constancias`.

### 3. Llenar los datos
- **Ajustes:** nombre de la institución (B6) y de quien firma las constancias (B7). La clave de jefatura se genera sola en B2.
- **Alumnos:** pega el padrón (control, nombre, semestre, sexo). Luego usa el menú **TalTec → Generar NIP** para dar un NIP a cada alumno. Borra los 3 alumnos de prueba.
- **Entrenadores:** escribe el nombre de cada entrenador. Las claves se generan solas; puedes cambiarlas.
- **Talleres:** ajusta cupo y mínimo (columnas F y G, texto azul). Los valores actuales son de prueba.

### 4. Publicar el servidor
1. **Implementar → Nueva implementación → Aplicación web**.
2. *Ejecutar como:* **Yo**. *Quién tiene acceso:* **Cualquiera**.
3. Implementa, autoriza y copia la URL que termina en `/exec`.

### 5. Conectar la página
En `TalTec_v2.html` busca la línea `const API_URL=` y pega tu URL `/exec` entre las comillas.

### 6. (Opcional) Logo
Guarda el logo como `logo.png` junto al HTML. Aparece en la esquina del encabezado, en el comprobante y en la constancia. Si el archivo no existe, la página funciona igual sin logo.

### 7. Ponerla en internet
Para que los alumnos la usen necesitas alojar el HTML (y `logo.png`). Opciones gratuitas: [Netlify Drop](https://app.netlify.com/drop) (arrastras la carpeta; renombra el HTML a `index.html`) o GitHub Pages. Para pruebas basta con abrir el HTML con doble clic.

## Cómo está organizada la hoja

| Hoja | Columnas / celdas |
|---|---|
| **Talleres** | ID, Taller, Tipo, Horario, Bloque, Cupo, Mínimo + (calculadas) Inscritos, Lugares libres, Estado |
| **Inscripciones** | Control, Nombre, Semestre, Sexo, Teléfono, Taller_ID, Horas |
| **Config** | `B2` = SI / NO (interruptor del periodo de inscripciones y cambios) |
| **Ajustes** | B2 clave jefatura · B3 fecha de inicio · B4 fecha de cierre · B5 horas requeridas (50) · B6 institución · B7 responsable que firma |
| **Alumnos** | Control, Nombre, Semestre, Sexo, Teléfono, NIP, Salud, Nota de salud, Actualizado |
| **Entrenadores** | Taller_ID, Taller, Entrenador, Clave |
| **Constancias** | Folio, Fecha, Control, Nombre, Taller_ID, Taller, Horas |

**No cambies el orden ni el nombre de las hojas y columnas:** el servidor las lee por posición. Tampoco agregues filas de totales debajo de las tablas.

## Reglas del sistema

- **Cupo:** un taller lleno ya no recibe inscripciones. Si tiene menos inscritos que el mínimo, aparece "En espera: pocos inscritos".
- **Periodo:** se abre o cierra con `Config!B2` o desde el panel de jefatura. Si pones fechas en `Ajustes` (B3, B4), además se abre y cierra solo.
- **Horas:** el entrenador elige las horas de cada sesión (1, 2, 3 h o una cantidad personalizada, de 0.25 a 12, de 15 en 15 min).
- **Constancia:** aparece cuando el alumno llega a las horas requeridas (50 por defecto, `Ajustes!B5`). Lleva folio automático (`TT-2026-0001`) y queda registrada en la hoja `Constancias`. Se guarda como PDF desde *Imprimir*.
- **Varios talleres:** un alumno puede estar en varios, pero recibe un solo crédito.
- **Salud:** el alumno elige de una lista fija (asma, alergia, diabetes, corazón, epilepsia, presión, articulaciones, espalda, visión o audición) y puede añadir un detalle de máximo 80 letras, solo sobre lo que marcó. No acepta números, correos, enlaces ni insultos, y exige autorización. Solo la ven la jefatura y el entrenador de ese taller.

## Seguridad

- Las contraseñas y los NIP se validan en el servidor, no en la página. Sin ellos, la página solo muestra talleres y lugares ocupados.
- Tras 5 intentos fallidos se bloquea ese acceso durante 10 minutos.
- Las claves y los NIP están en **texto simple** en la hoja. Comparte la hoja solo con la jefatura.
- La URL `/exec` es pública, pero sin clave no devuelve nombres, teléfonos ni datos de salud.
- Los datos de salud son sensibles: avisa a los alumnos para qué se usan.
- Si cambias una clave o el NIP de un alumno, el cambio aplica de inmediato.

## Mantenimiento

- **Cambiar el script:** pega el código nuevo, guarda y ve a **Implementar → Administrar implementaciones → lápiz → Versión: Nueva versión → Implementar**. La URL no cambia.
- **Corregir horas mal registradas:** edita la columna *Horas* en la hoja `Inscripciones`.
- **Nuevo ciclo escolar:** respalda la hoja (*Archivo → Hacer una copia*), borra las filas de `Inscripciones` y `Constancias` (deja los encabezados) y actualiza `Alumnos`, `Entrenadores` y `Ajustes`.
- **Quitar los datos de prueba:** borra los 3 alumnos de prueba (24660001 a 24660003) y cualquier inscripción de prueba.

## Si algo falla

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El encabezado dice "Conectando…" o "Sin conexión" | URL mal pegada o acceso mal configurado | Abre la URL `/exec` en el navegador: debe mostrar texto con `"ok":true`. Revisa que el acceso sea **Cualquiera** |
| Mensaje con `Cannot read properties of null` | Falta una hoja | Ejecuta **configurar** en Apps Script |
| "Contraseña incorrecta" | Clave mal copiada | Cópiala de `Ajustes!B2` (jefatura) o `Entrenadores` columna D |
| "Demasiados intentos" | 5 fallos seguidos | Espera 10 minutos |
| "Número de control o NIP incorrecto" | El alumno no está en el padrón o no tiene NIP | Revisa la hoja `Alumnos` |
| La página tarda al entrar | Google tarda en responder la primera vez | Espera hasta 30 segundos; después marca error |
| No sale el menú *Extensiones* | Estás en el `.xlsx` | Usa *Guardar como hoja de cálculo de Google* |
| El logo no aparece | `logo.png` no está junto al HTML | Colócalo en la misma carpeta con ese nombre exacto |

## Límites conocidos

- Es un prototipo: el servidor de Google tiene límites de uso y puede tardar si muchos alumnos entran al mismo tiempo.
- No hay botón para deshacer horas; se corrigen en la hoja.
- Las pruebas se hicieron con una hoja simulada, no con el Google real; haz una prueba completa antes de usarlo con alumnos.
