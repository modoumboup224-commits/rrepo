@echo off
echo ========================================
echo 🚀 Déploiement automatique GreenCard
echo ========================================
echo.

REM Vérifier si WinSCP est installé
where winscp >nul 2>n1
if %errorlevel% neq 0 (
    echo ❌ WinSCP n'est pas installé. Téléchargement en cours...
    powershell -Command "Invoke-WebRequest -Uri 'https://winscp.net/download/WinSCP-5.21.8-Portable.zip' -OutFile 'winscp.zip'"
    powershell -Command "Expand-Archive -Path 'winscp.zip' -DestinationPath 'winscp'"
    set WINSCP=winscp\WinSCP.exe
) else (
    set WINSCP=winscp
)

REM Demander les identifiants
set /p USERNAME=" eq8a66.ftp.infomaniak.com "
set /p PASSWORD="eq8a66_temp_1 "
set /p DOMAIN="greencart.sbs "

REM Créer le script WinSCP
echo option batch abort > deploy-script.txt
echo option confirm off >> deploy-script.txt
echo open ftp://%USERNAME%:%PASSWORD%@%DOMAIN% >> deploy-script.txt
echo cd /www >> deploy-script.txt
echo lcd "C:\Users\FX706\Desktop\GreenCard\deploy-ready" >> deploy-script.txt
echo synchronize remote -delete >> deploy-script.txt
echo exit >> deploy-script.txt

REM Exécuter le transfert
echo.
echo 📤 Transfert en cours vers %DOMAIN%...
%WINSCP% /script=deploy-script.txt

echo.
echo ✅ Transfert terminé !
echo 🌐 Vérifiez votre site : https://%DOMAIN%
pause
