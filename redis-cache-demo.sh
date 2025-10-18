#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}╔════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║     🔍 Redis Cache Demo - Advanced    ║${NC}"
echo -e "${PURPLE}╔════════════════════════════════════════╗${NC}"
echo ""

# Function to print section headers
section() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print info
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

section "1. Check Redis Connection"
PING_RESULT=$(docker exec docker-compose-redis-1 redis-cli PING 2>/dev/null)
if [ "$PING_RESULT" = "PONG" ]; then
    success "Redis is connected: $PING_RESULT"
else
    warning "Redis connection failed!"
    exit 1
fi

section "2. Current Cache Status"
KEY_COUNT=$(docker exec docker-compose-redis-1 redis-cli DBSIZE 2>/dev/null | grep -o '[0-9]*')
info "Total keys in cache: $KEY_COUNT"
if [ "$KEY_COUNT" -gt 0 ]; then
    echo -e "\n${YELLOW}Current keys:${NC}"
    docker exec docker-compose-redis-1 redis-cli KEYS "*" 2>/dev/null
fi

section "3. Adding User Data to Cache"
info "Creating user profile for user:1001..."
docker exec docker-compose-redis-1 redis-cli SET "user:1001:name" "Alice Johnson" EX 300 > /dev/null
docker exec docker-compose-redis-1 redis-cli SET "user:1001:email" "alice@example.com" EX 300 > /dev/null
docker exec docker-compose-redis-1 redis-cli SET "user:1001:role" "admin" EX 300 > /dev/null
success "User profile cached (expires in 5 minutes)"

section "4. Adding Game Data to Cache"
info "Creating game session data..."
docker exec docker-compose-redis-1 redis-cli SET "game:lobby:5:players" "4" EX 600 > /dev/null
docker exec docker-compose-redis-1 redis-cli SET "game:lobby:5:status" "active" EX 600 > /dev/null
docker exec docker-compose-redis-1 redis-cli SET "game:lobby:5:map" "downtown" EX 600 > /dev/null
success "Game session cached (expires in 10 minutes)"

section "5. Adding Leaderboard Data"
info "Creating leaderboard entries..."
docker exec docker-compose-redis-1 redis-cli SET "leaderboard:top1" "PlayerX:9999" EX 3600 > /dev/null
docker exec docker-compose-redis-1 redis-cli SET "leaderboard:top2" "PlayerY:8888" EX 3600 > /dev/null
docker exec docker-compose-redis-1 redis-cli SET "leaderboard:top3" "PlayerZ:7777" EX 3600 > /dev/null
success "Leaderboard cached (expires in 1 hour)"

section "6. Retrieving Cached Data"
echo -e "\n${YELLOW}User Profile:${NC}"
echo "  Name:  $(docker exec docker-compose-redis-1 redis-cli GET 'user:1001:name')"
echo "  Email: $(docker exec docker-compose-redis-1 redis-cli GET 'user:1001:email')"
echo "  Role:  $(docker exec docker-compose-redis-1 redis-cli GET 'user:1001:role')"

echo -e "\n${YELLOW}Game Session:${NC}"
echo "  Players: $(docker exec docker-compose-redis-1 redis-cli GET 'game:lobby:5:players')"
echo "  Status:  $(docker exec docker-compose-redis-1 redis-cli GET 'game:lobby:5:status')"
echo "  Map:     $(docker exec docker-compose-redis-1 redis-cli GET 'game:lobby:5:map')"

echo -e "\n${YELLOW}Leaderboard:${NC}"
echo "  🥇 $(docker exec docker-compose-redis-1 redis-cli GET 'leaderboard:top1')"
echo "  🥈 $(docker exec docker-compose-redis-1 redis-cli GET 'leaderboard:top2')"
echo "  🥉 $(docker exec docker-compose-redis-1 redis-cli GET 'leaderboard:top3')"

