const ytDlp = require('yt-dlp-exec');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

const progressBar = new cliProgress.SingleBar({
    format: 'Descargando |{bar}| {percentage}% | ETA: {eta}s',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

async function iniciarApp() {
    const dirDescargas = path.resolve(__dirname, 'descargas');
    const dirAssets = path.resolve(__dirname, 'assets');
    
    if (!fs.existsSync(dirDescargas)) fs.mkdirSync(dirDescargas);
    if (!fs.existsSync(dirAssets)) fs.mkdirSync(dirAssets);

    const respuestas = await inquirer.prompt([
        { type: 'input', name: 'url', message: 'Enlace de YouTube:' },
        {
            type: 'list',
            name: 'accion',
            message: '¿Qué deseas hacer?',
            choices: [
                'Descarga Normal (Video MP4)',
                'Descarga + Cambiar Intro (Video)',
                'Solo Audio (MP3)'
            ]
        },
        {
            type: 'input',
            name: 'segundosIntroVieja',
            message: '¿Cuántos segundos dura la intro VIEJA?',
            when: (r) => r.accion === 'Descarga + Cambiar Intro (Video)',
            default: '10'
        }
    ]);

    const esAudio = respuestas.accion === 'Solo Audio (MP3)';
    const cambiarIntro = respuestas.accion === 'Descarga + Cambiar Intro (Video)';

    try {
        console.log('\n🔍 Obteniendo información del video...');
        // Obtenemos el título original
        const info = await ytDlp(respuestas.url, {
            dumpSingleJson: true,
            noWarnings: true,
        });
        
        // Limpiamos el título de caracteres no permitidos en nombres de archivos
        const tituloLimpio = info.title.replace(/[\\/:*?"<>|]/g, "");
        
        const tempFile = path.join(dirDescargas, 'video_base_temporal.mp4');
        const nombreFinal = `${tituloLimpio}.${esAudio ? 'mp3' : 'mp4'}`;
        const finalOutput = path.join(dirDescargas, nombreFinal);

        console.log(`\n🚀 Iniciando descarga: "${info.title}"`);
        progressBar.start(100, 0);

        await ytDlp(respuestas.url, {
            format: esAudio ? 'bestaudio' : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]',
            output: cambiarIntro ? tempFile : finalOutput,
            mergeOutputFormat: 'mp4',
            newline: true,
        }, {
            onData: (data) => {
                const match = data.toString().match(/(\d+\.\d+)%/);
                if (match) progressBar.update(parseFloat(match[1]));
            }
        });

        progressBar.update(100);
        progressBar.stop();

        if (cambiarIntro) {
            console.log('\n✂️ Uniendo con la nueva intro...');
            
            const introNueva = path.join(dirAssets, 'intro.mp4');
            const videoSinIntro = path.join(dirDescargas, 'video_recortado_temp.mp4');

            if (!fs.existsSync(introNueva)) {
                throw new Error(`No se encontró la intro en: ${introNueva}`);
            }

            // 1. Cortar intro vieja (aquí seguimos usando copy porque solo es un recorte)
            execSync(`ffmpeg -y -i "${tempFile}" -ss ${respuestas.segundosIntroVieja} -c copy "${videoSinIntro}"`);

            // 2. Unir con Filtro de Video (Re-codificación)
            // Esto escala ambos videos a 1080p y los pone a la misma tasa de frames
            console.log('🔄 Sincronizando formatos (esto puede tardar un poco más)...');
            
            const filtroComplex = `-filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1[v0];[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1[v1];[v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]"`;
            
            execSync(`ffmpeg -y -i "${introNueva}" -i "${videoSinIntro}" ${filtroComplex} -map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 22 -c:a aac "${finalOutput}"`);

            // Limpieza
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            if (fs.existsSync(videoSinIntro)) fs.unlinkSync(videoSinIntro);
            
            console.log(`\n✅ ¡Listo! Video fluido creado: ${nombreFinal}`);
        } else {
            console.log(`\n✅ ¡Listo! Archivo guardado: ${nombreFinal}`);
        }

    } catch (err) {
        if (progressBar.isActive) progressBar.stop();
        console.error('\n❌ Error:', err.message);
    }
}

console.log('🎬 Descargador de YouTube\n');
iniciarApp();