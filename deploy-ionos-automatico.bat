@echo off
echo ==========================================
echo    EPC DEVELOPMENTS - DEPLOY AUTOMATICO
echo ==========================================
echo.

echo [1/5] Limpiando directorios anteriores...
if exist "dist" rmdir /s /q "dist"
if exist "deploy-ionos" rmdir /s /q "deploy-ionos"
echo ✅ Limpieza completada

echo.
echo [2/5] Compilando proyecto Angular...
call npm run build
if errorlevel 1 (
    echo ❌ ERROR: Fallo en la compilacion de Angular
    pause
    exit /b 1
)
echo ✅ Compilacion exitosa

echo.
echo [3/5] Copiando archivos Angular...
xcopy "dist\epc-frontend\browser\*" "deploy-ionos\" /E /Y
if errorlevel 1 (
    echo ❌ ERROR: Fallo al copiar archivos Angular
    pause
    exit /b 1
)
echo ✅ Archivos Angular copiados

echo.
echo [4/5] Configurando .htaccess y archivos de configuracion...
echo ErrorDocument 404 /index.html > "deploy-ionos\.htaccess"
copy "deploy-ionos\index.csr.html" "deploy-ionos\index.html" /Y
if exist "deploy-ionos\_redirects" del "deploy-ionos\_redirects" /Q
copy "deploy-ionos\assets\favicon\favicon.ico" "deploy-ionos\favicon.ico" /Y
echo ✅ Configuracion aplicada

echo.
echo [5/5] Copiando sistema de email...
if not exist "deploy-ionos\mail-backend" mkdir "deploy-ionos\mail-backend"

echo   - Copiando sistema PHP...
copy "mail-backend\send-email-native.php" "deploy-ionos\mail-backend\" /Y
if %errorlevel% neq 0 (
    echo     Error copiando send-email-native.php
) else (
    echo     send-email-native.php copiado
)

copy "mail-backend\config.php" "deploy-ionos\mail-backend\" /Y
if %errorlevel% neq 0 (
    echo     Error copiando config.php
) else (
    echo     config.php copiado
)

echo   - Copiando templates originales...
copy "mail-backend\quote-template.html" "deploy-ionos\mail-backend\" /Y
copy "mail-backend\quote-template-pdf.html" "deploy-ionos\mail-backend\" /Y

echo   - Copiando template optimizado para email...
copy "mail-backend\quote-template-email.html" "deploy-ionos\mail-backend\" /Y
if %errorlevel% neq 0 (
    echo     Error copiando quote-template-email.html
) else (
    echo     quote-template-email.html copiado
)

echo ✅ Sistema de email configurado

echo.
echo ==========================================
echo           DEPLOY COMPLETADO!
echo ==========================================
echo.
echo Archivos listos en: deploy-ionos\
echo.
echo Subir a IONOS:
echo - Todo el contenido de deploy-ionos\
echo - Destino: htdocs\
echo.
echo ==========================================
pause
