# Database Setup Script for iCaptur Platform (PowerShell)
# This script creates the database and user if they don't exist

param(
    [string]$DbName = "app_icaptur",
    [string]$DbUser = "icaptur_user",
    [string]$DbPassword = "icaptur_password_123"
)

Write-Host "=== iCaptur Database Setup ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Database Configuration:"
Write-Host "  Database: $DbName"
Write-Host "  User: $DbUser"
Write-Host "  Password: $DbPassword"
Write-Host ""

# Check if PostgreSQL is accessible
try {
    $result = psql -U postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "PostgreSQL connection failed"
    }
    Write-Host "PostgreSQL is running" -ForegroundColor Green
} catch {
    Write-Host "Error: PostgreSQL is not running or not accessible" -ForegroundColor Red
    Write-Host "Please start PostgreSQL and try again"
    exit 1
}

Write-Host ""

# Create database if it doesn't exist
$dbExists = psql -U postgres -lqt | Select-String -Pattern "^\s*$DbName\s*\|"
if ($dbExists) {
    Write-Host "Database '$DbName' already exists" -ForegroundColor Yellow
} else {
    Write-Host "Creating database '$DbName'..."
    psql -U postgres -c "CREATE DATABASE $DbName;"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "Failed to create database" -ForegroundColor Red
        exit 1
    }
}

# Create user if it doesn't exist
$userExists = psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DbUser';"
if ($userExists) {
    Write-Host "User '$DbUser' already exists" -ForegroundColor Yellow
    Write-Host "Updating password..."
    psql -U postgres -c "ALTER USER $DbUser WITH PASSWORD '$DbPassword';"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to update password" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Creating user '$DbUser'..."
    psql -U postgres -c "CREATE USER $DbUser WITH PASSWORD '$DbPassword';"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "User created successfully" -ForegroundColor Green
    } else {
        Write-Host "Failed to create user" -ForegroundColor Red
        exit 1
    }
}

# Grant privileges
Write-Host "Granting privileges..."
psql -U postgres -d $DbName -c "GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser;"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to grant database privileges" -ForegroundColor Red
    exit 1
}

psql -U postgres -d $DbName -c "GRANT ALL ON SCHEMA public TO $DbUser;"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Could not grant schema privileges" -ForegroundColor Yellow
}

Write-Host "Privileges granted" -ForegroundColor Green
Write-Host ""

# Display connection string
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Add this to your .env files:"
Write-Host ""
Write-Host "DATABASE_URL=postgresql://$DbUser`:$DbPassword@localhost:5432/$DbName" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files to update:"
Write-Host "  - services/sso-api/.env"
Write-Host "  - services/experience-api/.env"
Write-Host ""

