document.querySelectorAll('a[href="/login"], a[href="/register"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href') === '/login' || link.getAttribute('href') === '/register') {
      e.preventDefault();
      window.location.href = link.getAttribute('href');
    }
  });
});
