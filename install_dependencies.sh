#!/bin/bash

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/Backend"

echo -e "${BLUE}Installing GroceryHub npm dependencies...${NC}"

if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Install Node.js from https://nodejs.org/ and run this script again."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    echo "Install npm and run this script again."
    exit 1
fi

if [ ! -f "$BACKEND_DIR/package.json" ]; then
    echo -e "${RED}Error: Backend/package.json was not found.${NC}"
    exit 1
fi

cd "$BACKEND_DIR"

echo -e "${BLUE}Node version: $(node --version)${NC}"
echo -e "${BLUE}npm version: $(npm --version)${NC}"

if [ -f "package-lock.json" ]; then
    echo -e "${BLUE}Using package-lock.json for exact dependency versions...${NC}"
    npm ci
else
    echo -e "${BLUE}No package-lock.json found; installing from package.json...${NC}"
    npm install
fi

echo -e "${GREEN}All npm dependencies installed successfully.${NC}"
