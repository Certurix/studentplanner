# Define the virtual environment directory
$VENV_DIR = "venv"

# Check if the virtual environment directory exists
if (-Not (Test-Path $VENV_DIR)) {
    Write-Output "Creating virtual environment..."
    python -m venv $VENV_DIR
} else {
    Write-Output "Virtual environment already exists."
}

# Activate the virtual environment
Write-Output "Activating virtual environment..."
& $VENV_DIR\Scripts\Activate.ps1

# Install the required packages
Write-Output "Installing required packages..."
Set-Location backend
pip install -r requirements.txt
Set-Location ..

# Run the FastAPI development server
Write-Output "Starting FastAPI development server..."
& fastapi dev backend/app