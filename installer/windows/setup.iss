#define APP_NAME "OmniBazaar"
#define APP_VERSION GetFileVersion("..\..\release\win-unpacked\Omnibazaar.exe")
#define APP_PUBLISHER "OmniBazaar, Inc."
#define APP_URL "http://omnibazaar.com"
#define APPDATA_DIR "OmniBazaar"

[Setup]
AppId={{D82F064D-17E9-4203-8018-90C0DBDED675}
AppName={#APP_NAME}
AppVersion={#APP_VERSION}
;AppVerName={#APP_NAME} {#APP_VERSION}
AppPublisher={#APP_PUBLISHER}
AppPublisherURL={#APP_URL}
AppSupportURL={#APP_URL}
AppUpdatesURL={#APP_URL}
AppCopyright=© {#GetDateTimeString('yyyy', '', '')} {#APP_PUBLISHER}
DefaultDirName={pf}\{#APP_NAME}
DefaultGroupName={#APP_NAME}
OutputBaseFilename={#APP_NAME}_setup_{#APP_VERSION}
SetupIconFile=icon.ico  
UninstallDisplayIcon={uninstallexe}
Compression=lzma/Ultra
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
ArchitecturesAllowed=x64
SetupLogging=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Dirs]
Name: "{userappdata}\{#APPDATA_DIR}"

[Files]
Source: "..\..\release\win-unpacked\*"; DestDir: {app}; Flags: ignoreversion recursesubdirs
Source: "..\..\app\ob2\windows\ob2.exe"; DestDir: {localappdata}\{#APPDATA_DIR}; Flags: ignoreversion
Source: ".\witness_node\*"; DestDir: {localappdata}\{#APPDATA_DIR}\witness_node; Flags: ignoreversion
Source: ".\witness_node\witness_node_data_dir\*"; DestDir: {localappdata}\{#APPDATA_DIR}\witness_node\witness_node_data_dir; Flags: ignoreversion onlyifdoesntexist
Source: ".\vc_redist.x64.exe"; DestDir: {app}; Flags: ignoreversion 
Source: ".\icon.ico"; DestDir: {app}; Flags: ignoreversion 

[UninstallRun]
Filename: "{cmd}"; Parameters: "/C taskkill /im Omnibazaar.exe /f /t 1> NUL 2> NUL && timeout 5 > NUL"

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
Type: filesandordirs; Name: "{localappdata}\{#APPDATA_DIR}"
Type: filesandordirs; Name: "{userappdata}\{#APPDATA_DIR}"

[Icons]
Name: {userdesktop}\{#APP_NAME}; Filename: {app}\Omnibazaar.exe; WorkingDir: {app};IconFilename:"{app}\icon.ico"
Name: {group}\{#APP_NAME}; Filename: {app}\Omnibazaar.exe; WorkingDir: {app};IconFilename:"{app}\icon.ico"
Name: "{group}\{cm:UninstallProgram,{#APP_NAME}}"; Filename: "{uninstallexe}"; IconFilename: "{app}\icon.ico"

[Run]
Filename: "{app}\vc_redist.x64.exe"; Parameters: "/q";
Filename: "{app}\Omnibazaar.exe"; Description: Run Application; Flags: postinstall nowait skipifsilent

[Code]
var
    wasWitnessNodeRunning : boolean;

procedure CurStepChanged(CurStep: TSetupStep);
var
    appDataPath, filename : string;
    resultCode : integer;
begin
    if CurStep = ssInstall then
    begin
        wasWitnessNodeRunning := False;
        if Exec(ExpandConstant('{cmd}'), '/C tasklist | findstr "witness_node.exe"', '', SW_HIDE, ewWaitUntilTerminated, resultCode) then
        begin
            if resultCode = 0 then
            begin
                wasWitnessNodeRunning := True
                if not Exec(ExpandConstant('{cmd}'), '/C taskkill /IM witness_node.exe /F /T', '', SW_HIDE, ewWaitUntilTerminated, resultCode) then
                begin
                    MsgBox('Unable to close witness_node process. Error code: ' + IntToStr(resultCode), mbError, MB_OK);
                end
            end
        end
        else
        begin
            MsgBox('Unable to find witness_node process. Error code: ' + IntToStr(resultCode), mbError, MB_OK);
        end
    end
    else if CurStep = ssPostInstall then
    begin    
        // Get value of {srcexe} constant (path to installer file)
        filename := ExtractFileName(ExpandConstant('{srcexe}'));    
        appDataPath := ExpandConstant('{userappdata}');

        SaveStringToFile(appDataPath + '\{#APPDATA_DIR}\omnibazaar.set', 'referrer='+filename, False);

        if wasWitnessNodeRunning then
        begin
            if not Exec(ExpandConstant('{localappdata}\{#APPDATA_DIR}\witness_node\witness_node.exe'), '', '', SW_HIDE, ewNoWait, resultCode) then
            begin
                MsgBox('Unable to restart witness_node process. Error code: ' + IntToStr(resultCode), mbError, MB_OK);
            end
        end
    end;
end;