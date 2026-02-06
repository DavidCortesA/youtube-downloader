# Cómo Exportar Cookies de YouTube

Si encuentras el error "This video is not available", puede ser que el video requiera autenticación o esté restringido. Aquí está cómo solucionarlo:

## Opción 1: Extensión del Navegador (Recomendado)

### Para Chrome/Edge:
1. Instala la extensión **"Get cookies.txt LOCALLY"**
   - Chrome: https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc
   
2. Inicia sesión en YouTube con tu cuenta
3. Abre YouTube y reproduce cualquier video
4. Haz clic en el icono de la extensión
5. Haz clic en "Export" o "Exportar"
6. Guarda el archivo como `cookies.txt` en la carpeta del proyecto

### Para Firefox:
1. Instala el complemento **"cookies.txt"**
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/
   
2. Inicia sesión en YouTube
3. Ve a youtube.com
4. Haz clic en el icono del complemento
5. Exporta las cookies como `cookies.txt` en la carpeta del proyecto

## Opción 2: yt-dlp con Cookies del Navegador

Puedes intentar usar:
```bash
node_modules\yt-dlp-exec\bin\yt-dlp.exe --cookies-from-browser chrome <URL>
```

Reemplaza `chrome` con tu navegador: `firefox`, `edge`, `opera`, `brave`, etc.

## Ubicación del Archivo

El archivo `cookies.txt` debe estar en la misma carpeta que `index.js`:
```
youtube-downloader/
  ├── index.js
  ├── cookies.txt  ← Aquí
  ├── package.json
  └── ...
```

## Notas Importantes

- Las cookies expiran, así que si dejan de funcionar, necesitarás exportarlas de nuevo
- Nunca compartas tu archivo `cookies.txt` - contiene información de tu sesión
- El archivo `cookies.txt` ya está en `.gitignore` por seguridad

## Otros Problemas Comunes

1. **Video con restricción de región**: Las cookies pueden ayudar, pero algunos videos están bloqueados geográficamente
2. **Video con restricción de edad**: Necesitas cookies de una cuenta autenticada
3. **Video privado o eliminado**: No hay solución, el video no está disponible
