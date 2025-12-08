@echo off
echo ========================================
echo 🔍 Test de connexion FTP - GreenCard
echo ========================================
echo.

REM Test de connexion FTP simple
set HOST=eq8a66.ftp.infomaniak.com
set USERNAME=eq8a66_temp_1
set PASSWORD=Wxcvbnm09@

echo 🌐 Test de connexion vers : %HOST%
echo 👤 Utilisateur : %USERNAME%

echo.
echo 📡 Test avec WinSCP...
if exist "winscp\WinSCP.exe" (
    echo option batch abort > test-connection.txt
    echo option confirm off >> test-connection.txt
    echo open ftp://%USERNAME%:%PASSWORD%@%HOST% >> test-connection.txt
    echo ls /www >> test-connection.txt
    echo exit >> test-connection.txt
    
    winscp\WinSCP.exe /script=test-connection.txt
    del test-connection.txt
) else (
    echo ❌ WinSCP non trouvé
    echo 📥 Vérifiez que WinSCP est dans le dossier 'winscp'
)

echo.
echo 📝 Vérifiez aussi :
echo 1. Vos identifiants FTP sont-ils toujours valides ?
echo 2. Le domaine greencart.sbs est-il bien configuré ?
echo 3. L'espace FTP Infomaniak est-il actif ?
pause
