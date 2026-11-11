# Hanzi Habit — Google Sign-in Edition

Mobile-friendly HSK 5 trainer hosted on GitHub Pages, with Google sign-in and Firestore cloud progress.

## One-time Firebase setup

1. Open https://console.firebase.google.com and create a Firebase project.
2. Go to **Build > Authentication > Get started > Sign-in method** and enable **Google**. Choose a support email and save.
3. Go to **Build > Firestore Database > Create database**. Choose a region and create the database. In **Rules**, replace the default rules with the exact contents of `firestore.rules` and click **Publish**. These rules are essential: each user can only access their own document.
4. Go to **Project settings** (gear icon) > **General** > **Your apps** > **Web** (`</>`). Register the app and copy the Firebase config values into `firebase-config.js`. The `measurementId` is optional. Do not put admin SDK keys or service account secrets into the website.
5. In **Authentication > Settings > Authorized domains**, add your GitHub Pages host, typically `YOURNAME.github.io` (host only, no `https://` and no repository path). If testing locally, add `localhost` too.
6. Upload `index.html`, `styles.css`, `app.js`, `auth.js`, `firebase-config.js`, and `vocabulary.json` to the ROOT of your GitHub repository. Do not upload the old Cloudflare worker or old `config.js`.
7. In GitHub **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. Open your published HTTPS URL and click **Continue with Google**.

You may need to allow popups for the site. Firebase Google popup sign-in works on most modern browsers. Some privacy-restricted mobile browsers can block popup or redirect flows; try Chrome or Safari if that happens. Firebase's redirect authentication on a third-party hosted domain can require additional setup depending on browser restrictions; popup is the default.

## Saving and account privacy

- Every signed-in user gets a separate Firestore document under `users/{Google uid}`.
- Progress is saved in this browser immediately and uploaded to Firestore shortly afterward.
- The same Google account on a second device retrieves the cloud copy.
- A green cloud-saved message in Settings confirms the last upload; an offline message means only the local copy is saved for now.
- The site does not request access to Gmail messages; Google sign-in provides basic account identity.
- Do not publish a Firestore database with open rules. Keep `firestore.rules` deployed.
- The app is not designed for simultaneous study sessions on two devices. It merges totals using maxima, which can undercount concurrent independent activity. Let the first device finish syncing before opening the second.

## Migrating old progress

The old username version and this Google version use different local storage keys. **Before replacing your old website**, sign in to the old version, go to Settings and **Export progress**. On the new Google version, sign in and choose **Import progress** in Settings. Your imported progress is then saved to your Google account. Keep the backup JSON until you've confirmed cloud sync on a second device.

## Study rules

The first 100 numbered syllabus entries unlock initially. Daily target: 50 questions mixing new items and reviews. Front of a question has no Pinyin/English hint. Feedback reveals Pinyin, meaning and an example where available. Errors require immediate correction; retries do not count toward mastery. After 11 independent correct answers an entry is retired. New entries unlock in groups of 10 after 70% of unlocked entries have two correct answers. The included dataset currently ends at entry 111. Grammar studio uses basic checks, not AI feedback.

## Limits

- Firebase free-tier quotas and service availability apply. Firestore writes are per saved study state, not per individual vocabulary word.
- The typed-English grader has a limited synonym list and may reject a valid paraphrase.
- Vocabulary data includes some adapted examples rather than exact syllabus quotations.
- Use a local web server for local development (`python -m http.server 8000`), not `file://`.
