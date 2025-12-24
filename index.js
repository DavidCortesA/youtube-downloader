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
    // Rutas absolutas para evitar errores de "No such file"
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
    
    // Forzamos el nombre del archivo temporal
    const tempFile = path.join(dirDescargas, 'video_base.mp4');
    const finalOutput = path.join(dirDescargas, `Resultado_${Date.now()}.mp4`);

    console.log('\n🚀 Iniciando descarga...');
    progressBar.start(100, 0);

    try {
        // Ejecución de yt-dlp
        await ytDlp(respuestas.url, {
            format: esAudio ? 'bestaudio' : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]',
            output: cambiarIntro ? tempFile : path.join(dirDescargas, '%(title)s.mp4'),
            mergeOutputFormat: 'mp4',
            newline: true,
        }, {
            // Callback para el progreso
            onData: (data) => {
                const match = data.toString().match(/(\d+\.\d+)%/);
                if (match) progressBar.update(parseFloat(match[1]));
            }
        });

        progressBar.update(100);
        progressBar.stop();

        if (cambiarIntro) {
            console.log('\n✂️ Procesando edición de intro (esto puede tardar unos segundos)...');
            
            const introNueva = path.join(dirAssets, 'intro.mp4');
            const videoSinIntro = path.join(dirDescargas, 'video_recortado.mp4');
            const listFile = path.join(dirDescargas, 'join.txt');

            if (!fs.existsSync(introNueva)) {
                throw new Error(`No se encontró la intro en: ${introNueva}`);
            }

            // 1. Cortar intro vieja
            // Usamos execSync para asegurarnos que termine antes de seguir
            execSync(`ffmpeg -y -i "${tempFile}" -ss ${respuestas.segundosIntroVieja} -c copy "${videoSinIntro}"`);

            // 2. Unir Intro Nueva + Video Cortado
            // Importante: FFmpeg necesita rutas relativas o específicas en el txt
            fs.writeFileSync(listFile, `file '${introNueva}'\nfile '${videoSinIntro}'`);
            
            execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${finalOutput}"`);

            // Limpieza
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            if (fs.existsSync(videoSinIntro)) fs.unlinkSync(videoSinIntro);
            if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
            
            console.log(`\n✅ ¡Éxito! Video final creado en:\n${finalOutput}\n`);
        } else {
            console.log('\n✅ Descarga completada correctamente.\n');
        }

    } catch (err) {
        progressBar.stop();
        console.error('\n❌ Error:', err.message);
    }
}

console.log('🎬 Descargador de YouTube\n');
iniciarApp();