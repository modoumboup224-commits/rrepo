@echo off
echo ========================================
echo 🚀 Déploiement GreenCard - Version Finale
echo ========================================
echo.

REM Configuration FTP (à mettre à jour avec votre nouveau mot de passe)
set HOST=eq8a66.ftp.infomaniak.com
set USERNAME=eq8a66_temp_1
set /p PASSWORD=Wxcvbnm09@
set DEPLOY_DIR=deploy-ready

echo.
echo 📁 Vérification du dossier de déploiement...
if not exist "%DEPLOY_DIR%" (
    echo ❌ Le dossier %DEPLOY_DIR% n'existe pas
    echo 📋 Exécuter prepare-deployment.js d'abord
    pause
    exit /b
)

echo.
echo 📤 Préparation du transfert FTP...
echo option batch abort > deploy-final-script.txt
echo option confirm off >> deploy-final-script.txt
echo open ftp://%USERNAME%:%PASSWORD%@%HOST% >> deploy-final-script.txt
echo cd /www >> deploy-final-script.txt
echo lcd "%CD%\%DEPLOY_DIR%" >> deploy-final-script.txt
echo synchronize remote -delete >> deploy-final-script.txt
echo exit >> deploy-final-script.txt

echo.
echo 🚀 Transfert en cours vers le serveur...
if exist "winscp\WinSCP.exe" (
    winscp\WinSCP.exe /script=deploy-final-script.txt
    
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors du transfert - Vérifiez le mot de passe
    ) else (
        echo ✅ Transfert terminé avec succès!
        echo 🌐 Votre site est maintenant accessible
        echo 📍 URL : https://greencart.sbs
    )
) else (
    echo ❌ WinSCP non trouvé
    echo 📥 Vérifiez que WinSCP est dans le dossier 'winscp'
)

del deploy-final-script.txt
pause
