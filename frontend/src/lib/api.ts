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

export async function queryAdvisor(query: string, userId?: string) {
  const url = `${API_BASE_URL}/advisor/query?query=${encodeURIComponent(query)}${userId ? `&user_id=${userId}` : ''}`;
  const res = await fetch(url, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to query advisor');
  return res.json();
}

export async function likePulse(pulseId: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/pulses/${pulseId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to like pulse');
  return res.json();
}

export async function fetchComments(pulseId: string) {
  const res = await fetch(`${API_BASE_URL}/pulses/${pulseId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function addComment(pulseId: string, content: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/pulses/${pulseId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, content }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function createPulse(content: string, userId: string, category: string, building: string) {
  const res = await fetch(`${API_BASE_URL}/pulses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, content, category, building_tag: building }),
  });
  if (!res.ok) throw new Error('Failed to create pulse');
  return res.json();
}
