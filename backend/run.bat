@echo off
echo Starting Energy Efficiency API...

rem Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Python is not installed or not in the PATH.
    exit /b 1
)

rem Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

rem Install dependencies if needed
echo Checking dependencies...
pip install -r requirements.txt

rem Start the API server
echo Starting API server...
python start_with_models.py

pause 