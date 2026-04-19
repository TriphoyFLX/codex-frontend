// Vercel Serverless Function for API Proxy
const http = require('http');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Remove /api/proxy prefix and keep /api
  const path = req.url.replace('/api/proxy', '/api');
  const queryString = req.url.split('?')[1] || '';
  const targetUrl = `http://159.194.202.140:5000${path}${queryString ? '?' + queryString : ''}`;

  const options = {
    hostname: '159.194.202.140',
    port: 5000,
    path: path + (queryString ? '?' + queryString : ''),
    method: req.method,
    headers: {
      'Content-Type': req.headers['content-type'] || 'application/json',
      'Authorization': req.headers['authorization'] || '',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => {
      data += chunk;
    });
    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode);
      res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json');
      res.send(data);
    });
  });

  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  });

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }

  proxyReq.end();
};
