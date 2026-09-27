# Leddeo · web app

> **Archived (2023).** Leddeo was a SaaS I built and ran in early 2023. The code stays here as a record; it is no longer maintained.

The user-facing app of Leddeo: upload a video, get automatic subtitles, edit them in the browser, translate them, and download the video with the subtitles burned in. The API is [leddeo-backend](https://github.com/carlo-coding/leddeo-backend), which does the speech recognition (Whisper), translation (Argos Translate) and rendering.

## What is in it

- **Subtitle editor in the browser:** edit the text and timing of each segment on a timeline, with checks so segments never overlap, and pick font, colour, background and position before rendering.
- **Upload flows** for a video, or for a video plus an existing `.srt` file.
- **Wait-time countdown** while a job runs, from the backend's estimates.
- **Accounts:** email sign-up with verification, Google sign-in, profile, history of past jobs.
- **Plans and billing** through Stripe checkout and the customer portal.
- **Landing page, FAQs, terms,** and the interface in more than one language.

## Stack

React · TypeScript · Vite · Redux Toolkit · Material UI · Formik and Yup · Framer Motion
