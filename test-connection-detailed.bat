@echo off
echo ========================================
echo 🔍 Test détaillé de connexion FTP
echo ========================================
echo.

REM Configuration
set HOST=eq8a66.ftp.infomaniak.com
set USERNAME=eq8a66_temp_1
set PASSWORD=Wxcvbnm09@

echo 🌐 Test de connexion vers : %HOST%
echo 👤 Utilisateur : %USERNAME%

echo.
echo 📡 Test de connexion FTP...
echo option batch abort > test-detailed.txt
echo option confirm off >> test-detailed.txt
echo open ftp://%USERNAME%:%PASSWORD%@%HOST% >> test-detailed.txt
echo pwd >> test-detailed.txt
echo ls / >> test-detailed.txt
echo ls /www >> test-detailed.txt
echo exit >> test-detailed.txt

winscp\WinSCP.exe /script=test-detailed.txt /log=test-ftp.log

echo.
echo 📋 Vérification du domaine...
echo Vérifiez que le domaine greencart.sbs pointe vers votre hébergement Infomaniak
echo DNS : nslookup greencart.sbs

del test-detailed.txt
pause
