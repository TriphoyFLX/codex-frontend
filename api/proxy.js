const BACKEND_URL = 'http://159.194.202.140:5000';

export default async function handler(req: any, res: any) {
  const { method, url, headers, body } = req;
  const path = url?.replace('/api/proxy', '') || '';
  
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers.authorization && { Authorization: headers.authorization }),
      },
      ...(method !== 'GET' && body && { body: JSON.stringify(body) }),
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error' });
  }
}
