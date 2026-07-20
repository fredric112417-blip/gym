const { exec } = require('child_process');
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is running on ${url}`);

  // Automatically open the browser
  const startCommand = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${startCommand} ${url}`, (err) => {
    if (err) {
      console.error('Failed to open browser automatically:', err.message);
    }
  });
});
