const express = require('express');
const router = express.Router();

/* ------------------------------------------------------------------
 * Part A: Traditional application
 * Browser -> HTML Form -> Express -> HTML Response
 * The browser navigates to this URL and shows the HTML we send back
 * as a brand-new page (full page reload).
 * ------------------------------------------------------------------ */
router.post('/readCustomerInfoAndRespond', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  res.send('Welcome ' + name + '<br>We will contact you at ' + email);
});

/* ------------------------------------------------------------------
 * Part B: Modern REST version
 * Browser JavaScript -> fetch() -> Express REST API -> JSON -> Dynamic page update
 * Same business logic as Part A. Only the response format changes:
 * JSON data instead of an HTML page.
 * ------------------------------------------------------------------ */
router.post('/api/customer', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;

  // A REST API reports problems with a status code + JSON, not an HTML error page.
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  res.json({
    message: 'Welcome ' + name,
    email: email,
  });
});

module.exports = router;
