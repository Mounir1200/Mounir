(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.menu-toggle');
  const navigation = document.getElementById('site-navigation');
  if (!header || !toggle || !navigation) return;

  const compact = matchMedia('(max-width: 1100px)');
  let open = false;

  function render() {
    const collapsed = compact.matches && !open;
    toggle.hidden = !compact.matches;
    toggle.setAttribute('aria-expanded', String(open));
    navigation.hidden = collapsed;
    header.dataset.menuOpen = String(open);
  }

  function close(restoreFocus = false) {
    if (restoreFocus) toggle.focus();
    open = false;
    render();
  }

  toggle.addEventListener('click', () => { open = !open; render(); });
  navigation.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (compact.matches && link) {
      const leavesPage = link.hasAttribute('download') || !link.getAttribute('href')?.startsWith('#');
      close(leavesPage && navigation.contains(document.activeElement));
    }
  });
  document.addEventListener('keydown', event => {
    if (open && event.key === 'Escape') { event.preventDefault(); close(true); }
  });
  document.addEventListener('click', event => {
    if (open && !header.contains(event.target)) close();
  });
  header.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (open && !header.contains(document.activeElement)) close();
    });
  });
  compact.addEventListener('change', () => {
    const focusedNavigation = navigation.contains(document.activeElement);
    const focusedToggle = document.activeElement === toggle;
    open = false;
    render();
    if (compact.matches && focusedNavigation) toggle.focus();
    else if (!compact.matches && focusedToggle) navigation.querySelector('a')?.focus();
  });
  header.dataset.navigationReady = 'true';
  render();
})();
