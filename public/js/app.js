// Frontend for the mini social platform
async function loadPosts() {
  try {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    posts.forEach(p => {
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `<strong>${escapeHtml(p.author)}</strong>: ${escapeHtml(p.content)}<br/><small>${new Date(p.date).toLocaleString()}</small>`;
      container.appendChild(div);
    });
  } catch (e) { console.error(e); }
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

document.getElementById('submit-post').addEventListener('click', async () => {
  const author = document.getElementById('author').value.trim();
  const content = document.getElementById('content').value.trim();
  if (!author || !content) return alert('Please enter name and content.');
  await fetch('/api/posts', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ author, content })
  });
  document.getElementById('content').value = '';
  loadPosts();
});

document.getElementById('btn-register').addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('auth-msg');
  msg.textContent = '';
  if (!name || !email || !password) { msg.textContent = 'Please fill name, email, password.'; return; }
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (data.error) msg.textContent = data.error;
  else msg.textContent = 'Registered successfully.';
});

document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('auth-msg');
  msg.textContent = '';
  if (!email || !password) { msg.textContent = 'Please fill email and password.'; return; }
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.error) msg.textContent = data.error;
  else msg.textContent = `Welcome, ${data.name}.`;
});

loadPosts();
