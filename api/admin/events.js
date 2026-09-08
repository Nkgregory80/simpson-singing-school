const { randomUUID } = require('crypto');
const { isAuthorizedAdmin } = require('../../lib/adminAuth');
const { readEvents, writeEvents, hasKvConfig } = require('../../lib/eventStore');

const respond = (res, status, payload) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(payload);
};

const normalizeEvent = input => ({
  id: input.id || randomUUID(),
  title: String(input.title || '').trim(),
  date: String(input.date || '').trim(),
  time: String(input.time || '').trim(),
  location: String(input.location || '').trim(),
  description: String(input.description || '').trim(),
  image: String(input.image || '').trim(),
  paypalLink: String(input.paypalLink || '').trim()
});

const validateEvent = event => {
  const errors = {};

  if (!event.title) errors.title = 'Title is required.';
  if (!event.date || Number.isNaN(Date.parse(event.date))) errors.date = 'Date is required.';
  if (!event.time) errors.time = 'Time is required.';
  if (!event.location) errors.location = 'Location is required.';
  if (!event.description) errors.description = 'Description is required.';

  if (event.image) {
    try {
      const imageUrl = new URL(event.image);
      if (!['http:', 'https:'].includes(imageUrl.protocol)) throw new Error();
    } catch {
      errors.image = 'Image must be a valid URL.';
    }
  }

  if (event.paypalLink) {
    try {
      const paypalUrl = new URL(event.paypalLink);
      if (!['http:', 'https:'].includes(paypalUrl.protocol) || !paypalUrl.hostname.includes('paypal.')) {
        throw new Error();
      }
    } catch {
      errors.paypalLink = 'PayPal link must be a valid paypal URL.';
    }
  }

  return errors;
};

const sortEvents = events => [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

module.exports = async (req, res) => {
  if (!isAuthorizedAdmin(req.headers.authorization)) {
    return respond(res, 401, { error: 'Unauthorized.' });
  }

  if (!hasKvConfig()) {
    return respond(res, 503, { error: 'Event editing requires KV environment variables on the server.' });
  }

  try {
    const { events } = await readEvents();

    if (req.method === 'POST') {
      const draft = normalizeEvent(req.body || {});
      const errors = validateEvent(draft);
      if (Object.keys(errors).length) return respond(res, 400, { error: 'Validation failed.', fields: errors });

      const nextEvents = sortEvents([...events, draft]);
      await writeEvents(nextEvents);
      return respond(res, 201, { events: nextEvents });
    }

    if (req.method === 'PUT') {
      const draft = normalizeEvent(req.body || {});
      if (!draft.id) return respond(res, 400, { error: 'Event id is required.' });

      const errors = validateEvent(draft);
      if (Object.keys(errors).length) return respond(res, 400, { error: 'Validation failed.', fields: errors });

      const index = events.findIndex(event => event.id === draft.id);
      if (index === -1) return respond(res, 404, { error: 'Event not found.' });

      const nextEvents = [...events];
      nextEvents[index] = draft;
      const sorted = sortEvents(nextEvents);
      await writeEvents(sorted);
      return respond(res, 200, { events: sorted });
    }

    if (req.method === 'DELETE') {
      const id = String(req.body?.id || '').trim();
      if (!id) return respond(res, 400, { error: 'Event id is required.' });

      const nextEvents = events.filter(event => event.id !== id);
      if (nextEvents.length === events.length) return respond(res, 404, { error: 'Event not found.' });

      await writeEvents(nextEvents);
      return respond(res, 200, { events: sortEvents(nextEvents) });
    }

    return respond(res, 405, { error: 'Method not allowed.' });
  } catch {
    return respond(res, 500, { error: 'Unable to update events right now.' });
  }
};
