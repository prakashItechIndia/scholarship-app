#!/bin/bash
# Database Setup Script for iCaptur Platform
# This script creates the database and user if they don't exist

set -e

echo "=== iCaptur Database Setup ==="
echo ""

# Default values
DB_NAME="${DB_NAME:-app_icaptur}"
DB_USER="${DB_USER:-icaptur_user}"
DB_PASSWORD="${DB_PASSWORD:-icaptur_password_123}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Database Configuration:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${RED}Error: PostgreSQL is not running or not accessible${NC}"
    echo "Please start PostgreSQL and try again"
    exit 1
fi

echo -e "${GREEN}PostgreSQL is running${NC}"
echo ""

# Create database if it doesn't exist
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo -e "${YELLOW}Database '$DB_NAME' already exists${NC}"
else
    echo "Creating database '$DB_NAME'..."
    psql -U postgres -c "CREATE DATABASE $DB_NAME;" || {
        echo -e "${RED}Failed to create database${NC}"
        exit 1
    }
    echo -e "${GREEN}Database created successfully${NC}"
fi

# Create user if it doesn't exist
if psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
    echo -e "${YELLOW}User '$DB_USER' already exists${NC}"
    echo "Updating password..."
    psql -U postgres -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || {
        echo -e "${RED}Failed to update password${NC}"
        exit 1
    }
else
    echo "Creating user '$DB_USER'..."
    psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || {
        echo -e "${RED}Failed to create user${NC}"
        exit 1
    }
    echo -e "${GREEN}User created successfully${NC}"
fi

# Grant privileges
echo "Granting privileges..."
psql -U postgres -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" || {
    echo -e "${RED}Failed to grant database privileges${NC}"
    exit 1
}

psql -U postgres -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" || {
    echo -e "${YELLOW}Warning: Could not grant schema privileges (may need to connect as $DB_USER)${NC}"
}

echo -e "${GREEN}Privileges granted${NC}"
echo ""

# Display connection string
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "Add this to your .env files:"
echo ""
echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "Files to update:"
echo "  - services/sso-api/.env"
echo "  - services/experience-api/.env"
echo ""

