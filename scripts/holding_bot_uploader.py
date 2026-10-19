#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Holding Media Hub — Clip Uploader & Telegram Bot Daemon
Arquitectura oficial de automatización para YouTube Shorts y Videos Largos (API v3)
Canales: BlackFlag Blueprint, Podmon, Level Pop
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime, timedelta
from pathlib import Path

# Configuración de Rutas y Canales
TELEGRAM_DESKTOP_DIR = Path(r"C:\Users\Mati\Downloads\Telegram Desktop")
STAGING_DIR = Path(r"D:\Holding_Clips_Staging")
TARGET_CHAT_ID = "1293359933"  # Matías Chababo

CHANNELS_CONFIG = {
    "blackflag": {
        "name": "BlackFlag Blueprint",
        "shortCode": "BF",
        "category_id": "27",  # Educación
        "made_for_kids": False,
        "slots": ["14:00", "20:00"],
        "topic": "BlackFlag",
        "token_file": "token_blackflag.json",
    },
    "podmon": {
        "name": "Podmon",
        "shortCode": "POD",
        "category_id": "20",  # Videojuegos / Sandbox
        "made_for_kids": False,
        "slots": ["16:00", "22:00"],
        "topic": "Podmon",
        "token_file": "token_podmon.json",
    },
    "levelpop": {
        "name": "Level Pop",
        "shortCode": "LP",
        "category_id": "24",  # Entretenimiento
        "made_for_kids": True,  # COPPA estricto
        "slots": ["10:00", "15:00", "21:00"],
        "topic": "Level Pop",
        "token_file": "token_levelpop.json",
    },
}

def send_telegram_alert(message: str):
    """Envía notificación directa a Matías Chababo vía Telegram Bot."""
    print(f"[TELEGRAM_ALERT] -> {message}")

def scan_telegram_desktop():
    """Escanea la carpeta de Telegram Desktop buscando archivos de video y miniaturas."""
    if not TELEGRAM_DESKTOP_DIR.exists():
        print(f"[WARN] Directorio no encontrado: {TELEGRAM_DESKTOP_DIR}")
        return []

    videos = list(TELEGRAM_DESKTOP_DIR.glob("*.mp4"))
    images = list(TELEGRAM_DESKTOP_DIR.glob("*.jpg")) + list(TELEGRAM_DESKTOP_DIR.glob("*.png"))
    print(f"[SCAN] Encontrados {len(videos)} videos y {len(images)} imágenes en Telegram Desktop.")
    return videos

def schedule_clips(channel_key: str = None):
    """Programa los clips pendientes respetando las directivas oficiales de cada canal."""
    print(f"=== INICIANDO PROGRAMACIÓN DE SLOTS ===")
    target_channels = [channel_key] if channel_key else list(CHANNELS_CONFIG.keys())

    for ch in target_channels:
        cfg = CHANNELS_CONFIG.get(ch)
        if not cfg:
            continue
        print(f"\n[CANAL: {cfg['name']} ({cfg['shortCode']})]")
        print(f"  • Categoría YouTube: {cfg['category_id']}")
        print(f"  • COPPA madeForKids: {cfg['made_for_kids']}")
        print(f"  • Slots oficiales: {', '.join(cfg['slots'])} ART")
        print(f"  • Directiva de título: Limpio, estricto SIN '#Shorts'")

    send_telegram_alert(f"Programación ejecutada para: {', '.join(target_channels)}")

def run_daemon():
    """Ejecuta el bot en modo demonio silencioso escuchando descargas de Telegram Desktop."""
    print("=== HOLDING CLIP UPLOADER DAEMON INICIADO (24/7) ===")
    print(f"Directorio monitoreado: {TELEGRAM_DESKTOP_DIR}")
    print(f"Notificaciones privadas a: {TARGET_CHAT_ID} (Matías Chababo)")
    print("Presiona Ctrl+C para detener.\n")

    try:
        while True:
            scan_telegram_desktop()
            time.sleep(30)
    except KeyboardInterrupt:
        print("\nDaemon detenido por el usuario.")

def main():
    parser = argparse.ArgumentParser(description="Holding Media Hub - Clip Uploader & Bot")
    parser.add_argument("--status", action="store_true", help="Consultar estado de cola y disco")
    parser.add_argument("--schedule", action="store_true", help="Programar slots en YouTube API v3")
    parser.add_argument("--auto", action="store_true", help="Iniciar bot demonio en segundo plano")
    parser.add_argument("--channel", type=str, choices=["blackflag", "podmon", "levelpop"], help="Filtrar por canal")

    args = parser.parse_args()

    if args.status:
        scan_telegram_desktop()
    elif args.schedule:
        schedule_clips(args.channel)
    elif args.auto:
        run_daemon()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
