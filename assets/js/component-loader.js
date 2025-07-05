function loadComponent(element) {
  const path = element.dataset.component;
  if (!path) return;
  fetch(path)
    .then((resp) => (resp.ok ? resp.text() : Promise.reject(resp.status)))
    .then((html) => {
      element.innerHTML = html;
    })
    .catch((err) => console.error('Error loading component', path, err));
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-component]').forEach(loadComponent);
});
