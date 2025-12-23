const ytDlp = require('yt-dlp-exec');
const inquirer = require('inquirer');
const cliProgress = require('cli-progress');
const fs = require('fs');

const progressBar = new cliProgress.SingleBar({
    format: 'Descargando |{bar}| {percentage}% | {eta}s | {speed}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

async function descargar() {
  // Crear carpeta de descargas sin no existe
  if (!fs.existsSync('./descargas')) {
    fs.mkdirSync('./descargas');
  }

  const respuestas = await inquirer.prompt([
    { type: 'input', name: 'url', message: 'Enlace de YouTube:' },
    {
      type: 'list',
      name: 'tipo',
      message: '¿Qué descargar?',
      choices: ['Video (Máxima Calidad)', 'Audio (MP3)']
    }
  ]);

  const esAudio = respuestas.tipo === 'Audio (MP3)';

  // Usamos spawn para tener control total del proceso y el progreso
  const subprocess = ytDlp.exec(respuestas.url, {
    format: esAudio ? 'bestaudio' : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    output: `./descargas/%(title)s.${esAudio ? 'mp3' : 'mp4'}`,
    extractAudio: esAudio ? true : undefined,
    audioFormat: esAudio ? 'mp3' : undefined,
    newline: true, // Importante para leer el progreso
    mergeOutputFormat: 'mp4'
  });

  console.log('\n🚀 Iniciando...');
  progressBar.start(100, 0, { speed: 'Calculando...', eta: 'N/A' });

  // Escuchamos la salida de yt-dlp para capturar el porcentaje
  subprocess.stdout.on('data', (data) => {
    const linea = data.toString();
    // Buscamos el patrón del porcentaje en la terminal (ej: 45.2%)
    const match = linea.match(/(\d+\.\d+)%/);
    if (match) {
      const porcentaje = parseFloat(match[1]);
      progressBar.update(porcentaje);
    }
  });

  try {
    await subprocess;
    progressBar.update(100);
    progressBar.stop();
    console.log('✅ Descarga terminada.');
  } catch (err) {
    progressBar.stop();
    console.error('❌ Error:', err);
  }
}

descargar();