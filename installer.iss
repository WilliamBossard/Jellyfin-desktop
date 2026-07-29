[Setup]
AppName=Jellyfin Desktop
AppVersion=1.1.1
DefaultDirName={autopf}\Jellyfin Desktop
DefaultGroupName=Jellyfin Desktop
UninstallDisplayIcon={app}\jellyfin-desktop.exe
Compression=lzma2
SolidCompression=yes
OutputDir=build
OutputBaseFilename=Jellyfin-Desktop-Setup
ArchitecturesInstallIn64BitMode=x64

[Tasks]
Name: "desktopicon"; Description: "Créer un raccourci sur le bureau"; GroupDescription: "Raccourcis additionnels :"

[Files]
Source: "build\install\*"; Excludes: "*.pdb,*.log,mpv-build\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Jellyfin Desktop"; Filename: "{app}\jellyfin-desktop.exe"
Name: "{autodesktop}\Jellyfin Desktop"; Filename: "{app}\jellyfin-desktop.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\jellyfin-desktop.exe"; Description: "Lancer Jellyfin Desktop"; Flags: nowait postinstall skipifsilent

