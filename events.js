const EVENTS_API = '/api/events';
const ADMIN_LOGIN_API = '/api/admin/login';
const ADMIN_EVENTS_API = '/api/admin/events';
const ADMIN_TOKEN_KEY = 'simpsonEventsAdminToken';

const publicStatus = document.getElementById('events-public-status');
const eventsList = document.getElementById('events-list');
const adminAuth = document.getElementById('admin-auth');
const adminEditor = document.getElementById('admin-editor');
const loginForm = document.getElementById('admin-login-form');
const loginStatus = document.getElementById('admin-login-status');
const signOutButton = document.getElementById('admin-signout');
const editorStatus = document.getElementById('admin-editor-status');
const eventForm = document.getElementById('event-form');
const cancelEditButton = document.getElementById('event-cancel-edit');
const adminEventsList = document.getElementById('admin-events-list');

let events = [];
let writable = false;
let adminToken = localStorage.getItem(ADMIN_TOKEN_KEY) || '';

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const formatDate = value => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const setStatus = (target, message, isError = false) => {
  if (!target) return;
  target.textContent = message;
  target.classList.toggle('status-error', isError);
  target.classList.toggle('status-success', Boolean(message) && !isError);
};

const renderPublicEvents = () => {
  if (!eventsList) return;

  if (!events.length) {
    eventsList.innerHTML = '<p class="events-empty">No upcoming events yet. Please check back soon.</p>';
    return;
  }

  eventsList.innerHTML = events.map(event => {
    const imageMarkup = event.image ? `<img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" loading="lazy">` : '';
    const paymentMarkup = event.paypalLink
      ? `<a class="button button-primary" href="${escapeHtml(event.paypalLink)}" target="_blank" rel="noopener noreferrer">Pay with PayPal</a>`
      : '';

    return `<article class="event-card reveal visible">
      ${imageMarkup}
      <div class="event-card-body">
        <h3>${escapeHtml(event.title)}</h3>
        <p class="event-meta"><strong>Date:</strong> ${escapeHtml(formatDate(event.date))}</p>
        <p class="event-meta"><strong>Time:</strong> ${escapeHtml(event.time)}</p>
        <p class="event-meta"><strong>Location:</strong> ${escapeHtml(event.location)}</p>
        <p>${escapeHtml(event.description)}</p>
        ${paymentMarkup}
      </div>
    </article>`;
  }).join('');
};

const renderAdminEvents = () => {
  if (!adminEventsList) return;

  if (!events.length) {
    adminEventsList.innerHTML = '<li class="events-empty">No events created yet.</li>';
    return;
  }

  adminEventsList.innerHTML = events.map(event => `<li>
    <div>
      <strong>${escapeHtml(event.title)}</strong>
      <p>${escapeHtml(formatDate(event.date))} · ${escapeHtml(event.time)}</p>
    </div>
    <div class="admin-list-actions">
      <button type="button" class="button button-secondary" data-action="edit" data-id="${escapeHtml(event.id)}">Edit</button>
      <button type="button" class="button button-secondary" data-action="delete" data-id="${escapeHtml(event.id)}">Delete</button>
    </div>
  </li>`).join('');
};

const populateForm = event => {
  if (!eventForm) return;

  const idField = eventForm.elements.namedItem('id');
  const titleField = eventForm.elements.namedItem('title');
  const dateField = eventForm.elements.namedItem('date');
  const timeField = eventForm.elements.namedItem('time');
  const locationField = eventForm.elements.namedItem('location');
  const descriptionField = eventForm.elements.namedItem('description');
  const imageField = eventForm.elements.namedItem('image');
  const paypalField = eventForm.elements.namedItem('paypalLink');

  if (idField) idField.value = event.id || '';
  if (titleField) titleField.value = event.title || '';
  if (dateField) dateField.value = event.date || '';
  if (timeField) timeField.value = event.time || '';
  if (locationField) locationField.value = event.location || '';
  if (descriptionField) descriptionField.value = event.description || '';
  if (imageField) imageField.value = event.image || '';
  if (paypalField) paypalField.value = event.paypalLink || '';
};

const resetForm = () => {
  eventForm?.reset();
  const idField = eventForm?.elements.namedItem('id');
  if (idField) {
    idField.value = '';
  }
};

const toggleAdminView = isLoggedIn => {
  if (!adminAuth || !adminEditor) return;
  adminAuth.hidden = isLoggedIn;
  adminEditor.hidden = !isLoggedIn;
};

