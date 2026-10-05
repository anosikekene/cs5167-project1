<script>
  import { app, loc, tm, toast } from './store.svelte.js';
  let { ask } = $props();

  const FILTERS = [['all', 'All'], ['take', 'Taken'], ['put', 'Put back'], ['door', 'Door & lock']];
  const LABEL = { take: 'Taken', put: 'Put back', door: 'Door' };
  const out = $derived(app.items.filter((i) => !i.here));
  const rows = $derived(app.log.filter((e) => app.filter === 'all' || e.type === app.filter));
</script>

<main>
  <h2>Out of the cupboard now</h2>
  <div class="card">
    {#each out as i (i.id)}
      <div class="row">
        <span>{i.name}<br><small class="gone">Belongs on {loc(i).toLowerCase()}</small></span>
        <time>since {tm(i.since)}</time>
      </div>
    {:else}
      Everything is back in the cupboard.
    {/each}
  </div>

  <h2>History</h2>
  <div class="chips" role="group" aria-label="Filter history">
    {#each FILTERS as [key, label]}
      <button class="chip" aria-pressed={app.filter === key} onclick={() => (app.filter = key)}>{label}</button>
    {/each}
  </div>
  <div class="card">
    {#each rows as e}
      <div class="row">
        <span>
          <span class="tag" class:take={e.type === 'take'}>{LABEL[e.type]}</span>{e.text}
          {#if e.wait}<span class="tag wait">waiting to sync</span>{/if}
        </span>
        <time>{tm(e.t)}</time>
      </div>
    {:else}
      Nothing here yet.
    {/each}
  </div>

  <button class="btn out" style="margin-top:12px"
    onclick={() => ask('Clear all history?', "This deletes every record of items taken and put back. It can't be undone.",
      () => { app.log = []; toast('History cleared'); })}>
    Clear history…
  </button>
</main>
