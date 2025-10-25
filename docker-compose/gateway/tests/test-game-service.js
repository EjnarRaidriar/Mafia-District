const axios = require('axios');

const GAME_SERVICE_URL = 'http://localhost:4141';

async function testGameService() {
  console.log('🎮 Testing Enhanced Game Service\n');

  try {
    // Step 1: Create a lobby
    console.log('1️⃣ Creating a lobby...');
    const lobbyResponse = await axios.post(`${GAME_SERVICE_URL}/lobbies`, {
      maxPlayers: 10
    });
    const lobbyId = lobbyResponse.data.id;
    console.log('✅ Lobby created:', lobbyResponse.data);

    // Step 2: Add players to the lobby
    console.log('\n2️⃣ Adding players to lobby...');
    const players = [
      { userId: 'user123' },
      { userId: 'user456' },
      { userId: 'user789' }
    ];

    for (const player of players) {
      const playerResponse = await axios.post(`${GAME_SERVICE_URL}/lobbies/${lobbyId}/players`, player);
      console.log(`✅ Player added:`, playerResponse.data);
    }

    // Step 3: Get all players in lobby
    console.log('\n3️⃣ Getting all players in lobby...');
    const playersResponse = await axios.get(`${GAME_SERVICE_URL}/lobbies/${lobbyId}/players`);
    console.log('✅ Players in lobby:', playersResponse.data);

    // Step 4: Update player currency
    console.log('\n4️⃣ Updating player currency...');
    const firstPlayer = playersResponse.data[0];
    const currencyResponse = await axios.put(`${GAME_SERVICE_URL}/players/${firstPlayer.id}/currency`, {
      currency: 1500
    });
    console.log('✅ Currency updated:', currencyResponse.data);

    // Step 5: Update player status
    console.log('\n5️⃣ Updating player status...');
    const statusResponse = await axios.put(`${GAME_SERVICE_URL}/players/${firstPlayer.id}/status`, {
      status: 'dead'
    });
    console.log('✅ Status updated:', statusResponse.data);

    // Step 6: Get specific player
    console.log('\n6️⃣ Getting specific player...');
    const playerResponse = await axios.get(`${GAME_SERVICE_URL}/players/${firstPlayer.id}`);
    console.log('✅ Player details:', playerResponse.data);

    console.log('\n🎉 Game Service test successful!');
    console.log('\n📋 Enhanced Features:');
    console.log('   • Player management in lobbies');
    console.log('   • Currency tracking (starting: 1000)');
    console.log('   • Status management (alive/dead)');
    console.log('   • Role assignment (default: villager)');
    console.log('   • Task assignment (default: Complete daily tasks)');
    console.log('   • User ID tracking');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testGameService();
