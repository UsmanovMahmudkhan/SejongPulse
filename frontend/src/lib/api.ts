const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchPulses() {
  const res = await fetch(`${API_BASE_URL}/pulses`);
  if (!res.ok) throw new Error('Failed to fetch pulses');
  return res.json();
}

export async function translatePulse(content: string, targetLang: string = 'ko') {
  const res = await fetch(`${API_BASE_URL}/pulses/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, target_lang: targetLang }),
  });
  if (!res.ok) throw new Error('Failed to translate pulse');
  return res.json();
}

export async function fetchRecommendations(userId: string) {
  const res = await fetch(`${API_BASE_URL}/recommendations/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function queryAdvisor(query: string) {
  const res = await fetch(`${API_BASE_URL}/advisor/query?query=${encodeURIComponent(query)}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to query advisor');
  return res.json();
}
