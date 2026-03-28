// Frontend JavaScript para Video Downloader - VERSIÓN 100% WEB
// No requiere backend, funciona directo desde el navegador

const form = document.getElementById('downloadForm');
const downloadBtn = document.getElementById('downloadBtn');
const statusDiv = document.getElementById('status');
const videoUrlInput = document.getElementById('videoUrl');
const qualitySelect = document.getElementById('quality');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const videoUrl = videoUrlInput.value.trim();
    const quality = qualitySelect.value;
    
    if (!videoUrl) {
        showStatus('Por favor ingresa una URL válida', 'error');
        return;
    }
    
    // Validar que sea una URL de plataforma soportada
    if (!isValidUrl(videoUrl)) {
        showStatus('URL no válida. Soportamos YouTube, Instagram, Facebook y X (Twitter)', 'error');
        return;
    }
    
    // Deshabilitar botón y mostrar loading
    downloadBtn.disabled = true;
    downloadBtn.textContent = '⏳ Procesando...';
    showStatus('Preparando descarga... Por favor espera', 'loading');
    
    try {
        // Detectar plataforma y redirigir a servicio apropiado
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            await downloadYouTube(videoUrl, quality);
        } else if (videoUrl.includes('instagram.com')) {
            await downloadInstagram(videoUrl);
        } else if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
            await downloadFacebook(videoUrl);
        } else if (videoUrl.includes('twitter.com') || videoUrl.includes('x.com')) {
            await downloadTwitter(videoUrl);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Error al procesar el video. Por favor intenta de nuevo.', 'error');
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '⬇️ Descargar Video';
    }
});

async function downloadYouTube(url, quality) {
    // Crear enlace con servicio de descarga
    const videoId = extractYouTubeId(url);
    if (!videoId) {
        showStatus('❌ No se pudo extraer el ID del video', 'error');
        return;
    }
    
    // Usar servicio público para descargar
    const downloadUrl = `https://www.y2mate.com/youtube/${videoId}`;
    showStatus('✅ Redirigiendo a la página de descarga...', 'success');
    window.open(downloadUrl, '_blank');
}

async function downloadInstagram(url) {
    const downloadUrl = `https://snapinsta.app/`;
    showStatus('📸 Abriendo descargador de Instagram... Pega tu URL allí', 'success');
    window.open(downloadUrl, '_blank');
    // Copiar URL al portapapeles
    try {
        await navigator.clipboard.writeText(url);
        setTimeout(() => {
            showStatus('✅ URL copiada al portapapeles! Pégala en la página que se abrió', 'success');
        }, 1000);
    } catch (err) {
        console.log('No se pudo copiar al portapapeles');
    }
}

async function downloadFacebook(url) {
    const downloadUrl = `https://fdown.net/`;
    showStatus('👥 Abriendo descargador de Facebook... Pega tu URL allí', 'success');
    window.open(downloadUrl, '_blank');
    try {
        await navigator.clipboard.writeText(url);
        setTimeout(() => {
            showStatus('✅ URL copiada! Pégala en la página que se abrió', 'success');
        }, 1000);
    } catch (err) {
        console.log('No se pudo copiar al portapapeles');
    }
}

async function downloadTwitter(url) {
    const downloadUrl = `https://twittervideodownloader.com/`;
    showStatus('🐦 Abriendo descargador de X/Twitter... Pega tu URL allí', 'success');
    window.open(downloadUrl, '_blank');
    try {
        await navigator.clipboard.writeText(url);
        setTimeout(() => {
            showStatus('✅ URL copiada! Pégala en la página que se abrió', 'success');
        }, 1000);
    } catch (err) {
        console.log('No se pudo copiar al portapapeles');
    }
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function isValidUrl(url) {
    const patterns = [
        /youtube\.com\/watch\?v=/i,
        /youtu\.be\//i,
        /instagram\.com\/(p|reel|tv)\//i,
        /facebook\.com\/.+\/videos\//i,
        /fb\.watch\//i,
        /twitter\.com\/.+\/status\//i,
        /x\.com\/.+\/status\//i
    ];
    
    return patterns.some(pattern => pattern.test(url));
}

function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 8000);
    }
}

// Detectar pegar URL
videoUrlInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        const url = videoUrlInput.value;
        if (isValidUrl(url)) {
            showStatus('✓ URL válida detectada. Haz clic en Descargar!', 'success');
        }
    }, 100);
});
