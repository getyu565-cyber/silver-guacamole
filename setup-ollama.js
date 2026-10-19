const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Function to check if Ollama server is responsive
function waitForOllama() {
  return new Promise((resolve) => {
    const check = () => {
      http.get('http://127.0.0.1:11434/api/tags', (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 1000);
      }).on('error', () => setTimeout(check, 1000));
    };
    check();
  });
}

async function setup() {
  console.log('Starting Ollama server...');
  const server = spawn('ollama', ['serve'], { stdio: 'inherit' });

  await waitForOllama();
  console.log('Ollama server is active.');

  // 2. Execute ollama signin inside Node.js
  try {
    console.log('Executing ollama signin...');
    execSync('ollama signin', { stdio: 'inherit' });
  } catch (err) {
    console.warn('ollama signin note:', err.message);
  }

  // 3. Pull model
  console.log('Pulling model llama3.2...');
  execSync('ollama pull llama3.2', { stdio: 'inherit' });

  console.log('Setup complete!');
  server.kill();
  process.exit(0);
}

setup();
