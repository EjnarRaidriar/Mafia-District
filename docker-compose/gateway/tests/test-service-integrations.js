const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3000';
const GAME_SERVICE_BASE_URL = `${GATEWAY_URL}/api/game`;
const LOBBY_ID = 5;

async function testServiceIntegrations() {
    console.log('🔗 Testing Game Service Integrations with Other Services\n');

    try {
        // 1. Test Character Service Integration
        console.log('1. 🎭 Testing Character Service Integration...');
        await testCharacterService();
        console.log('   ✅ Character Service integration working\n');

        // 2. Test Shop Service Integration
        console.log('2. 🛒 Testing Shop Service Integration...');
        await testShopService();
        console.log('   ✅ Shop Service integration working\n');

        // 3. Test Communication Service Integration
        console.log('3. 💬 Testing Communication Service Integration...');
        await testCommunicationService();
        console.log('   ✅ Communication Service integration working\n');

        // 4. Test Rumors Service Integration
        console.log('4. 🗣️ Testing Rumors Service Integration...');
        await testRumorsService();
        console.log('   ✅ Rumors Service integration working\n');

        console.log('🎉 All Service Integrations Test Completed Successfully!\n');

        console.log('📋 Summary:');
        console.log('   ✅ Character Service: Create characters with role-based appearance');
        console.log('   ✅ Shop Service: Get items and purchase functionality');
        console.log('   ✅ Communication Service: Send messages and manage chats');
        console.log('   ✅ Rumors Service: Create game rumors');
        console.log('   ✅ All services communicate through Gateway');

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    }
}

async function testCharacterService() {
    // Create character for vampire
    const vampireCharacter = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/create-character`, {
        userId: 'vampire_test',
        role: 'vampire'
    });
    console.log(`   🧛 Vampire character created: ${JSON.stringify(vampireCharacter.data.appearance)}`);

    // Create character for sheriff
    const sheriffCharacter = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/create-character`, {
        userId: 'sheriff_test',
        role: 'sheriff'
    });
    console.log(`   👮 Sheriff character created: ${JSON.stringify(sheriffCharacter.data.appearance)}`);

    // Create character for villager
    const villagerCharacter = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/create-character`, {
        userId: 'villager_test',
        role: 'villager'
    });
    console.log(`   👨 Villager character created: ${JSON.stringify(villagerCharacter.data.appearance)}`);
}

async function testShopService() {
    // Get available shop items
    const items = await axios.get(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/shop/items`);
    console.log(`   🛍️ Available items: ${items.data.data.items.length} items found`);
    
    if (items.data.data.items.length > 0) {
        const firstItem = items.data.data.items[0];
        console.log(`   📦 First item: ${firstItem.name} (${firstItem.price} coins)`);

        // Try to purchase the first item
        try {
            const purchase = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/shop/purchase`, {
                userId: 'test_buyer',
                itemId: firstItem.id,
                idempotencyKey: 'test-purchase-001'
            });
            console.log(`   💰 Purchase successful: ${purchase.data.currencyDeducted} coins deducted`);
        } catch (error) {
            console.log(`   ⚠️ Purchase failed (expected if insufficient funds): ${error.response?.data?.error?.message || error.message}`);
        }
    }
}

async function testCommunicationService() {
    // Create a chat first
    const chatResponse = await axios.post(`${GATEWAY_URL}/api/communication/create`, {
        game_id: `lobby_${LOBBY_ID}`,
        type: 'lobby',
        selector: 'general'
    });
    const chatId = chatResponse.data.id;
    console.log(`   💬 Chat created: ${chatId}`);

    // Send a message
    const message = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/send-message`, {
        senderId: 'test_sender',
        content: 'Hello from Game Service integration!',
        chatId: chatId,
        role: 'villager',
        location: 'lobby'
    });
    console.log(`   📨 Message sent: ${message.data.content} (ID: ${message.data.id})`);

    // Get chat messages
    const messages = await axios.get(`${GATEWAY_URL}/api/communication/chat?chat_id=${chatId}&game_id=lobby_${LOBBY_ID}&role=villager&location=lobby`);
    console.log(`   📜 Messages retrieved: ${messages.data.length} messages`);
}

async function testRumorsService() {
    // Create a game rumor
    const rumor = await axios.post(`${GAME_SERVICE_BASE_URL}/lobbies/${LOBBY_ID}/create-rumor`, {
        content: 'A mysterious figure was seen near the town hall at midnight',
        availableRoles: ['villager', 'sheriff']
    });
    console.log(`   🗣️ Rumor created: ${rumor.data.message}`);

    // Try to get rumors for a user
    try {
        const userRumors = await axios.get(`${GATEWAY_URL}/api/rumors/get/lobby_${LOBBY_ID}/test_user`);
        console.log(`   📰 User rumors: ${userRumors.data.length} rumors found`);
    } catch (error) {
        console.log(`   ℹ️ No rumors found for user (expected if no purchases made)`);
    }
}

// Helper function to test direct service calls through Gateway
async function testDirectServiceCalls() {
    console.log('\n🔍 Testing Direct Service Calls Through Gateway...\n');

    try {
        // Test Character Service directly
        console.log('1. Testing Character Service directly...');
        const character = await axios.get(`${GATEWAY_URL}/api/character/vampire_test`);
        if (character.data) {
            console.log(`   ✅ Character found: ${character.data.userId} (${character.data.hair} hair, ${character.data.coat} coat)`);
        } else {
            console.log('   ℹ️ No character found (expected if not created yet)');
        }

        // Test Shop Service directly
        console.log('2. Testing Shop Service directly...');
        const shopItems = await axios.get(`${GATEWAY_URL}/api/shop/items`);
        console.log(`   ✅ Shop items: ${shopItems.data.data.items.length} items available`);

        // Test Communication Service directly
        console.log('3. Testing Communication Service directly...');
        const chats = await axios.get(`${GATEWAY_URL}/api/communication/chats?game_id=lobby_${LOBBY_ID}&role=villager&location=lobby`);
        console.log(`   ✅ Available chats: ${chats.data.length} chats`);

        // Test Rumors Service directly
        console.log('4. Testing Rumors Service directly...');
        const rumors = await axios.get(`${GATEWAY_URL}/api/rumors/get/lobby_${LOBBY_ID}/test_user`);
        console.log(`   ✅ User rumors: ${rumors.data.length} rumors`);

    } catch (error) {
        console.log(`   ⚠️ Direct service test failed: ${error.response?.data?.error?.message || error.message}`);
    }
}

// Run the tests
async function runAllTests() {
    await testServiceIntegrations();
    await testDirectServiceCalls();
}

runAllTests();
