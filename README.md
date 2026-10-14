# Lab-N3.2
Marianna Belmares, Nico Savaides, Brent Paterson, Alexandra Guttierez

---

# From HTML Forms to REST/JSON APIs

One Express app, two ways to send the same customer info to the server:

| | Part A: Traditional | Part B: REST |
|---|---|---|
| Flow | Browser → HTML Form → Express → **HTML Response** | Browser JavaScript → `fetch()` → Express REST API → **JSON** → Dynamic page update |
| Route | `POST /readCustomerInfoAndRespond` | `POST /api/customer` |
| Request body | `application/x-www-form-urlencoded` (`name=Mari&email=...`) | `application/json` (`{"name":"Mari","email":"..."}`) |
| Response | HTML text (`Welcome Mari<br>We will contact you at ...`) | JSON (`{"message":"Welcome Mari","email":"..."}`) |
| Page | Browser navigates to a **new page** (full reload) | **Same page**; only the result box changes |

Both are on the home page side by side. The **"Page loaded at"** time at the top only changes on a full page load. It resets after a Part A submit, but stays the same after a Part B submit. That shows the page updates without a reload.

## Run it

```
npm install
npm start          # → http://localhost:3000
npm test           # automated checks for both endpoints
```
Requires Node.js 20+.

## Project structure

```
app.js                    Express setup: urlencoded parser (Part A), JSON parser (Part B), static files
bin/www                   Starts the server (PORT env var or 3000)
routes/index.js           Both routes: /readCustomerInfoAndRespond (HTML) and /api/customer (JSON)
public/index.html         Part A <form> and Part B inputs + Submit button + result box
public/js/customer.js     Part B fetch() call and dynamic page update
public/css/style.css      Styles
test/routes.test.js       node:test checks for both endpoints
```

## The code

**Part A route (unchanged from the existing app):**
```js
router.post('/readCustomerInfoAndRespond', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  res.send('Welcome ' + name + '<br>We will contact you at ' + email);
});
```

**Part B route (new REST endpoint):**
```js
router.post('/api/customer', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  res.json({ message: 'Welcome ' + name, email: email });
});
```

**Part B client (`public/js/customer.js`):**
```js
document.getElementById('submitBtn').addEventListener('click', async () => {
  const response = await fetch('/api/customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
    }),
  });
  const data = await response.json();
  // update only the result box; no page reload
  ...
});
```

### What we changed beyond the handout
- **`app.js` has two body parsers.** `express.urlencoded()` reads the HTML form fields and `express.json()` reads the `fetch()` JSON body. Without the right parser, `req.body` is empty.
- **The REST endpoint validates input.** It returns `400` with a JSON `{ error }` when the name or email is missing, because an API reports errors with a status code plus JSON, not an HTML error page.
- **The result is written with `textContent` / `<br>` elements instead of `innerHTML`.** The output looks the same, but HTML a user types into the form can't run on the page.
- **"Page loaded at" time and a "Raw JSON" panel** make it visible that there's no reload and show exactly what the API returned.
- **Automated tests (`npm test`)** check that Part A returns HTML, Part B returns JSON, and missing fields give a 400.

## Deliverables checklist
1. ✅ Traditional HTML form still works: Part A posts to `/readCustomerInfoAndRespond` and the browser shows the HTML reply.
2. ✅ New REST endpoint returns JSON: `POST /api/customer` → `{"message":"Welcome Mari","email":"mari@example.com"}`.
3. ✅ JavaScript `fetch()` calls the endpoint: `public/js/customer.js`.
4. ✅ Page updates dynamically without a reload: the result box fills in, and "Page loaded at" doesn't change.
5. ✅ Differences between the architectures: see below.

Test the API directly:
```
curl -X POST http://localhost:3000/api/customer \
  -H "Content-Type: application/json" \
  -d '{"name":"Mari","email":"mari@example.com"}'
```

## Differences between the two architectures

| | Traditional form (server-rendered) | REST API + `fetch()` |
|---|---|---|
| Who sends the request | The **browser**, because the `<form action method>` tells it to | **JavaScript** on the page |
| Data format sent | URL-encoded form fields | JSON |
| What the server returns | A finished **HTML page** (presentation + data mixed) | **Data only** (JSON); the client decides how to show it |
| What the user sees | Full page reload / navigation, page state lost | Same page stays; only part of it updates |
| Where the UI is built | On the **server** | On the **client** (plain JS, React, mobile app, …) |
| Reusability | Response only fits this one page | Same JSON API can serve a website, a mobile app, another server, or an AI agent |
| Errors | Usually an HTML error page | HTTP status code + JSON error the client can handle |
| Works without JavaScript | Yes | No |
| SEO / first load | Simple; HTML arrives ready | Needs JS to run first (unless server-side rendered) |

**The business logic barely changed.** Both routes read `req.body.name` and `req.body.email` the same way. The only differences are the body parser and `res.send(html)` vs. `res.json(data)`. Separating data (the API) from presentation (the page) lets one backend serve many different frontends.

**Both are still widely used.** Server-rendered apps (forms, templates) are simple, fast on first load, and work without JS. SPAs and mobile apps talk to REST APIs with `fetch()`. Our Smart Speech Coach labs (N3.3/N3.4) use exactly this REST model: the React frontend `fetch()`es an AI-enabled Express backend and gets JSON back.
