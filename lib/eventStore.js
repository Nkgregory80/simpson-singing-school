const fs = require('fs/promises');
const path = require('path');

const EVENTS_KEY = process.env.EVENTS_KV_KEY || 'simpson_singing_school_events';
const SEED_PATH = path.join(process.cwd(), 'assets', 'data', 'events.seed.json');

const readSeedEvents = async () => {
  const seed = await fs.readFile(SEED_PATH, 'utf8');
  const parsed = JSON.parse(seed);
  return Array.isArray(parsed) ? parsed : [];
};

const hasKvConfig = () => Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

const kvRequest = async (method, command, body) => {
  const authHeader = 'Bearer '.concat(process.env.KV_REST_API_TOKEN || '');
  const response = await fetch(`${process.env.KV_REST_API_URL}${command}`, {
    method,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    body
  });

  if (!response.ok) {
    throw new Error(`KV request failed with status ${response.status}`);
  }

  return response.json();
};

const readEvents = async () => {
  if (!hasKvConfig()) {
    return { events: await readSeedEvents(), writable: false };
  }

  const result = await kvRequest('GET', `/get/${encodeURIComponent(EVENTS_KEY)}`);
  if (!result || !result.result) {
    const seeded = await readSeedEvents();
    await writeEvents(seeded);
    return { events: seeded, writable: true };
  }

  let parsed = [];
  try {
    parsed = JSON.parse(result.result);
  } catch {
    parsed = [];
  }

  return { events: Array.isArray(parsed) ? parsed : [], writable: true };
};

const writeEvents = async events => {
  if (!hasKvConfig()) {
    throw new Error('Event storage is read-only until KV environment variables are configured.');
  }

  const value = encodeURIComponent(JSON.stringify(events));
  await kvRequest('POST', `/set/${encodeURIComponent(EVENTS_KEY)}/${value}`);
};

module.exports = {
  readEvents,
  writeEvents,
  hasKvConfig
};
