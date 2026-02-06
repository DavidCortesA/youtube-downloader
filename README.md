# 🎬 YouTube Downloader

Un descargador de videos de YouTube fácil de usar con soporte para descarga de videos, audio, y reemplazo automático de intros.

## ✨ Características

- 📥 **Descarga de videos** en formato MP4 (mejor calidad disponible)
- 🎵 **Extracción de audio** en formato MP3
- ✂️ **Reemplazo de intro automático** - Corta la intro vieja y agrega una nueva
- 📊 **Barra de progreso** en tiempo real
- 🍪 **Soporte para videos restringidos** mediante cookies de autenticación
- 🌍 **Bypass de restricciones geográficas**
- 📝 **Interfaz interactiva** con menús fáciles de usar

## 📋 Requisitos

- Node.js (versión 12 o superior)
- FFmpeg (requerido para procesamiento de video)

### Instalación de FFmpeg

**Windows:**
```bash
# Con Chocolatey
choco install ffmpeg

# Con Scoop
scoop install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg
```

## 🚀 Instalación

1. Clona o descarga este repositorio:
```bash
git clone <url-del-repositorio>
cd youtube-downloader
```

2. Instala las dependencias:
```bash
npm install
```

## 💻 Uso

1. Ejecuta el programa:
```bash
node index.js
```

2. Sigue las instrucciones en pantalla:
   - Pega el enlace del video de YouTube
   - Selecciona la acción deseada:
     - **Descarga Normal (Video MP4)**: Descarga el video en la mejor calidad
     - **Descarga + Cambiar Intro (Video)**: Reemplaza la intro del video
     - **Solo Audio (MP3)**: Extrae solo el audio del video

3. Los archivos descargados se guardarán en la carpeta `descargas/`

## 🎨 Reemplazo de Intro

Para usar la función de reemplazo de intro:

1. Coloca tu archivo de intro (debe llamarse `intro.mp4`) en la carpeta `assets/`
2. Selecciona la opción "Descarga + Cambiar Intro (Video)"
3. Indica cuántos segundos dura la intro vieja (ej: 10)
4. El programa:
   - Descargará el video
   - Cortará los primeros N segundos (intro vieja)
   - Agregará tu intro nueva al inicio
   - Sincronizará formatos y resoluciones automáticamente (escala a 1080p)

## 🍪 Videos Restringidos

Si encuentras el error "This video is not available", puede ser un video con restricciones. Consulta [COOKIES_HELP.md](COOKIES_HELP.md) para instrucciones detalladas sobre cómo exportar cookies de tu navegador.

### Resumen rápido:

1. Instala la extensión "Get cookies.txt LOCALLY" (Chrome/Edge) o "cookies.txt" (Firefox)
2. Inicia sesión en YouTube
3. Exporta las cookies como `cookies.txt`
4. Guarda el archivo en la carpeta del proyecto
5. Ejecuta el programa nuevamente

## 📁 Estructura del Proyecto

```
youtube-downloader/
├── index.js              # Archivo principal
├── package.json          # Dependencias del proyecto
├── .gitignore           # Archivos ignorados por git
├── README.md            # Este archivo
├── COOKIES_HELP.md      # Guía para exportar cookies
├── assets/              # Carpeta para intro.mp4
├── descargas/           # Videos y audios descargados
└── node_modules/        # Dependencias instaladas
```

## 🔧 Dependencias

- **yt-dlp-exec**: Motor para descargar videos de YouTube
- **inquirer**: Interfaz interactiva en línea de comandos
- **cli-progress**: Barra de progreso visual
- **ffmpeg**: Procesamiento de video y audio (instalado externamente)

## ⚠️ Solución de Problemas

### "This video is not available"
- El video puede estar restringido por región, edad o privacidad
- Intenta exportar cookies de tu navegador (ver [COOKIES_HELP.md](COOKIES_HELP.md))
- Verifica que el enlace sea válido y el video esté público

### Error de FFmpeg
- Asegúrate de tener FFmpeg instalado y en tu PATH
- Verifica con: `ffmpeg -version`

### Video sin audio o audio sin video
- El programa descarga automáticamente la mejor calidad con audio y video
- Si un video no tiene audio, solo descargará el video

### Problemas con el reemplazo de intro
- Verifica que `assets/intro.mp4` exista
- Asegúrate de que el archivo de intro sea un video válido
- El proceso puede tardar algunos minutos debido a la recodificación

## 📝 Notas Importantes

- Los videos descargados son para uso personal solamente
- Respeta los derechos de autor y términos de servicio de YouTube
- Las cookies contienen información sensible - nunca las compartas
- El archivo `cookies.txt` está en `.gitignore` por seguridad

## 📄 Licencia

ISC

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

---

**Nota**: Este proyecto usa yt-dlp, que se actualiza frecuentemente para mantener compatibilidad con YouTube. Si encuentras problemas, asegúrate de tener la versión más reciente.