section "7. Cache Expiration (TTL)"
echo -e "\n${YELLOW}Time to live for each key:${NC}"
USER_TTL=$(docker exec docker-compose-redis-1 redis-cli TTL "user:1001:name")
GAME_TTL=$(docker exec docker-compose-redis-1 redis-cli TTL "game:lobby:5:players")
LEAD_TTL=$(docker exec docker-compose-redis-1 redis-cli TTL "leaderboard:top1")
echo "  User data:        ${USER_TTL}s remaining"
echo "  Game session:     ${GAME_TTL}s remaining"
echo "  Leaderboard:      ${LEAD_TTL}s remaining"

section "8. All Cached Keys"
TOTAL_KEYS=$(docker exec docker-compose-redis-1 redis-cli KEYS "*" | wc -l)
echo -e "${YELLOW}Total keys cached: $TOTAL_KEYS${NC}\n"
docker exec docker-compose-redis-1 redis-cli KEYS "*"

section "9. Gateway Cache Statistics"
echo ""
curl -s http://localhost:3000/api/gateway/cache/stats 2>/dev/null | python3 -m json.tool || echo "Gateway cache stats unavailable"

section "10. Redis Memory Usage"
docker exec docker-compose-redis-1 redis-cli INFO memory | grep -E "used_memory_human|used_memory_peak_human" || true

section "📊 Cache Performance Demo"
info "Testing cache performance..."
echo ""

# Test 1: First request (cache miss)
echo -e "${YELLOW}Test 1: First request (cache miss - slow)${NC}"
START=$(date +%s%N)
docker exec docker-compose-redis-1 redis-cli GET "performance:test" > /dev/null 2>&1
END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
echo "  Response time: ${DURATION}ms"

# Add to cache
docker exec docker-compose-redis-1 redis-cli SET "performance:test" "cached_value" EX 60 > /dev/null

# Test 2: Second request (cache hit)
echo -e "\n${YELLOW}Test 2: Second request (cache hit - fast)${NC}"
START=$(date +%s%N)
docker exec docker-compose-redis-1 redis-cli GET "performance:test" > /dev/null 2>&1
END=$(date +%s%N)
DURATION=$((($END - $START) / 1000000))
echo "  Response time: ${DURATION}ms"
success "Cache is significantly faster!"

section "🧹 Cleanup Options"
echo -e "${YELLOW}Choose an option:${NC}"
echo "  1. Keep cache data for testing"
echo "  2. Clear test data only"
echo "  3. Clear ALL cache"
echo ""
read -p "Enter choice (1-3) or press Enter to skip: " CHOICE

case $CHOICE in
    2)
        info "Clearing test data..."
        docker exec docker-compose-redis-1 redis-cli DEL user:1001:name user:1001:email user:1001:role > /dev/null
        docker exec docker-compose-redis-1 redis-cli DEL game:lobby:5:players game:lobby:5:status game:lobby:5:map > /dev/null
        docker exec docker-compose-redis-1 redis-cli DEL leaderboard:top1 leaderboard:top2 leaderboard:top3 > /dev/null
        docker exec docker-compose-redis-1 redis-cli DEL performance:test > /dev/null
        success "Test data cleared!"
        ;;
    3)
        warning "Clearing ALL cache..."
        docker exec docker-compose-redis-1 redis-cli FLUSHDB > /dev/null
        success "All cache cleared!"
        ;;
    *)
        info "Cache data preserved for testing"
        ;;
esac

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║          ✅ Demo Complete!             ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📖 Quick Commands:${NC}"
echo -e "  ${GREEN}→${NC} Explore Redis CLI:"
echo "    docker exec -it docker-compose-redis-1 redis-cli"
echo ""
echo -e "  ${GREEN}→${NC} View cache stats:"
echo "    curl http://localhost:3000/api/gateway/cache/stats"
echo ""
echo -e "  ${GREEN}→${NC} Clear gateway cache:"
echo "    curl -X POST http://localhost:3000/api/gateway/cache/clear"
echo ""
echo -e "  ${GREEN}→${NC} Monitor Redis in real-time:"
echo "    docker exec -it docker-compose-redis-1 redis-cli MONITOR"
echo ""

