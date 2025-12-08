@echo off
echo ========================================
echo 🚀 Déploiement GreenCard - Version Finale Corrigée
echo ========================================
echo.

REM Configuration FTP avec les vrais credentials
set HOST=eq8a66.ftp.infomaniak.com
set USERNAME=eq8a66_system
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
echo 📤 Création du script de transfert FTP...
echo option batch abort > deploy-script-final.txt
echo option confirm off >> deploy-script-final.txt
echo open ftp://%USERNAME%:%PASSWORD%@%HOST% >> deploy-script-final.txt
echo cd /www >> deploy-script-final.txt
echo lcd "%CD%\%DEPLOY_DIR%" >> deploy-script-final.txt
echo synchronize remote -delete >> deploy-script-final.txt
echo exit >> deploy-script-final.txt

echo.
echo 🚀 Lancement du transfert FTP...
if exist "winscp\WinSCP.exe" (
    winscp\WinSCP.exe /script=deploy-script-final.txt /log=deploy-final.log
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors du transfert FTP
        echo 📋 Vérifiez les logs dans deploy-final.log
    ) else (
        echo ✅ Transfert FTP terminé avec succès!
        echo 🌐 Votre site est maintenant accessible à l'adresse :
        echo http://greencart.sbs
        echo.
        echo 📋 Note : Il peut prendre quelques minutes pour que les changements soient visibles
    )
) else (
    echo ❌ WinSCP non trouvé
    echo 📥 Assurez-vous que WinSCP est dans le dossier 'winscp'
)

del deploy-script-final.txt
pause
