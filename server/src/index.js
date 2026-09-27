const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { runDualAgentWorkflow } = require('./services/dualAgentEngine');
const { searchWeb } = require('./services/searchService');

const app = express();
const PORT = process.env.PORT || 3001;

// Path to compiled frontend
const clientDist = path.join(__dirname, '../../client/dist');

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(clientDist));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Dual-Agent Consensus Engine API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Real-time Server-Sent Events (SSE) chat stream
app.post('/api/chat/stream', async (req, res) => {
  const { query, keys = {} } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  console.log(`[DualAgent Backend] Incoming research query: "${query}"`);

  // Set SSE response headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Helper to send formatted SSE message
  const sendEvent = (event, data) => {
    try {
      if (!res.writableEnded && res.writable) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      }
    } catch (e) {
      console.error('Error writing to SSE stream:', e.message);
    }
  };

  // Keep-alive heartbeat interval
  const heartbeat = setInterval(() => {
    if (!res.writableEnded && res.writable) {
      res.write(': keep-alive\n\n');
    }
  }, 15000);

  // Clean up heartbeat on connection close
  res.on('close', () => {
    clearInterval(heartbeat);
  });

  try {
    await runDualAgentWorkflow({
      query: query.trim(),
      keys,
      onEvent: (event, data) => {
        sendEvent(event, data);
      }
    });
  } catch (err) {
    sendEvent('error', { message: err.message || 'Stream processing error' });
  } finally {
    clearInterval(heartbeat);
    if (!res.writableEnded) {
      res.end();
    }
  }
});

// Standalone search endpoint
app.post('/api/search', async (req, res) => {
  const { query, tavilyKey, maxResults } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await searchWeb(query, {
      tavilyKey,
      maxResults: maxResults || 5
    });
    res.json({ query, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend on root or non-API routes (Express 5 compatible)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.redirect('http://localhost:5173');
  }
});

app.listen(PORT, () => {
  console.log(`[DualAgent Backend] Server running on http://localhost:${PORT}`);
});
