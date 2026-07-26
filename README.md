# Herbionix LLP — Website (flat file structure)

This version has every file in one folder — no subfolders — so it uploads cleanly through GitHub's drag-and-drop web interface without worrying about folder structure.

## File structure

```
├── index.html
├── style.css
├── script.js
├── favicon.svg
├── og-image.png
├── robots.txt
├── sitemap.xml
└── README.md
```

## Push this to GitHub

**Easiest — GitHub web upload:**
1. Create a new repo at github.com/new (don't add a README/license, to keep it empty).
2. Open the repo, click **Add file → Upload files**.
3. Drag in every file from this folder at once (select them all, or drag the whole selection — since there are no subfolders here, this always works regardless of browser).
4. Commit the upload.

**Or via command line, from inside this folder:**
```bash
git init
git add .
git commit -m "Initial commit — Herbionix site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Host it free with GitHub Pages

1. In your repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Set **Branch** to `main`, folder to `/ (root)`, then **Save**.
4. Your live URL will be `https://<your-username>.github.io/<your-repo>/` — takes a minute or two to go live.

## Before you make it public — replace these placeholders

1. **Contact details** in `index.html` — search for `connect@herbionix.in`, `+91 98XXX`, `Maharashtra, India` and swap for your real ones.
2. **Domain references** in `robots.txt`, `sitemap.xml`, and the `og:url` tag in `index.html` — replace `herbionix.in` with your real domain or your `github.io` URL.
3. **Contact form**: it currently just shows an on-page confirmation, it doesn't send anywhere (GitHub Pages has no backend). Sign up at [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com), then add `action="your-endpoint-url" method="POST"` to `<form class="contact-form" data-contact-form>` in `index.html`.
4. **Founder bio & product claims** — written from your outline; verify every factual claim before publishing, since this is a healthcare product site.
5. **Product imagery** — no product photography yet; add real photos when available.
6. **Legal** — the disclaimer wording is generic; have it reviewed against actual Ayurvedic labeling regulations (AYUSH/FSSAI as applicable).

## Local preview

Open `index.html` directly in a browser, or run:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
