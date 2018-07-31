setlocal & cd /d %~dp0

set PATH=%PATH%;C:\Program Files (x86)\Inno Setup 5

iscc setup.iss

echo Signing installers...
set /p PASSWORD=<password.txt
signtool sign /f certificate.pfx /p "%PASSWORD%" /t http://timestamp.comodoca.com/authenticode Output\OmniBazaar*.exe

pause