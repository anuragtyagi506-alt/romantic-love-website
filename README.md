# My Love Apology Website

A romantic, fully responsive apology website made with HTML, CSS, and JavaScript.

## Open locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Configure the password and content

- Password: update `js/script.js` in `config.firstMeetingDate`
- Music file: `assets/music/gujarish.mp3`
- Photo: replace `assets/images/girlfriend-photo.jpg`
- Letter text: edit the content inside the letter block in `index.html`

## Notes

- The login screen is protected by the exact first-meeting date.
- The music player stays active between login and the main page.
- The photo and music are stored locally in the project so they can be replaced easily.
