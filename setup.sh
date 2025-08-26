#!/bin/bash

# ASCII art title
echo "
╔═╗╦  ╔═╗╔═╗  ╦  ╦╦╔═╗╦ ╦╔═╗╦  ╦╔═╗╔═╗╦═╗
╠═╣║  ║ ╦║ ║  ╚╗╔╝║╚═╗║ ║╠═╣║  ║╔═╝║╣ ╠╦╝
╩ ╩╩═╝╚═╝╚═╝   ╚╝ ╩╚═╝╚═╝╩ ╩╩═╝╩╚═╝╚═╝╩╚═
"

echo "🚀 Starting setup for Algorithm Visualizer..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install --legacy-peer-deps

# Install required packages for ReactFlow
echo "📦 Installing ReactFlow..."
npm install reactflow --legacy-peer-deps

# Move back to root directory
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Setup environment files
echo "🔧 Setting up environment files..."

# Frontend .env
echo "VITE_API_URL=http://localhost:5000/api" > ../frontend/.env

# Backend .env
echo "PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development" > .env

echo "✅ Setup complete! Start the project with:"
echo "
To start the backend:
  cd backend && npm run dev

To start the frontend:
  cd frontend && npm run dev

Open http://localhost:5173 in your browser when both are running.
"
