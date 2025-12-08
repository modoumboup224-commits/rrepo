@echo off
echo ========================================
echo 🚀 Déploiement GreenCard - Version Corrigée
echo ========================================
echo.

REM Configuration FTP correcte
set HOST=eq8a66.ftp.infomaniak.com
set USERNAME=eq8a66_temp_1
set PASSWORD=Wxcvbnm09@
set DEPLOY_DIR=deploy-ready

echo 📁 Vérification du dossier de déploiement...
if not exist "%DEPLOY_DIR%" (
    echo ❌ Le dossier %DEPLOY_DIR% n'existe pas
    echo 📋 Exécuter prepare-deployment.js d'abord
    pause
    exit /b
)

echo.
echo 📤 Préparation du transfert FTP...
echo option batch abort > deploy-script-fixed.txt
echo option confirm off >> deploy-script-fixed.txt
echo open ftp://%USERNAME%:%PASSWORD%@%HOST% >> deploy-script-fixed.txt
echo cd /www >> deploy-script-fixed.txt
echo lcd "%CD%\%DEPLOY_DIR%" >> deploy-script-fixed.txt
echo synchronize remote -delete >> deploy-script-fixed.txt
echo exit >> deploy-script-fixed.txt

echo.
echo 🚀 Transfert en cours vers le serveur...
if exist "winscp\WinSCP.exe" (
    winscp\WinSCP.exe /script=deploy-script-fixed.txt
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors du transfert
    ) else (
        echo ✅ Transfert terminé avec succès!
        echo 🌐 Votre site devrait être accessible
    )
) else (
    echo ❌ WinSCP non trouvé
    echo 📥 Téléchargez WinSCP portable et placez-le dans le dossier 'winscp'
)

del deploy-script-fixed.txt
pause
