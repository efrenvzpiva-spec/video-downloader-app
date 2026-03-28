// Frontend JavaScript para Video Downloader
// Este código se conecta al backend Python

const form = document.getElementById('downloadForm');
const downloadBtn = document.getElementById('downloadBtn');
const statusDiv = document.getElementById('status');
const videoUrlInput = document.getElementById('videoUrl');
const qualitySelect = document.getElementById('quality');

// URL del backend (cambiar según donde esté hosteado)
const API_URL = 'http://localhost:5000';

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
    showStatus('Descargando video... Por favor espera', 'loading');
    
    try {
        const response = await fetch(`${API_URL}/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: videoUrl,
                quality: quality
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al descargar el video');
        }
        
        // Crear blob y descargar archivo
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        
        // Obtener nombre del archivo del header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'video.mp4';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
        showStatus('✅ Video descargado exitosamente!', 'success');
        videoUrlInput.value = '';
        
    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Error al descargar el video. Por favor intenta de nuevo.', 'error');
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '⬇️ Descargar Video';
    }
});

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
        }, 5000);
    }
}

// Detectar pegar URL
videoUrlInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        const url = videoUrlInput.value;
        if (isValidUrl(url)) {
            showStatus('✓ URL válida detectada', 'success');
        }
    }, 100);
});