const fetchEvents = async () => {
  setStatus(publicStatus, 'Loading events...');

  try {
    const response = await fetch(EVENTS_API, { cache: 'no-store' });
    const payload = await response.json();

    if (!response.ok) throw new Error(payload.error || 'Unable to load events.');

    events = Array.isArray(payload.events) ? payload.events : [];
    writable = Boolean(payload.writable);
    renderPublicEvents();
    renderAdminEvents();
    setStatus(publicStatus, '');
    if (!writable) {
      setStatus(loginStatus, 'Event editing is disabled until server environment variables are configured.', true);
    }
  } catch {
    setStatus(publicStatus, 'Unable to load events right now. Please try again later.', true);
    events = [];
    renderPublicEvents();
  }
};

const authHeaders = () => ({
  'Content-Type': 'application/json; charset=utf-8',
  Authorization: ['Bearer ', adminToken].join('')
});

const saveEventsFromResponse = payload => {
  events = Array.isArray(payload.events) ? payload.events : [];
  renderPublicEvents();
  renderAdminEvents();
};

loginForm?.addEventListener('submit', async event => {
  event.preventDefault();
  setStatus(loginStatus, 'Signing in...');

  if (!loginForm.reportValidity()) {
    setStatus(loginStatus, 'Enter your username and password.', true);
    return;
  }

  const formData = new FormData(loginForm);
  const body = {
    username: String(formData.get('username') || '').trim(),
    password: String(formData.get('password') || '')
  };

  try {
    const response = await fetch(ADMIN_LOGIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body)
    });
    const payload = await response.json();

    if (!response.ok) throw new Error(payload.error || 'Unable to sign in.');

    adminToken = payload.token;
    localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
    toggleAdminView(true);
    loginForm.reset();
    setStatus(loginStatus, '');
    setStatus(editorStatus, 'Signed in successfully.');
  } catch (error) {
    setStatus(loginStatus, error.message, true);
  }
});

signOutButton?.addEventListener('click', () => {
  adminToken = '';
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  toggleAdminView(false);
  setStatus(editorStatus, 'Signed out.');
  setStatus(loginStatus, '');
  resetForm();
});

cancelEditButton?.addEventListener('click', () => {
  resetForm();
  setStatus(editorStatus, 'Edit cancelled.');
});

eventForm?.addEventListener('submit', async event => {
  event.preventDefault();

  if (!eventForm.reportValidity()) {
    setStatus(editorStatus, 'Please complete required fields and correct invalid links.', true);
    return;
  }

  const formData = new FormData(eventForm);
  const id = String(formData.get('id') || '').trim();
  const draft = {
    id,
    title: String(formData.get('title') || '').trim(),
    date: String(formData.get('date') || '').trim(),
    time: String(formData.get('time') || '').trim(),
    location: String(formData.get('location') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    image: String(formData.get('image') || '').trim(),
    paypalLink: String(formData.get('paypalLink') || '').trim()
  };

  const method = id ? 'PUT' : 'POST';
  setStatus(editorStatus, 'Saving event...');

  try {
    const response = await fetch(ADMIN_EVENTS_API, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(draft)
    });
    const payload = await response.json();

    if (!response.ok) throw new Error(payload.error || 'Unable to save event.');

    saveEventsFromResponse(payload);
    resetForm();
    setStatus(editorStatus, 'Event saved successfully.');
  } catch (error) {
    setStatus(editorStatus, error.message, true);
    if (error.message.includes('Unauthorized')) {
      adminToken = '';
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      toggleAdminView(false);
    }
  }
});

adminEventsList?.addEventListener('click', async event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.getAttribute('data-action');
  const id = button.getAttribute('data-id');
  const selectedEvent = events.find(item => item.id === id);
  if (!selectedEvent) return;

  if (action === 'edit') {
    populateForm(selectedEvent);
    setStatus(editorStatus, `Editing "${selectedEvent.title}".`);
    return;
  }

  if (action === 'delete') {
    const confirmDelete = window.confirm(`Delete event "${selectedEvent.title}"?`);
    if (!confirmDelete) return;

    setStatus(editorStatus, 'Deleting event...');

    try {
      const response = await fetch(ADMIN_EVENTS_API, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ id })
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || 'Unable to delete event.');

      saveEventsFromResponse(payload);
      resetForm();
      setStatus(editorStatus, 'Event deleted.');
    } catch (error) {
      setStatus(editorStatus, error.message, true);
    }
  }
});

const initializeAdminState = () => {
  if (!writable) {
    adminToken = '';
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    toggleAdminView(false);
    setStatus(loginStatus, 'Event editing is disabled until server environment variables are configured.', true);
    return;
  }

  if (adminToken) {
    toggleAdminView(true);
    setStatus(editorStatus, 'Signed in with existing session token.');
  } else {
    toggleAdminView(false);
  }
};

void fetchEvents().then(initializeAdminState);
