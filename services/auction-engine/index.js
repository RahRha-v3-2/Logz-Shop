import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: '*', 
});

await fastify.register(websocket);

// --- AUCTION MANAGER STATE ---
const AUCTION_ITEMS = [
  { id: '1', title: 'CHASE_GLOBAL_BIN_DUMP_01', basePrice: 400, duration: 60, type: 'BIN_LOGS' },
  { id: '2', title: 'CHIME_FULL_SESS_LOGS_MARCH', basePrice: 320, duration: 45, type: 'SESSION_LOGS' },
  { id: '3', title: 'FANDUEL_ACTIVE_PAYOUT_ACC_X12', basePrice: 850, duration: 90, type: 'PAYOUT_ACCS' },
  { id: '4', title: 'DB_SHARD_07 // EXFIL_NODE', basePrice: 1200, duration: 120, type: 'DATABASE_DUMP' }
];

const BOT_USERS = ['x77_Kw', 'Anon_99', 'NullPtr', 'Syndicate', 'Ghost_Root', 'Cyber_Viper', 'Neon_Blade', 'D4rk_M4tter', 'Zero_Cool'];

let currentItemIndex = 0;
let auctionState = {
  item: AUCTION_ITEMS[0],
  timeLeft: AUCTION_ITEMS[0].duration,
  currentPrice: AUCTION_ITEMS[0].basePrice,
  highestBidder: 'RESERVE_PRICE',
  history: [],
  isActive: true
};

const connectedClients = new Set();

function broadcast(v) {
  const message = JSON.stringify(v);
  for (const client of connectedClients) {
    if (client.readyState === 1) client.send(message);
  }
}

// Bidding Logic
function simulateOrganicBid() {
  if (!auctionState.isActive) return;

  // More likely to bid if timer is low or price is low
  const bidProbability = auctionState.timeLeft < 10 ? 0.4 : 0.15;
  
  if (Math.random() < bidProbability) {
    const user = BOT_USERS[Math.floor(Math.random() * BOT_USERS.length)];
    // Multiplier for "organic" feel
    const increment = Math.floor(Math.random() * 50) + 10;
    auctionState.currentPrice += increment;
    auctionState.highestBidder = user;
    
    const bidEvent = {
      type: 'BID_EVENT',
      user,
      price: auctionState.currentPrice,
      timestamp: new Date().toISOString()
    };
    
    auctionState.history.push(bidEvent);
    if (auctionState.history.length > 10) auctionState.history.shift();
    
    broadcast(bidEvent);
    
    // System log for the bid
    broadcast({
      type: 'SYSTEM_LOG',
      level: 'INFO',
      message: `BID_ACCEPTED: ${user} -> Ξ ${(auctionState.currentPrice/1000).toFixed(3)}`,
      timestamp: new Date().toISOString()
    });
  }
}

// Timer & Transition Logic
setInterval(() => {
  if (auctionState.timeLeft > 0) {
    auctionState.timeLeft--;
    
    // High-frequency price update for broad UI
    broadcast({
      type: 'AUCTION_TICK',
      timeLeft: auctionState.timeLeft,
      price: auctionState.currentPrice,
      highestBidder: auctionState.highestBidder
    });
  } else {
    // Transition to next item
    auctionState.isActive = false;
    broadcast({ type: 'AUCTION_FINALIZING', winner: auctionState.highestBidder });
    
    setTimeout(() => {
      currentItemIndex = (currentItemIndex + 1) % AUCTION_ITEMS.length;
      const nextItem = AUCTION_ITEMS[currentItemIndex];
      auctionState = {
        item: nextItem,
        timeLeft: nextItem.duration,
        currentPrice: nextItem.basePrice,
        highestBidder: 'RESERVE_PRICE',
        history: [],
        isActive: true
      };
      
      broadcast({ type: 'AUCTION_NEW_ITEM', state: auctionState });
      broadcast({
        type: 'SYSTEM_LOG',
        level: 'WARN',
        message: `BUFFER_FLUSH: NEW_AUCTION_STARTED -> ${nextItem.title}`,
        timestamp: new Date().toISOString()
      });
    }, 5000); // 5s gap
  }
  
  simulateOrganicBid();
}, 1000);

// Random System Noise
setInterval(() => {
  const messages = [
    'SHARD_ENCRYPTION_SYNC: OK',
    'PEER_HANDSHAKE_INITIATED',
    'MEMPOOL_TRANSACTION_PENDING',
    'TUNNEL_RELAY_ESTABLISHED // HOP_04',
    'BRUTE_FORCE_SYNC_PENDING...',
    'VPN_TUNNEL_ROTATION: SUCCESS'
  ];
  broadcast({
    type: 'SYSTEM_LOG',
    level: 'DEBUG',
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toISOString()
  });
}, 3000);

fastify.get('/', async (request, reply) => {
  return { status: 'online', service: 'auction-engine', version: '2.1.0-organic', auction_state: auctionState.isActive ? 'ACTIVE' : 'IDLE' };
});

fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection) => {
    const socket = connection.socket;
    if (!socket) {
      fastify.log.error('WebSocket connection failed: socket undefined');
      return;
    }

    fastify.log.info('Client connected via WebSocket');
    connectedClients.add(socket);
    
    // Initial State Sync
    socket.send(JSON.stringify({ 
      type: 'AUCTION_SYNC', 
      state: auctionState 
    }));

    socket.on('close', () => {
      connectedClients.delete(socket);
      fastify.log.info('Client disconnected');
    });

    socket.on('error', (err) => {
      fastify.log.error(`WebSocket error: ${err.message}`);
      connectedClients.delete(socket);
    });
  });
});

try {
  await fastify.listen({ port: 3001, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
