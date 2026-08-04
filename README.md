# Simpson Singing School website

A simple, responsive one-page website built with plain HTML, CSS and JavaScript. It works well with GitHub, Visual Studio Code and GitHub Pages, with no build tools required.

## Open and edit in Visual Studio Code

1. Unzip the package.
2. Open Visual Studio Code.
3. Choose **File → Open Folder** and select `simpson-singing-school`.
4. Open `index.html` and edit the wording.
5. Edit colours and layout in `styles.css`.
6. Replace images in `assets/images` while keeping the same filenames, or update the image paths in `index.html`.

For an easy local preview, install the **Live Server** extension in Visual Studio Code, right-click `index.html`, then choose **Open with Live Server**.

## Main files

- `index.html` — all page wording and sections
- `styles.css` — colours, layout, fonts and mobile design
- `script.js` — mobile menu, current year and subtle reveal effects
- `CNAME` — GitHub Pages custom domain (`simpson-singing.school`)
- `robots.txt` and `sitemap.xml` — search crawler discovery
- `llms.txt` — concise, verified facts for AI systems and other machine readers
- `assets/icons/logo.svg` — editable vector logo
- `assets/icons/favicon.svg` — browser tab icon
- `assets/images/morag-portrait.jpg` — main portrait
- `assets/images/morag-piano.jpg` — piano image
- `assets/images/white-grand-piano.jpg` and `assets/images/yamaha-piano.jpg` — gallery images
- `assets/images/musical-midgies-badge.jpg` — children’s choir badge
- `assets/videos/music-making.mp4` — self-hosted gallery video

## Details to check before publishing

- Contact email: `Simpsonmorag@gmail.com`.
- Confirm whether displaying the full postcode is appropriate. It currently gives the general location as Westhill, Aberdeen AB32 6PY.
- Confirm written permission to publish identifiable people shown in photographs and video.
- Review the privacy and cookie policies before adding a hosted form, analytics, embedded media or other third-party services.

## Contact form

The included form prepares a pre-addressed message and opens the visitor’s email application. If that is unavailable, the visitor can copy the complete enquiry and send it manually. The website does not store or transmit form data itself.

## Policies and cookies

The footer links to the privacy notice, cookie policy, website terms, safeguarding policy and accessibility statement. The site does not currently set cookies or use analytics, advertising pixels, social media plugins or embedded third-party media, so it deliberately does not show a cookie consent banner. Update the cookie and privacy policies and add consent controls before introducing any non-essential tracking technology.

A better hosted option is Formspree, Basin or Netlify Forms. After choosing a provider, add its form action in `index.html` and update the submit handler in `script.js`:

```html
<form class="contact-form reveal" id="enquiry-form">
```

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `simpson-singing-school`.
2. Upload all files from this folder, ensuring `index.html` is at the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/root`, then save.
6. GitHub will provide the public website address after deployment.

## Custom domain

The configured public domain is `https://simpson-singing.school/`. The root `CNAME` file preserves this setting during GitHub Pages deployments. The domain’s DNS should point to GitHub Pages and **Enforce HTTPS** should be enabled in the repository’s Pages settings.

## Search and AI discovery

The homepage includes canonical, Open Graph and Schema.org `MusicSchool` metadata. `robots.txt` permits crawling, `sitemap.xml` lists all public pages, and `llms.txt` provides a concise factual summary. Update the schema, sitemap dates and `llms.txt` whenever prices, contact details, services or choir schedules change.

## Brand colours

- Deep teal: `#073f51`
- Teal: `#0c6270`
- Gold: `#d19a39`
- Pale gold: `#f1d89a`
- Cream: `#fffaf0`

These are defined at the top of `styles.css` under `:root` for quick editing.
