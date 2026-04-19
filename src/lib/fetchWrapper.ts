export const safeJsonParse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();
  if (!text) {
    throw new Error('Empty response');
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
};

export const safeFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  return safeJsonParse(response);
};
