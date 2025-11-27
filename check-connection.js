// Simple script to test backend connectivity
import axios from 'axios';

async function checkBackend() {
  try {
    console.log('🔍 Checking backend connection...');
    
    // Test basic connectivity
    const healthResponse = await axios.get('http://localhost:8000/api/health', {
      timeout: 5000
    });
    console.log('✅ Backend is running:', healthResponse.data);
    
    // Test CORS
    const corsResponse = await axios.get('http://localhost:8000/', {
      timeout: 5000
    });
    console.log('✅ CORS is working:', corsResponse.data);
    
    console.log('🎉 Backend connection is working properly!');
    
  } catch (error) {
    console.log('❌ Backend connection failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   - Backend server is not running');
      console.log('   - Start it with: cd backend && start.bat');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   - Connection timeout - check if backend is responding');
    } else {
      console.log('   - Error:', error.message);
    }
    
    console.log('\n🔧 To fix this:');
    console.log('1. Open a new terminal');
    console.log('2. Navigate to backend folder: cd backend');
    console.log('3. Run: start.bat');
    console.log('4. Wait for "Starting FastAPI server on http://localhost:8000"');
    console.log('5. Try signing up again');
  }
}

checkBackend();