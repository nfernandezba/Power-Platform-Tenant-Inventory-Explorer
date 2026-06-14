# Actualización manual de GitHub Pages — v1.0

Estas instrucciones no requieren Git ni Node.js.

## Qué incluye el paquete completo

```text
index.html
.nojekyll
assets/
README.md
SECURITY.md
LICENSE
LICENSE.md
APP_REGISTRATION_AND_TENANT_SETUP.md
TROUBLESHOOTING.md
CHANGELOG.md
VALIDATION.md
ACTUALIZAR_GITHUB_PAGES_MANUALMENTE.md
SAMPLE_REPORT.pdf
developer-source/
```

La carpeta `developer-source/` contiene el proyecto Vite, tests, scripts y workflow. GitHub Pages no la ejecuta cuando el sitio se publica desde `main` y `/(root)`.

## 1. Descargar y descomprimir

Descarga el ZIP completo y descomprímelo. No subas el ZIP directamente.

## 2. Abrir el repositorio

1. Inicia sesión en GitHub.
2. Abre el repositorio donde está publicada la aplicación.
3. En **Code**, selecciona **Add file > Upload files**.

## 3. Subir todo el contenido

Arrastra todos los archivos y carpetas situados dentro del ZIP descomprimido. `index.html` debe quedar directamente en la raíz.

Es imprescindible sustituir juntos:

```text
index.html
assets/
```

La nueva versión utiliza nombres compilados distintos y portadas nuevas con nombres únicos. No basta con sustituir únicamente las imágenes.

La estructura correcta es:

```text
repository/
├── index.html
├── .nojekyll
├── assets/
├── README.md
├── SECURITY.md
├── LICENSE
├── LICENSE.md
├── APP_REGISTRATION_AND_TENANT_SETUP.md
├── TROUBLESHOOTING.md
├── CHANGELOG.md
├── VALIDATION.md
├── ACTUALIZAR_GITHUB_PAGES_MANUALMENTE.md
├── SAMPLE_REPORT.pdf
└── developer-source/
```

## 4. Confirmar los cambios

Utiliza este mensaje:

```text
Add read-only Gobernanza del tenant and resolve resource owner names
```

Selecciona **Commit directly to the main branch** y pulsa **Commit changes**.

## 5. Mantener la configuración de Pages

Conserva:

```text
Settings > Pages > Deploy from a branch > main > /(root)
```

## 6. Esperar la publicación

Revisa **Actions** o **Settings > Pages** hasta que `pages build and deployment` aparezca en verde.

## 7. Eliminar datos antiguos del navegador

Después de publicar:

1. Abre la aplicación con `Ctrl + F5` en Windows o `Cmd + Shift + R` en macOS.
2. Pulsa **Clear cache** en la aplicación.
3. Cierra sesión y vuelve a conectar el tenant.
4. Recarga Overview, Environments y el tipo de recurso que quieras probar.

Este paso elimina filas guardadas con el esquema de caché anterior, que podían conservar GUIDs o campos vacíos.

## 8. Validar los cambios

1. Confirma que la interfaz continúa mostrando **v1.0**.
2. Comprueba que Environments muestra el nombre visible y no el GUID como texto principal.
3. Abre **Ajustes de administración del entorno** y confirma que el selector muestra únicamente Managed Environments.
4. Carga un tipo de recurso y verifica Name, Environment, Created y Modified.
5. En un recurso compatible, pulsa **Load** en la columna Connectors.
6. Comprueba que el detalle muestra conectores y operaciones, o un mensaje claro cuando la API no devuelve datos.
7. Pulsa **Export PDF** sin cargar todos los datasets y verifica que aparece el cuadro de confirmación.
8. Prueba **Cancel export** y después **Continue and export**.
9. En **Resources**, pulsa **Resolver nombres de propietarios** y confirma que los usuarios resolubles muestran nombre completo y user principal name.
10. Abre **Gobernanza del tenant**, prueba primero la consulta en vivo y después la importación de un JSON local.
11. Abre **Ajustes de administración del entorno** y confirma que solo aparecen Managed Environments.
12. Verifica que un entorno Not Managed muestre **No aplicable** y no genere una llamada a la API.
13. Si un Managed Environment no tiene un registro explícito, confirma que aparezca **No configurado** en lugar de error.
14. Cambia entre los baselines disponibles y confirma que solo cambia la evaluación local.
15. Comprueba la portada original del libro de Copilot Studio tanto en la SPA como en la última página del PDF.

## Microsoft Entra

No necesitas modificar la URL de redirección ni crear un Client Secret.

Permisos delegados recomendados:

```text
Power Platform API
- ResourceQuery.Resources.Read
- EnvironmentManagement.Environments.Read
- EnvironmentManagement.Settings.Read

Microsoft Graph
- User.ReadBasic.All

Power Apps Service
- User — Access the Power Apps Service API
```

Power Apps Service debe tener el Application ID `475226c6-020e-4fb2-8a90-7a972cbfc1d4`. No crees Client Secret ni permisos de escritura.
