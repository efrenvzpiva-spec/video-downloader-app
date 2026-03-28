#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Backend para Video Downloader
Descarga videos de YouTube, Instagram, Facebook y X (Twitter)
USA: yt-dlp (fork mejorado de youtube-dl)
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import yt_dlp
import os
import tempfile
from pathlib import Path
import logging

app = Flask(__name__)
CORS(app)  # Habilitar CORS para peticiones del frontend

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directorio temporal para descargas
TEMP_DIR = tempfile.gettempdir()

def get_ydl_opts(quality='best', output_path=None):
    """Configuración de yt-dlp según la calidad solicitada"""
    
    base_opts = {
        'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),
        'quiet': False,
        'no_warnings': False,
    }
    
    if quality == 'audio':
        # Solo audio (MP3)
        base_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        })
    elif quality == 'best':
        base_opts['format'] = 'bestvideo+bestaudio/best'
    elif quality == '1080p':
        base_opts['format'] = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]'
    elif quality == '720p':
        base_opts['format'] = 'bestvideo[height<=720]+bestaudio/best[height<=720]'
    elif quality == '480p':
        base_opts['format'] = 'bestvideo[height<=480]+bestaudio/best[height<=480]'
    elif quality == '360p':
        base_opts['format'] = 'bestvideo[height<=360]+bestaudio/best[height<=360]'
    
    return base_opts

@app.route('/', methods=['GET'])
def home():
    """Endpoint de bienvenida"""
    return jsonify({
        'message': 'Video Downloader API',
        'version': '1.0',
        'supported_platforms': ['YouTube', 'Instagram', 'Facebook', 'X (Twitter)'],
        'endpoints': {
            '/download': 'POST - Descargar video',
            '/info': 'POST - Obtener información del video'
        }
    })

@app.route('/download', methods=['POST'])
def download_video():
    """Endpoint principal para descargar videos"""
    try:
        data = request.get_json()
        video_url = data.get('url')
        quality = data.get('quality', 'best')
        
        if not video_url:
            return jsonify({'error': 'URL no proporcionada'}), 400
        
        logger.info(f'Descargando: {video_url} en calidad {quality}')
        
        # Crear directorio temporal único para esta descarga
        download_dir = tempfile.mkdtemp(dir=TEMP_DIR)
        
        # Configurar opciones de descarga
        ydl_opts = get_ydl_opts(quality, download_dir)
        
        # Descargar el video
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Si es audio, cambiar extensión a mp3
            if quality == 'audio':
                filename = Path(filename).with_suffix('.mp3')
        
        # Verificar que el archivo existe
        if not os.path.exists(filename):
            return jsonify({'error': 'Error al descargar el video'}), 500
        
        # Enviar el archivo al cliente
        return send_file(
            filename,
            as_attachment=True,
            download_name=os.path.basename(filename),
            mimetype='application/octet-stream'
        )
        
    except Exception as e:
        logger.error(f'Error al descargar: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/info', methods=['POST'])
def get_video_info():
    """Obtener información del video sin descargarlo"""
    try:
        data = request.get_json()
        video_url = data.get('url')
        
        if not video_url:
            return jsonify({'error': 'URL no proporcionada'}), 400
        
        ydl_opts = {'quiet': True}
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            return jsonify({
                'title': info.get('title'),
                'duration': info.get('duration'),
                'thumbnail': info.get('thumbnail'),
                'uploader': info.get('uploader'),
                'description': info.get('description', '')[:200],
                'formats_available': len(info.get('formats', []))
            })
    
    except Exception as e:
        logger.error(f'Error al obtener info: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("✅ Servidor iniciado en http://localhost:5000")
    print("📥 Soporta: YouTube, Instagram, Facebook, X (Twitter)")
    app.run(debug=True, host='0.0.0.0', port=5000)
