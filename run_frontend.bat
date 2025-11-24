@echo off
echo ==========================================
echo Iniciando Frontend (React)...
echo ==========================================

cd frontend

if not exist "node_modules" (
    echo Instalando dependencias (esto puede tardar un poco)...
    call npm install
)

echo Iniciando servidor de desarrollo...
call npm run dev

pause
