[Setup]
AppName=Jellyfin Desktop
AppVersion=1.0.0
DefaultDirName={autopf}\Jellyfin Desktop
DefaultGroupName=Jellyfin Desktop
UninstallDisplayIcon={app}\jellium-desktop.exe
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
Name: "{group}\Jellyfin Desktop"; Filename: "{app}\jellium-desktop.exe"
Name: "{autodesktop}\Jellyfin Desktop"; Filename: "{app}\jellium-desktop.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\jellium-desktop.exe"; Description: "Lancer Jellyfin Desktop"; Flags: nowait postinstall skipifsilent

