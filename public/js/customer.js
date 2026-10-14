// Show when this page was loaded. fetch() calls do NOT change it,
// which proves the page is updated without a reload.
document.getElementById('loadedAt').textContent = new Date().toLocaleTimeString();

// Part B: send the form data to the REST endpoint with fetch() and update the page.
document.getElementById('submitBtn').addEventListener('click', async () => {
  const result = document.getElementById('result');
  const rawJson = document.getElementById('rawJson');

  try {
    const response = await fetch('/api/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
      }),
    });

    const data = await response.json();
    rawJson.textContent = JSON.stringify(data, null, 2);

    if (!response.ok) {
      result.className = 'result error';
      result.textContent = data.error;
      return;
    }

    // Update only this part of the page with the JSON data.
    // (The lab handout uses innerHTML with "<br>". Building the text with
    // textContent does the same thing but can't run HTML a user typed in.)
    result.className = 'result ok';
    result.replaceChildren(
      document.createTextNode(data.message),
      document.createElement('br'),
      document.createTextNode(data.email)
    );
  } catch (error) {
    result.className = 'result error';
    result.textContent = 'Could not reach the server: ' + error.message;
  }
});
