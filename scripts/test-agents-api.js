async function testAgentsAPI() {
  try {
    // Test admin1 login and agents
    console.log('🔄 Testing Admin1 (admin@test.com)...');
    const admin1Login = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'admin123' })
    });
    
    const admin1Data = await admin1Login.json();
    if (!admin1Data.success) {
      console.log('❌ Admin1 login failed:', admin1Data.error);
      return;
    }
    
    console.log('✅ Admin1 login successful');
    
    // Get agents for admin1
    const admin1AgentsResponse = await fetch('http://localhost:3000/api/agents', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${admin1Data.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const admin1Agents = await admin1AgentsResponse.json();
    console.log('📊 Admin1 sees', admin1Agents.agents?.length || 0, 'agents:');
    if (admin1Agents.agents) {
      admin1Agents.agents.forEach(agent => {
        console.log(`   - ${agent.name} (${agent.email})`);
      });
    }

    // Test admin2 login and agents
    console.log('\n🔄 Testing Admin2 (admin2@test.com)...');
    const admin2Login = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin2@test.com', password: 'admin123' })
    });
    
    const admin2Data = await admin2Login.json();
    if (!admin2Data.success) {
      console.log('❌ Admin2 login failed:', admin2Data.error);
      return;
    }
    
    console.log('✅ Admin2 login successful');
    
    // Get agents for admin2
    const admin2AgentsResponse = await fetch('http://localhost:3000/api/agents', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${admin2Data.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const admin2Agents = await admin2AgentsResponse.json();
    console.log('📊 Admin2 sees', admin2Agents.agents?.length || 0, 'agents:');
    if (admin2Agents.agents) {
      admin2Agents.agents.forEach(agent => {
        console.log(`   - ${agent.name} (${agent.email})`);
      });
    }

    // Summary
    const admin1Count = admin1Agents.agents?.length || 0;
    const admin2Count = admin2Agents.agents?.length || 0;
    
    console.log('\n📋 SUMMARY:');
    console.log(`   Admin1: ${admin1Count} agents`);
    console.log(`   Admin2: ${admin2Count} agents`);
    
    if (admin1Count > 0 && admin2Count > 0 && admin1Count !== admin2Count) {
      console.log('✅ Workspace isolation is WORKING in the API!');
    } else if (admin1Count === admin2Count) {
      console.log('⚠️  Both admins see the same number of agents - check isolation');
    } else {
      console.log('⚠️  One admin has no agents - check data setup');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAgentsAPI();