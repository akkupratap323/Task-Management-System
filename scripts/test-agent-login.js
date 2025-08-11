async function testAgentLogin(email, password) {
  try {
    console.log(`🔍 Testing agent login: ${email}`);
    
    const response = await fetch('http://localhost:3000/api/auth/agent-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Data:`, JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log(`Agent: ${data.agent.name} (${data.agent.email})`);
      console.log(`Admin: ${data.agent.adminEmail}`);
      console.log(`Token: ${data.token.substring(0, 50)}...`);
    } else {
      console.log('❌ Login failed:', data.error);
    }
    
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

async function testAllAgents() {
  const testAgents = [
    { email: 'john@agent.com', password: 'agent123' },
    { email: 'jane@agent.com', password: 'agent123' },
    { email: 'bob@agent.com', password: 'agent123' },
    { email: 'alice@agent.com', password: 'agent123' },
    { email: 'charlie@agent.com', password: 'agent123' }
  ];

  for (const agent of testAgents) {
    console.log('\n' + '='.repeat(50));
    await testAgentLogin(agent.email, agent.password);
  }
  
  // Test with wrong password
  console.log('\n' + '='.repeat(50));
  console.log('🔍 Testing wrong password:');
  await testAgentLogin('jane@agent.com', 'wrongpass');
}

testAllAgents();