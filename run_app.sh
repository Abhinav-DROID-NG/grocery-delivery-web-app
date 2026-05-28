#!/bin/bash

# --- Colors for output ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting GroceryHub Local Setup...${NC}"

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed. Please install it from https://nodejs.org/${NC}"
    exit 1
fi

# 2. Setup Backend
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd Backend
npm install --silent

# 3. Start Backend in background
echo -e "${BLUE}⚡ Starting backend server on port 5000...${NC}"
node server.js &
BACKEND_PID=$!

# 4. Wait for server to be ready
echo -e "${BLUE}⏳ Waiting for server to initialize...${NC}"
sleep 2

# 5. Launch Frontend
echo -e "${GREEN}✅ Backend is running! (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}🌐 Opening frontend in your browser...${NC}"

# Open the HTML file based on OS
FILE_PATH="../Frontend/groceryhub.html"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$FILE_PATH" 2>/dev/null || echo -e "Please open ${FILE_PATH} manually in your browser."
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "$FILE_PATH"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start "$FILE_PATH"
else
    echo -e "System not recognized. Please open ${FILE_PATH} manually."
fi

echo -e "\n${GREEN}--------------------------------------------------${NC}"
echo -e "${GREEN}🛒 GroceryHub is now live!${NC}"
echo -e "Backend: http://localhost:5000"
echo -e "Press ${RED}Ctrl+C${NC} to stop the server."
echo -e "${GREEN}--------------------------------------------------${NC}"

# Cleanup on exit
trap "echo -e '\n${RED}🛑 Stopping backend...${NC}'; kill $BACKEND_PID; exit" SIGINT SIGTERM

# Keep script running to maintain the background process
wait $BACKEND_PID
