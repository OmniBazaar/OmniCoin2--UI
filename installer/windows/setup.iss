#define APP_NAME "OmniBazaar 2" 
#define APP_VERSION GetFileVersion("..\..\release\win-unpacked\Omnibazaar.exe")
#define APP_PUBLISHER "OmniBazaar, Inc."
#define APP_URL "http://omnibazaar.com"
#define APPDATA_DIR "OmniBazaar 2"

[Setup]
AppId={{D82F064D-17E9-4203-8018-90C0DBDED675}
AppName={#APP_NAME}
AppVersion={#APP_VERSION}
;AppVerName={#APP_NAME} {#APP_VERSION}
AppPublisher={#APP_PUBLISHER}
AppPublisherURL={#APP_URL}
AppSupportURL={#APP_URL}
AppUpdatesURL={#APP_URL}
AppCopyright=� {#GetDateTimeString('yyyy', '', '')} {#APP_PUBLISHER}
DefaultDirName={pf}\{#APP_NAME}
DefaultGroupName={#APP_NAME}
AllowNoIcons=yes
OutputBaseFilename={#APP_NAME}_setup_{#APP_VERSION}
SetupIconFile=icon.ico
Compression=lzma/Ultra
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
ArchitecturesAllowed=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "..\..\release\win-unpacked\*"; DestDir: {app}; Flags: ignoreversion recursesubdirs
Source: "..\..\app\ob2\windows\ob2.exe"; DestDir: {localappdata}\{#APPDATA_DIR}; Flags: ignoreversion

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
Type: filesandordirs; Name: "{localappdata}\{#APPDATA_DIR}"

[Icons]
Name: {userdesktop}\{#APP_NAME}; Filename: {app}\Omnibazaar.exe; WorkingDir: {app}
Name: {group}\{#APP_NAME}; Filename: {app}\Omnibazaar.exe; WorkingDir: {app}

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
var
    appDataPath, filepath : string;
    tmpstring : AnsiString;
    oldreferrpos : integer;
begin
    if CurStep = ssPostInstall then
        begin    
        // Get value of {srcexe} constant (path to installer file)
        filepath := ExpandConstant('{srcexe}');    
        appDataPath := ExpandConstant('{userappdata}');    
        // Load string from omnibazaar.set
        LoadStringFromFile(appDataPath + '\{#APPDATA_DIR}\omnibazaar.set', tmpstring);    
        // Double check if referrer exists
        oldreferrpos := Pos('referrer', tmpstring);    
        // If referrer not found then    
        if oldreferrpos = 0 then
            begin
                SaveStringToFile(appDataPath + '\{#APPDATA_DIR}\omnibazaar.set', #13#10 + 'referrer='+ filepath + #13#10, True);
            end;    
    end;
end;