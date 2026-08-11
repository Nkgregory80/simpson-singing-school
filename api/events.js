const { readEvents } = require('../lib/eventStore');

const respond = (res, status, payload) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(payload);
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return respond(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const { events, writable } = await readEvents();
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    return respond(res, 200, { events: sortedEvents, writable });
  } catch {
    return respond(res, 500, { error: 'Unable to load events at the moment.' });
  }
};
