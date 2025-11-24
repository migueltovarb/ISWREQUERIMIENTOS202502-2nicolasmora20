@echo off
echo ==========================================
echo Configurando el Backend (Django)...
echo ==========================================

cd backend

if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
)

echo Activando entorno virtual e instalando dependencias...
call venv\Scripts\activate
pip install -r requirements.txt

echo.
echo Aplicando migraciones de base de datos...
python manage.py makemigrations api
python manage.py migrate

echo.
echo ==========================================
echo Backend configurado correctamente.
echo ==========================================
echo.
echo Para iniciar el servidor Backend, ejecuta:
echo cd backend ^&^& venv\Scripts\activate ^&^& python manage.py runserver
echo.
echo ==========================================
echo Configurando el Frontend (React)...
echo ==========================================
echo.
echo Asegurate de tener Node.js instalado.
echo.
echo Para iniciar el Frontend:
echo 1. Abre una NUEVA terminal.
echo 2. cd frontend
echo 3. npm install
echo 4. npm run dev
echo.
pause
