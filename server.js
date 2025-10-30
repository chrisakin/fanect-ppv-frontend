import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve .well-known files with correct Content-Type
app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(join(__dirname, 'dist', '.well-known', 'apple-app-site-association'));
});

app.get('/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(join(__dirname, 'dist', '.well-known', 'apple-app-site-association'));
});

app.get('/.well-known/assetlinks.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(join(__dirname, 'dist', '.well-known', 'assetlinks.json'));
});

app.get("/deeplink", (req, res) => {
  const iosStore = "https://apps.apple.com/app/id123456789"; // <-- replace with your App Store link
  const androidStore = "https://play.google.com/store/apps/details?id=com.fanect.ppv";
  const appDeepLink = `fanectppv://deeplink?user_id=${req.query.user_id}&eventId=${req.query.eventId}`;
  const userAgent = req.headers["user-agent"]?.toLowerCase() || "";
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  // :large_green_circle: STEP 1: Handle Apple / Google validation & background prefetches
  const isBackgroundCheck =
    req.headers["purpose"] === "prefetch" ||
    req.headers["x-purposes"] === "preview" ||
    userAgent.includes("applebot") ||
    userAgent.includes("mobilesafari/");
  if (isBackgroundCheck) {
    return res.status(204).end(); // :white_check_mark: No redirect, prevents iOS bounce
  }
  // :large_orange_circle: STEP 2: Detect Chrome on iOS (Crios)
  const isChromeOniOS = userAgent.includes("crios/");
  if (isChromeOniOS) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FaNect PPV</title>
      </head>
      <body style="font-family: system-ui, sans-serif; text-align:center; padding-top:40vh;">
        <p>Open this link in Safari to continue to the app.</p>
        <p style="margin-top:20px;">
          Or <a href="${iosStore}" target="_blank" style="color:#007AFF;">download the app from the App Store</a>.
        </p>
      </body>
      </html>
    `);
  }
  // :large_purple_circle: STEP 3: Handle iOS Universal Links (serve static fallback page)
  if (isIOS) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FaNect PPV</title>
      </head>
      <body style="font-family: system-ui, sans-serif; text-align:center; padding-top:40vh;">
        <p>Continue to event in your app:</p>
        <a href="${appDeepLink}"
           style="display:inline-block;margin-top:20px;background:#007AFF;color:#fff;
           padding:12px 20px;border-radius:8px;text-decoration:none;">Open in App</a>
        <p style="margin-top:15px;">
          Don’t have the app? <a href="${iosStore}" target="_blank">Get it on the App Store</a>
        </p>
      </body>
      </html>
    `);
  }
  // :large_green_circle: STEP 4: Handle Android deep link
  if (isAndroid) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Opening Fanect...</title>
        <script>
          window.onload = function() {
            window.location = "${appDeepLink}";
            setTimeout(() => { window.location = "${androidStore}"; }, 1500);
          };
        </script>
      </head>
      <body style="font-family: system-ui, sans-serif; text-align:center;padding-top:40vh;">
        <p>Opening FaNect...</p>
      </body>
      </html>
    `);
  }
  // :large_blue_circle: Default fallback (unknown device)
  res.redirect(androidStore);
});

// app.get("/deeplink", (req, res) => {
//   const iosStore = "https://apps.apple.com/app/id123456789";
//   const androidStore = "https://play.google.com/store/apps/details?id=com.fanect.ppv";
//   const appDeepLink = `fanectppv://event?user_id=${req.query.user_id}&eventId=${req.query.eventId}`;
//   const userAgent = req.headers["user-agent"]?.toLowerCase() || "";
//   // For Apple validation
//   if (userAgent.includes("applebot") || userAgent.includes("googlebot")) {
//     return res.status(200).send("Validation OK");
//   }
//   // Detect platform
//   const isAndroid = /android/i.test(userAgent);
//   const isIOS = /iphone|ipad|ipod/i.test(userAgent);
//   if (isIOS) {
//     // :x: Don't use window.location for iOS universal links
//     // :white_check_mark: Just serve a simple HTML landing page
//     return res.send(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>FaNect PPV</title>
//       </head>
//       <body style="font-family: system-ui, sans-serif; text-align: center; padding-top: 40vh;">
//         <p>Continue to event in your app:</p>
//         <a href="${appDeepLink}" style="display:inline-block;margin-top:20px;background:#007AFF;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Open in App</a>
//         <p style="margin-top:15px;">Don’t have the app? <a href="${iosStore}">Get it on the App Store</a></p>
//       </body>
//       </html>
//     `);
//   }
//   if (isAndroid) {
//     // :white_check_mark: Safe redirect flow for Android
//     return res.send(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>Opening App...</title>
//         <script>
//           window.onload = function() {
//             window.location = "${appDeepLink}";
//             setTimeout(() => { window.location = "${androidStore}"; }, 1500);
//           };
//         </script>
//       </head>
//       <body style="font-family: system-ui, sans-serif; text-align:center;padding-top:40vh;">
//         <p>Opening Fanect...</p>
//       </body>
//       </html>
//     `);
//   }
//   // Default fallback
//   res.redirect(androidStore);
// });

// app.get("/deeplink", (req, res) => {
//   const iosStore = "https://apps.apple.com/app/id123456789"; // your real iOS app link
//   const androidStore = "https://play.google.com/store/apps/details?id=com.fanect.ppv";
//   const appDeepLink = `fanectppv://event?user_id=${req.query.user_id}&eventId=${req.query.eventId}`;

//   // Detect Apple/Google validation bots → must return 200, not redirect
//   const userAgent = req.headers["user-agent"]?.toLowerCase() || "";
//   if (userAgent.includes("applebot") || userAgent.includes("googlebot")) {
//     return res.status(200).send("Validation OK");
//   }

//   // Serve HTML page that attempts app open, then store redirect
//   res.send(`
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta name="viewport" content="width=device-width, initial-scale=1" />
//       <title>Opening App...</title>
//       <script>
//         const isAndroid = /android/i.test(navigator.userAgent);
//         const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

//         window.onload = function() {
//           const appLink = "${appDeepLink}";
//           window.location = appLink;

//           setTimeout(() => {
//             if (isIOS) {
//               window.location = "${iosStore}";
//             } else if (isAndroid) {
//               window.location = "${androidStore}";
//             } else {
//               window.location = "https://${req.headers.host}";
//             }
//           }, 1500);
//         };
//       </script>
//       <style>
//         body {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: 100vh;
//           font-family: system-ui, sans-serif;
//         }
//       </style>
//     </head>
//     <body>
//       <p>Opening Fanect...</p>
//     </body>
//     </html>
//   `);
// });

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Redirect www to non-www
app.use((req, res, next) => {
    if (req.hostname && req.hostname.startsWith('www.')) {
        return res.redirect(301, `https://${req.hostname.slice(4)}${req.url}`);
    }
    next();
});

// Catch-all route to serve index.html for any unmatched routes (supports client-side routing)
app.get('*', function (req, res) {
    // Only serve index.html for requests that do NOT contain a dot (.)
    if (!req.path.includes('.')) {
        res.sendFile(join(__dirname, 'dist', 'index.html'));
    } else {
        res.status(404).end();
    }
});

// Start the server on the specified port (or 8080 by default)
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});