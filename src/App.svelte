<script>
  import { app } from './lib/store.svelte.js';
  import Cupboard from './lib/Cupboard.svelte';
  import History from './lib/History.svelte';
  import About from './lib/About.svelte';

  const TABS = [['home', 'Cupboard'], ['log', 'History'], ['info', 'About']];
  let tab = $state('home');

  // One confirmation dialog shared by every destructive action
  let dlg = $state();
  let title = $state('');
  let body = $state('');
  let action = () => {};
  function ask(t, b, fn) { title = t; body = b; action = fn; dlg.showModal(); }
  function go(t) { tab = t; window.scrollTo(0, 0); }
</script>

<div class="top">
  <h1>My cupboard</h1>
  <span class="pill">
    <span class="dot" style="background:{app.online ? 'var(--lock)' : 'var(--bad)'}"></span>
    {app.online ? 'Connected' : 'Not connected'}
  </span>
</div>

{#if tab === 'home'}<Cupboard />{:else if tab === 'log'}<History {ask} />{:else}<About {ask} />{/if}

<div id="toast" class:on={app.toastOn} role="status" aria-live="polite">{app.toastText}</div>

<nav aria-label="Main">
  {#each TABS as [key, label]}
    <button aria-current={tab === key ? 'page' : undefined} onclick={() => go(key)}>{label}</button>
  {/each}
</nav>

<dialog bind:this={dlg}>
  <b>{title}</b>
  <p style="margin-top:8px">{body}</p>
  <div class="btns">
    <button class="btn out" onclick={() => dlg.close()}>Cancel</button>
    <button class="btn danger" onclick={() => { dlg.close(); action(); }}>Confirm</button>
  </div>
</dialog>
