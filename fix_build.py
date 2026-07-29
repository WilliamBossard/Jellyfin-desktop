import os
import re

path = 'installer.iss'
with open(path, 'rb') as f:
    c = f.read().decode('windows-1252', errors='replace')
    
c = c.replace('OutputBaseFilename=Jellyfin-Desktop-Setup', 'OutputBaseFilename=Jellyfin-Desktop-Setup-{#ARCH}')
c = c.replace('ArchitecturesInstallIn64BitMode=x64', 'ArchitecturesAllowed={#ARCH}\nArchitecturesInstallIn64BitMode={#ARCH}')
with open(path, 'wb') as f:
    f.write(c.encode('windows-1252'))

path = 'build_installer.ps1'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()
if 'param' not in c:
    c = 'param([string] = \"x64\")\n\n' + c
c = c.replace('& $ISCC \"installer.iss\"', '& $ISCC \"/DARCH=$Arch\" \"installer.iss\"')
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

path = '.github/workflows/build-windows.yml'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('powershell -ExecutionPolicy Bypass -File build_installer.ps1', 'powershell -ExecutionPolicy Bypass -File build_installer.ps1 -Arch %MATRIX_ARCH%')
c = c.replace('path: build/Jellyfin-Desktop-Setup.exe', 'path: build/Jellyfin-Desktop-Setup-${{ matrix.arch }}.exe')
c = c.replace('files: build/Jellyfin-Desktop-Setup.exe', 'files: build/Jellyfin-Desktop-Setup-${{ matrix.arch }}.exe')
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
