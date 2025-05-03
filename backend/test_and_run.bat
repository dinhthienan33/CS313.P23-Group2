@echo off
echo Energy Efficiency API - Test and Run

echo Step 1: Create/retrain models
python retrain_models.py

if %ERRORLEVEL% neq 0 (
    echo Error creating models
    pause
    exit /b 1
)

echo.
echo Step 2: Test models
python test_models.py

if %ERRORLEVEL% neq 0 (
    echo Error testing models
    pause
    exit /b 1
)

echo.
echo Step 3: Start API server
echo Starting API server in a new window...
start cmd /k "python start_with_models.py"

echo.
echo Step 4: Start React App
echo To start the React app, open a new command prompt and run:
echo cd ..\energy-efficiency-app
echo npm start
echo.
echo Note: Make sure you have run 'npm install' in the energy-efficiency-app directory first.

pause 