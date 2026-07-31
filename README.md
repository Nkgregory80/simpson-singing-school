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
- `assets/icons/logo.svg` — editable vector logo
- `assets/icons/favicon.svg` — browser tab icon
- `assets/images/morag-portrait.jpg` — main portrait
- `assets/images/morag-piano.jpg` — piano image

## Details to check before publishing

- The supplied email address is `morag@simplysingingschool.co.uk`. Confirm this is still correct now the name has changed from Simply Singing School to Simpson Singing School.
- Confirm choir prices and exact session times. The site currently says to contact Morag for availability.
- Confirm whether displaying the full postcode is appropriate. It currently gives the general location as Westhill, Aberdeen AB32 6PY.
- Add a privacy notice before collecting information through a hosted contact form.

## Contact form

The included form prepares a pre-addressed message and opens the visitor’s email application. If that is unavailable, the visitor can copy the complete enquiry and send it manually. The website does not store or transmit form data itself.

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

When the final domain is purchased, add it in **Settings → Pages → Custom domain** and follow GitHub’s DNS instructions. A domain such as `simpsonsingingschool.co.uk` should be checked for availability before purchase.

## Brand colours

- Deep teal: `#073f51`
- Teal: `#0c6270`
- Gold: `#d19a39`
- Pale gold: `#f1d89a`
- Cream: `#fffaf0`

These are defined at the top of `styles.css` under `:root` for quick editing.
