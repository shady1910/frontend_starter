// Entspricht dem Navigations-Breakpoint in main.css.
const mobileLayout = '(width < 48rem)';

export function setupNavigation(navigation) {
  const button = navigation.querySelector('[data-menu-button]');
  const menu = button && document.getElementById(button.getAttribute('aria-controls'));
  if (!menu || !navigation.contains(menu)) return;

  const mobile = window.matchMedia(mobileLayout);

  function setMenu(open) {
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }

  function updateLayout() {
    if (mobile.matches) {
      button.hidden = false;
      if (menu.contains(document.activeElement)) button.focus();
      setMenu(false);
      return;
    }

    menu.hidden = false;
    if (document.activeElement === button) menu.querySelector('a[href]')?.focus();
    button.hidden = true;
    button.removeAttribute('aria-expanded');
  }

  button.addEventListener('click', () => setMenu(menu.hidden));
  navigation.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mobile.matches || menu.hidden) return;
    event.preventDefault();
    button.focus();
    setMenu(false);
  });
  menu.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a[href]')) setMenu(false);
  });
  mobile.addEventListener('change', updateLayout);
  updateLayout();
}
