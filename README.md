# Landon Lawrence A. Peralta — Portfolio

Static, dependency-free portfolio site: six HTML pages sharing one stylesheet and one script.

## Pages

| # | File | Content |
|---|------|---------|
| 01 | `index.html` | Hero, introduction, Educational Background |
| 02 | `experience.html` | Professional Experience |
| 03 | `organizations.html` | Organizations |
| 04 | `projects.html` | Projects |
| 05 | `skills.html` | Skills & Technologies |
| 06 | `certificates.html` | Certificates, filterable by category (click a certificate to enlarge) |

## Files

- `style.css` — design tokens (top of file), layout and components. Mobile-first.
- `main.js` — renders the shared header/nav, prev/next pager and footer from one `PAGES` list; scroll reveals; the two contact panels ("Message me" and "Hire Me"); the certificate filter and lightbox.
- `.htmlvalidate.json` — lint config for `html-validate`.

## Running locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

## Images

Put these in the same folder as the HTML files (names are case-sensitive on most hosts):

`LandonIndex.png`, `College.jpeg`, `SHS.jpeg`, `JHS.png`, `EmpleyadoCognitif.jpeg`, `GlobeIntern.jpg`,
`JBECP_New.png`, `AWS.png`, `ASCII.png`, `JBECP.jpg`, `ShiftOut.png`, `GDG.png`,
`PBA-X.png`, `IntroToCybersec.png`, `Globe.png`, `Ton.png`, `jbecpmainnet.png`, `CodeQuest.png`,
`CommunityDay.png`, `Collabothon.png`, `Siyensining.jpg`, `Webinar.jpg`

A missing image shows a neutral placeholder instead of breaking the layout.

## Certificate categories

Each certificate's `<li>` in `certificates.html` has a `data-category`:
`project-management`, `cybersecurity` or `others`. Change the value to move a certificate;
the filter counts update automatically. Categories can be linked directly, e.g. `certificates.html#cybersecurity`.

## Hire Me options

The opportunity types (Internship / OJT, Employment, Freelance / Contract, Speaking Engagement,
Event Collaboration, Something Else) live in the `OPPORTUNITIES` list at the top of `main.js`.

## Enabling the contact forms

Both the "Message me" and "Hire Me" panels validate input but **do not send anything until an endpoint is configured**.
Until then they tell the visitor the message was not sent and offer a pre-filled email instead.

1. Create a free form at a service such as [Formspree](https://formspree.io) (target: `peraltalandonlawrence@gmail.com`).
2. In `main.js`, set `const CONTACT_ENDPOINT = "https://formspree.io/f/your-id";`
3. Deploy. Both forms POST JSON (`kind`, `name`, `email`, `message`, plus `type`, `organization`, `timeline` for Hire Me, and a ready-made `_subject`) and only show a "sent" message on a successful (2xx) response.

Form endpoints like this are designed to be public. Never put a private API key in `main.js`.

## To-dos for the owner

- The Facebook, GitHub and LinkedIn icons link to each site's homepage — replace them with your profile URLs (`index.html`, marked `TODO`).
- The portrait loads `LandonIndex.png` and automatically falls back to `LandonIndex.jpg`.

## Lint

```bash
npx html-validate *.html
```
