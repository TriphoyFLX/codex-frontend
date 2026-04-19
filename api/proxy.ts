const BACKEND_URL = 'http://159.194.202.140:5000';

export default async function handler(req: any, res: any) {
  const { method, query, url } = req;
  const path = url?.replace('/api/proxy', '') || '';
  
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      ...(method !== 'GET' && { body: JSON.stringify(req.body) }),
    });
    
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch from backend' });
  }
}
