// Video Downloader - VERSIÓN 100% WEB v2
// Usa los mejores servicios disponibles para cada plataforma

const form = document.getElementById('downloadForm');
const downloadBtn = document.getElementById('downloadBtn');
const statusDiv = document.getElementById('status');
const videoUrlInput = document.getElementById('videoUrl');
const qualitySelect = document.getElementById('quality');

// Servicios de descarga por plataforma (los más confiables)
const SERVICES = {
    youtube: [
        'https://cobalt.tools/',
        'https://yt1s.com/en619',
        'https://loader.to/'
    ],
    instagram: [
        'https://snapinsta.app/',
        'https://instafinsta.com/',
        'https://igdownloader.app/'
    ],
    facebook: [
        'https://fdown.net/',
        'https://fbdown.net/',
        'https://getfvid.com/'
    ],
    twitter: [
        'https://ssstwitter.com/',
        'https://twittervideodownloader.com/',
        'https://twitsave.com/'
    ]
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const videoUrl = videoUrlInput.value.trim();
    
    if (!videoUrl) {
        showStatus('Por favor ingresa una URL válida', 'error');
        return;
    }
    
    if (!isValidUrl(videoUrl)) {
        showStatus('❌ URL no válida. Soportamos YouTube, Instagram, Facebook y X (Twitter)', 'error');
        return;
    }
    
    downloadBtn.disabled = true;
    downloadBtn.textContent = '⏳ Procesando...';
    
    // Detectar plataforma
    let platform = detectPlatform(videoUrl);
    await processDownload(videoUrl, platform);
    
    downloadBtn.disabled = false;
    downloadBtn.textContent = '⬇️ Descargar Video';
});

function detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    return null;
}

async function processDownload(url, platform) {
    // Copiar URL al portapapeles automáticamente
    let copied = false;
    try {
        await navigator.clipboard.writeText(url);
        copied = true;
    } catch (err) {
        console.log('Portapapeles no disponible');
    }
    
    const service = SERVICES[platform][0];
    const platformNames = {
        youtube: 'YouTube',
        instagram: 'Instagram', 
        facebook: 'Facebook',
        twitter: 'X (Twitter)'
    };
    
    const msg = copied 
        ? `✅ URL copiada al portapapeles. Abriendo descargador de ${platformNames[platform]}... Pégala allí con Ctrl+V`
        : `📥 Abriendo descargador de ${platformNames[platform]}... Pega tu URL allí`;
    
    showStatus(msg, 'success');
    
    setTimeout(() => {
        window.open(service, '_blank');
    }, 500);
    
    // Si es YouTube, mostrar también el ID para referencia
    if (platform === 'youtube') {
        const videoId = extractYouTubeId(url);
        if (videoId) {
            setTimeout(() => {
                showStatus(`🎬 YouTube ID: ${videoId} | Si no funciona el primer sitio, intenta: https://yt1s.com`, 'success');
            }, 4000);
        }
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
        /youtube\.com\/shorts\//i,
        /instagram\.com\/(p|reel|tv)\//i,
        /facebook\.com/i,
        /fb\.watch\//i,
        /twitter\.com\//i,
        /x\.com\//i
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
        }, 10000);
    }
}

// Auto-detectar al pegar URL
videoUrlInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        const url = videoUrlInput.value.trim();
        const platform = detectPlatform(url);
        if (platform) {
            const icons = { youtube: '🎬', instagram: '📸', facebook: '👥', twitter: '🐦' };
            showStatus(`${icons[platform]} ${platform.charAt(0).toUpperCase() + platform.slice(1)} detectado. ¡Haz clic en Descargar!`, 'success');
        }
    }, 150);
});
