const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3000';
const GAME_SERVICE_BASE_URL = `${GATEWAY_URL}/api/game`;
const LOBBY_ID = 5;

async function testSimpleIntegrations() {
    console.log('🔗 Testing Simple Service Integrations\n');

    try {
        // 1. Test Shop Service Integration
        console.log('1. 🛒 Testing Shop Service Integration...');
        const items = await axios.get(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/shop/items`);
        console.log(`   ✅ Shop items retrieved: ${items.data.data.items.length} items`);
        console.log(`   📦 Items: ${items.data.data.items.map(item => `${item.name} (${item.price} coins)`).join(', ')}`);

        // 2. Test Character Service Integration
        console.log('\n2. 🎭 Testing Character Service Integration...');
        const characterResponse = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/create-character`, {
            userId: 'test_vampire',
            role: 'vampire'
        });
        console.log(`   ✅ Character created: ${characterResponse.data.message}`);
        console.log(`   🧛 Appearance: ${JSON.stringify(characterResponse.data.appearance)}`);

        // 3. Test Communication Service Integration
        console.log('\n3. 💬 Testing Communication Service Integration...');
        const messageResponse = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/send-message`, {
            senderId: 'test_sender',
            content: 'Hello from Game Service!',
            chatId: 'test_chat_123',
            role: 'villager',
            location: 'lobby'
        });
        console.log(`   ✅ Message sent: ${messageResponse.data.content}`);
        console.log(`   📨 Message ID: ${messageResponse.data.id}`);

        // 4. Test Rumors Service Integration
        console.log('\n4. 🗣️ Testing Rumors Service Integration...');
        const rumorResponse = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/create-rumor`, {
            content: 'A mysterious event occurred in the game',
            availableRoles: ['villager', 'sheriff']
        });
        console.log(`   ✅ Rumor created: ${rumorResponse.data.message}`);

        console.log('\n🎉 All Service Integrations Working Successfully!\n');

        console.log('📋 Summary:');
        console.log('   ✅ Shop Service: Items retrieved through Game Service');
        console.log('   ✅ Character Service: Character creation with role-based appearance');
        console.log('   ✅ Communication Service: Message sending functionality');
        console.log('   ✅ Rumors Service: Rumor creation functionality');
        console.log('   ✅ All services communicate through Gateway successfully');

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
        console.error('Full error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testSimpleIntegrations();
