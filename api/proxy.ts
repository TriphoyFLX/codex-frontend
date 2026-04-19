export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/proxy', '');
  const searchParams = url.search;
  
  const response = await fetch(`http://159.194.202.140:5000${path}${searchParams}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers.get('authorization') && { Authorization: req.headers.get('authorization')! }),
    },
    ...(req.method !== 'GET' && req.body && { body: req.body }),
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
