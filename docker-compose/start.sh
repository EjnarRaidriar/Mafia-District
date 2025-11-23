#!/bin/bash

echo "🚀 Starting Mafia District - All Services with Replicas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

docker compose up -d --build \
  --scale task-service=3 \
  --scale voting-service=3 \
  --scale shop-service=2 \
  --scale roleplay-service=3 \
  --scale town-service=3 \
  --scale character-service=3 \
  --scale communication-service=2 \
  --scale rumors-service=2 \
  --scale game-service=3 \
  --scale user-management-service=3

echo ""
echo "✅ All Services Started with Replicas:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   1. Task Service:            3 replicas (ports 8101-8103)"
echo "   2. Voting Service:          3 replicas (ports 8071-8073)"
echo "   3. Shop Service:            2 replicas (ports 6001-6002)"
echo "   4. Roleplay Service:        3 replicas (ports 8201-8203)"
echo "   5. Town Service:            3 replicas (ports 4343-4345)"
echo "   6. Character Service:       3 replicas (ports 4242-4244)"
echo "   7. Communication Service:   2 replicas"
echo "   8. Rumors Service:          2 replicas"
echo "   9. Game Service:            3 replicas (ports 4141-4143)"
echo "  10. User Management:         3 replicas (ports 4040-4042)"
echo ""
echo "📊 Service Discovery:"
echo "   URL: http://localhost:3030/services"
echo ""
echo "🌐 API Gateway:"
echo "   URL: http://localhost:3000"
echo ""
echo "📝 Check Service Status:"
echo "   docker ps | grep service"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Mafia District is running with 27 service instances!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

