// Override global fetch to add error checking
const originalFetch = window.fetch;

window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await originalFetch(input, init);
  
  // Override json method
  response.json = async function() {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    if (!text.trim()) {
      throw new Error('Empty response');
    }
    
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Invalid JSON: ${text.substring(0, 100)}...`);
    }
  };
  
  return response;
};

export {};
