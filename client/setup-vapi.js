#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎤 Vapi Voice Assistant Setup\n');

console.log('📋 To get your Vapi credentials:');
console.log('1. Go to https://console.vapi.ai');
console.log('2. Sign up/login to your account');
console.log('3. Go to "API Keys" section');
console.log('4. Copy your Public API key (starts with "pk_")');
console.log('5. Go to "Assistants" section');
console.log('6. Create an assistant or copy existing Assistant ID\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Vapi Public API Key (starts with pk_): ', (apiKey) => {
  rl.question('Enter your Assistant ID: ', (assistantId) => {
    const envContent = `# Vapi Configuration
# Get these values from your Vapi dashboard at https://console.vapi.ai

# Your Vapi Public API Key (starts with 'pk_')
NEXT_PUBLIC_VAPI_API_KEY=${apiKey}

# Your Assistant ID (found in the Assistants section of your Vapi dashboard)
NEXT_PUBLIC_ASSISTANT_ID=${assistantId}
`;

    const envPath = path.join(__dirname, '.env.local');
    
    try {
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ Environment variables saved to .env.local');
      console.log('\n🔄 Please restart your development server:');
      console.log('   npm run dev');
      console.log('\n🎯 Then navigate to http://localhost:3000/vapi');
    } catch (error) {
      console.error('❌ Error saving .env.local:', error.message);
    }
    
    rl.close();
  });
}); 