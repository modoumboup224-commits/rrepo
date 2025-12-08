@echo off
echo ========================================
echo 🧪 Test de connexion FTP - GreenCard
echo ========================================
echo.

REM Configuration FTP - À mettre à jour avec les bons credentials
set HOST=eq8a66.ftp.infomaniak.com
set USERNAME=eq8a66_temp_1
set PASSWORD=Wxcvbnm09@

echo 🔍 Test de connexion avec les credentials actuels...
echo Host: %HOST%
echo Username: %USERNAME%

REM Créer un script de test FTP
echo option batch abort > test-connection.txt
echo option confirm off >> test-connection.txt
echo open ftp://%USERNAME%:%PASSWORD%@%HOST% >> test-connection.txt
echo pwd >> test-connection.txt
echo ls >> test-connection.txt
echo exit >> test-connection.txt

echo.
echo 🚀 Lancement du test de connexion...
if exist "winscp\WinSCP.exe" (
    winscp\WinSCP.exe /script=test-connection.txt /log=test-connection.log
    if %errorlevel% neq 0 (
        echo ❌ Échec de connexion - Vérifiez vos credentials
        echo 📋 Vérifiez le fichier test-connection.log pour plus de détails
    ) else (
        echo ✅ Connexion réussie!
    )
) else (
    echo ❌ WinSCP non trouvé
)

del test-connection.txt
pause
