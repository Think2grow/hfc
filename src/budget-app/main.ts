import './style.css';
import App from './App.svelte';
import { mount } from 'svelte';

const target = document.getElementById('budget-app-root');

if (!target) {
  // If this is expected on some pages, you can leave this as a silent no-op.
  // Throwing is helpful during development so you notice missing mount points.
  console.warn('[budget-app] Missing #budget-app-root element. App was not mounted.');
} else {
  mount(App, { target });
}