import { setupNavigation } from './modules/navigation.js';

const navigation = document.querySelector('[data-navigation]');
if (navigation) setupNavigation(navigation);
