# 📥 Video Downloader App

**App completa para descargar videos de YouTube, Instagram, Facebook y X (Twitter)**

## ✨ Características

- ✅ **Soporte Multi-plataforma**: YouTube, Instagram, Facebook y X (Twitter)
- 🎬 **Múltiples calidades**: Desde 360p hasta 1080p (Full HD)
- 🎵 **Extracción de audio**: Descarga solo el audio en formato MP3
- 📱 **Diseño responsive**: Funciona en móviles, tablets y escritorio
- ⚡ **Rápido y eficiente**: Usa yt-dlp, la mejor herramienta de descarga

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** + **CSS3** con degradados modernos
- **JavaScript** (Vanilla) con fetch API
- Interfaz minimalista e intuitiva

### Backend
- **Python 3** con Flask
- **yt-dlp** (fork mejorado de youtube-dl)
- **Flask-CORS** para peticiones cross-origin

---

## 🚀 Instalación y Uso

### Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- FFmpeg (opcional, para extraer audio)

### Instalación paso a paso

#### 1. Clonar el repositorio

```bash
git clone https://github.com/efrenvzpiva-spec/video-downloader-app.git
cd video-downloader-app
```

#### 2. Instalar dependencias de Python

```bash
pip install -r requirements.txt
```

#### 3. Instalar FFmpeg (opcional pero recomendado)

**Windows:**
- Descargar desde [ffmpeg.org](https://ffmpeg.org/download.html)
- Agregar al PATH del sistema

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

#### 4. Iniciar el servidor backend

```bash
python server.py
```

El servidor se iniciará en: `http://localhost:5000`

#### 5. Abrir la aplicación

Abre el archivo `index.html` en tu navegador web, o usa un servidor local:

```bash
# Con Python
python -m http.server 8080

# Con Node.js (si tienes http-server instalado)
npx http-server
```

Luego abre: `http://localhost:8080`

---

## 💻 Uso de la Aplicación

1. **Copia el enlace** del video que deseas descargar
2. **Pega la URL** en el campo de entrada
3. **Selecciona la calidad** deseada
4. **Haz clic en "Descargar Video"**
5. Espera a que se procese y **el archivo se descargará automáticamente**

### Ejemplos de URLs soportadas:

```
# YouTube
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ

# Instagram
https://www.instagram.com/p/ABC123/
https://www.instagram.com/reel/XYZ789/

# Facebook
https://www.facebook.com/username/videos/123456789/
https://fb.watch/abc123/

# X (Twitter)
https://twitter.com/username/status/123456789
https://x.com/username/status/123456789
```

---

## 📚 API Endpoints

### GET `/`
Endpoint de bienvenida que retorna información de la API.

### POST `/download`
Descarga un video.

**Body (JSON):**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "720p"
}
```

**Calidades disponibles:**
- `best` - Mejor calidad disponible
- `1080p` - Full HD
- `720p` - HD
- `480p` - SD
- `360p` - Baja calidad
- `audio` - Solo audio (MP3)

### POST `/info`
Obtiene información del video sin descargarlo.

**Body (JSON):**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

---

## 📁 Estructura del Proyecto

```
video-downloader-app/
├── index.html          # Frontend de la aplicación
├── app.js              # Lógica JavaScript del frontend
├── server.py           # Backend API en Flask
├── requirements.txt    # Dependencias de Python
└── README.md           # Este archivo
```

---

## ⚠️ Nota Legal

Esta herramienta está diseñada para uso personal y educativo. 

**Importante:**
- Respeta los derechos de autor y las condiciones de uso de las plataformas
- No uses esta herramienta para descargar contenido protegido sin permiso
- El autor no se responsabiliza del mal uso de esta aplicación

---

## 👤 Autor

**Efren Vzpiva**
- GitHub: [@efrenvzpiva-spec](https://github.com/efrenvzpiva-spec)

---

## 📝 Licencia

MIT License - Libre para usar y modificar

---

## 🚀 Mejoras Futuras

- [ ] Soporte para descargas en lote
- [ ] Historial de descargas
- [ ] Previsualización de videos antes de descargar
- [ ] Integración con servicios de almacenamiento en la nube
- [ ] Versión Docker para deployment fácil

---

¡Disfruta descargando tus videos favoritos! 🎉
