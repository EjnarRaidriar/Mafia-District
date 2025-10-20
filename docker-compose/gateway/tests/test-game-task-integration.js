const axios = require('axios');

const GAME_SERVICE_URL = 'http://localhost:4141';
const TASK_SERVICE_URL = 'http://localhost:8081';

async function testGameTaskIntegration() {
    console.log('🎮 Testing Game Service + Task Service Integration\n');

    try {
        // 1. Create a lobby
        console.log('1. Creating a lobby...');
        const lobbyResponse = await axios.post(`${GAME_SERVICE_URL}/lobbies`, {
            maxPlayers: 6
        });
        const lobbyId = lobbyResponse.data.ID;
        console.log(`✅ Lobby created with ID: ${lobbyId}\n`);

        // 2. Add a player to the lobby (this should trigger task assignment)
        console.log('2. Adding a player to the lobby...');
        const playerResponse = await axios.post(`${GAME_SERVICE_URL}/lobbies/${lobbyId}/players`, {
            userId: 'test-user-123'
        });
        const player = playerResponse.data;
        console.log(`✅ Player added: ${player.userId} (${player.role})`);
        console.log(`   Currency: ${player.currency}, Status: ${player.status}\n`);

        // 3. Check if tasks were assigned to the player
        console.log('3. Checking assigned tasks...');
        try {
            const tasksResponse = await axios.get(`${TASK_SERVICE_URL}/api/task/user/${player.userId}?lobbyId=lobby_${lobbyId}&day=1`);
            const tasks = tasksResponse.data.data.tasks;
            
            if (tasks && tasks.length > 0) {
                console.log(`✅ ${tasks.length} task(s) assigned to player:`);
                tasks.forEach((task, index) => {
                    console.log(`   Task ${index + 1}: ${task.description}`);
                    console.log(`   Reward: ${task.reward} coins, Location: ${task.locationId}`);
                });
            } else {
                console.log('❌ No tasks found for the player');
            }
        } catch (error) {
            console.log(`❌ Failed to fetch tasks: ${error.response?.data?.message || error.message}`);
        }

        // 4. Add another player with a different role
        console.log('\n4. Adding another player with vampire role...');
        const player2Response = await axios.post(`${GAME_SERVICE_URL}/lobbies/${lobbyId}/players`, {
            userId: 'test-vampire-456'
        });
        const player2 = player2Response.data;
        
        // Update player role to vampire
        await axios.put(`${GAME_SERVICE_URL}/players/${player2.id}/role`, {
            role: 'vampire'
        });
        console.log(`✅ Vampire player added: ${player2.userId}\n`);

        // 5. Check tasks for the vampire player
        console.log('5. Checking tasks for vampire player...');
        try {
            const vampireTasksResponse = await axios.get(`${TASK_SERVICE_URL}/api/task/user/${player2.userId}?lobbyId=lobby_${lobbyId}&day=1`);
            const vampireTasks = vampireTasksResponse.data.data.tasks;
            
            if (vampireTasks && vampireTasks.length > 0) {
                console.log(`✅ ${vampireTasks.length} task(s) assigned to vampire:`);
                vampireTasks.forEach((task, index) => {
                    console.log(`   Task ${index + 1}: ${task.description}`);
                    console.log(`   Reward: ${task.reward} coins, Location: ${task.locationId}`);
                });
            } else {
                console.log('❌ No tasks found for the vampire player');
            }
        } catch (error) {
            console.log(`❌ Failed to fetch vampire tasks: ${error.response?.data?.message || error.message}`);
        }

        // 6. Test task completion
        console.log('\n6. Testing task completion...');
        try {
            const tasksResponse = await axios.get(`${TASK_SERVICE_URL}/api/task/user/${player.userId}?lobbyId=lobby_${lobbyId}&day=1`);
            const tasks = tasksResponse.data.data.tasks;
            
            if (tasks && tasks.length > 0) {
                const taskToComplete = tasks[0];
                console.log(`Attempting to complete task: ${taskToComplete.description}`);
                
                const completeResponse = await axios.post(`${TASK_SERVICE_URL}/api/task/complete`, {
                    taskId: taskToComplete.id,
                    userId: player.userId,
                    lobbyId: `lobby_${lobbyId}`,
                    evidence: 'Completed successfully',
                    idempotencyKey: `complete-${taskToComplete.id}-${Date.now()}`
                });
                
                console.log(`✅ Task completed! Reward: ${completeResponse.data.data.reward} coins`);
            }
        } catch (error) {
            console.log(`❌ Failed to complete task: ${error.response?.data?.message || error.message}`);
        }

        console.log('\n🎉 Integration test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testGameTaskIntegration();
