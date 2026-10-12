# Northstar — Career Coach Network

A responsive, single-page founder workspace for managing a private network of career coaches. Built with plain HTML, CSS, and JavaScript — no build step or third-party runtime dependencies.

## Run locally

Serve this directory with any static web server. For example:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`.

## Demo sign-in

- **Email:** `founder@northstar.io`
- **Password:** `founder123`

The credentials are pre-filled on the login screen. “Enter demo workspace” signs in immediately.

## Included

- Coach directory with live search and availability filters
- Create, edit, and delete coach profiles
- Profile details, avatar URL or color preset, remote status, skills, availability, and five social / web links
- Summary counts for coaches, availability, and distinct specialties
- LocalStorage persistence with a sample directory on first load
- Responsive desktop, tablet, and mobile layouts

Authentication is intentionally a client-side demo flow; it is not suitable for securing a production application without a server-side authentication service.
