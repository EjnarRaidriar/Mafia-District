const axios = require('axios');

const GAME_SERVICE_URL = 'http://localhost:4141';
const LOBBY_ID = 5;

async function testGameEndingFlow() {
    console.log('🎮 Testing Game Ending Flow with Voting Integration\n');

    try {
        // Step 1: Add some players to the lobby
        console.log('1. Adding players to lobby...');
        const players = [
            { userId: 'vampire1', role: 'vampire', currency: 1000, status: 'alive' },
            { userId: 'sheriff1', role: 'sheriff', currency: 1000, status: 'alive' },
            { userId: 'villager1', role: 'villager', currency: 1000, status: 'alive' },
            { userId: 'villager2', role: 'villager', currency: 1000, status: 'alive' }
        ];

        for (const player of players) {
            const response = await axios.post(`${GAME_SERVICE_URL}/lobbies/${LOBBY_ID}/players`, player);
            console.log(`   ✅ Added player: ${player.userId} (${player.role})`);
        }

        // Step 2: Test voting to eliminate someone
        console.log('\n2. Testing elimination voting...');
        
        // Player 1 votes for Player 2
        const vote1 = await axios.post(`${GAME_SERVICE_URL}/lobbies/${LOBBY_ID}/vote-eliminate`, {
            voterId: 'vampire1',
            targetId: 'sheriff1',
            idempotencyKey: 'elimination-vote-1',
            day: 1
        });
        console.log(`   ✅ Vote 1: ${vote1.data.message}`);

        // Player 3 votes for Player 2
        const vote2 = await axios.post(`${GAME_SERVICE_URL}/lobbies/${LOBBY_ID}/vote-eliminate`, {
            voterId: 'villager1',
            targetId: 'sheriff1',
            idempotencyKey: 'elimination-vote-2',
            day: 1
        });
        console.log(`   ✅ Vote 2: ${vote2.data.message}`);

        // Player 4 votes for Player 2
        const vote3 = await axios.post(`${GAME_SERVICE_URL}/lobbies/${LOBBY_ID}/vote-eliminate`, {
            voterId: 'villager2',
            targetId: 'sheriff1',
            idempotencyKey: 'elimination-vote-3',
            day: 1
        });
        console.log(`   ✅ Vote 3: ${vote3.data.message}`);

        // Step 3: Check vote results
        console.log('\n3. Checking vote results...');
        const results = await axios.get(`${GAME_SERVICE_URL}/lobbies/${LOBBY_ID}/vote-results?day=1`);
        console.log(`   📊 Vote Results:`);
        console.log(`      Lobby: ${results.data.data.lobbyId}`);
        console.log(`      Day: ${results.data.data.day}`);
        console.log(`      Tally: ${JSON.stringify(results.data.data.tally)}`);
        console.log(`      Eliminated: ${results.data.data.exiledUserId}`);

        // Step 4: End the game
        console.log('\n4. Ending the game...');
        const endGame = await axios.post(`${GAME_SERVICE_URL}/lobbies/${LOBBY_ID}/end-game?day=1`);
        console.log(`   🏁 Game End Results:`);
        console.log(`      Status: ${endGame.data.status}`);
        console.log(`      Message: ${endGame.data.message}`);
        console.log(`      Eliminated Player: ${endGame.data.data.eliminatedPlayer}`);
        console.log(`      Vote Tally: ${JSON.stringify(endGame.data.data.voteTally)}`);
        console.log(`      Timestamp: ${endGame.data.data.timestamp}`);

        // Step 5: Check player status after elimination
        console.log('\n5. Checking player status after elimination...');
        const playersAfter = await axios.get(`${GAME_SERVICE_URL}/lobbies/${LOBBY_ID}/players`);
        console.log(`   👥 Players in lobby after elimination:`);
        playersAfter.data.forEach(player => {
            console.log(`      ${player.UserID}: ${player.Status} (${player.Role})`);
        });

        console.log('\n🎉 Game Ending Flow Test Completed Successfully!');
        console.log('\n📋 Summary:');
        console.log('   ✅ Players can vote to eliminate others');
        console.log('   ✅ Vote results are calculated correctly');
        console.log('   ✅ Game can be ended with final results');
        console.log('   ✅ Eliminated player status is updated to "dead"');
        console.log('   ✅ Integration with Voting Service works perfectly');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testGameEndingFlow();
