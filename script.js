const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

const closeMenu = () => {
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
};

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton?.focus();
  }
});

document.addEventListener('click', event => {
  if (!nav?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

document.getElementById('year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

const enquiryForm = document.getElementById('enquiry-form');
const formStatus = document.getElementById('form-status');
const copyButton = document.getElementById('copy-enquiry');
let enquiryText = '';

enquiryForm?.addEventListener('submit', event => {
  event.preventDefault();

  if (!enquiryForm.reportValidity()) return;

  const data = new FormData(enquiryForm);
  const firstName = data.get('First name').trim();
  const lastName = data.get('Last name').trim();
  const email = data.get('Email').trim();
  const interest = data.get('Interest');
  const message = data.get('Message').trim();

  enquiryText = `Hello Morag,\n\n${message}\n\nInterest: ${interest}\nName: ${firstName} ${lastName}\nEmail: ${email}`;
  const subject = `Lesson enquiry from ${firstName} ${lastName}`;
  const mailto = `mailto:morag@simplysingingschool.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText)}`;

  formStatus.hidden = false;
  window.location.href = mailto;
});

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(enquiryText);
    copyButton.textContent = 'Copied';
  } catch {
    window.prompt('Copy your enquiry, then email it to Morag:', enquiryText);
  }
});
