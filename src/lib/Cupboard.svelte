<script>
  import { app, SH, SD, setLock, toggleDoor, toggleNet, take, put, loc, tm } from './store.svelte.js';

  let simId = $state(0);

  const q = $derived(app.query.trim().toLowerCase());
  const hits = $derived(q ? app.items.filter((i) => i.name.toLowerCase().includes(q)) : []);
  const list = $derived(q ? hits : app.items);
  const hl = $derived(new Set(
    [...hits, ...(app.sel != null ? [app.items[app.sel]] : [])].map((i) => i.shelf + i.side)
  ));
  const lk = $derived(app.moving ? 'moving' : app.locked ? 'locked' : 'unlocked');
  const why = $derived(
    app.moving ? 'Working on it…'
    : !app.online ? 'Reconnect to lock or unlock.'
    : !app.locked && app.door ? "Close the door first. It can't lock while open."
    : ''
  );
  const simItem = $derived(app.items[simId]);
  const simWhy = $derived(
    !app.door ? (app.locked ? 'Door is locked: unlock it in the app first.' : 'Open the door to take or put back items.')
    : simItem.here ? 'Item is inside, so it can be taken out.' : 'Item is out, so it can be put back.'
  );
</script>

<main>
  <section class="card" aria-live="polite">
    <div class="states">
      <div class="st {lk}">
        <small>Lock</small>
        <b>{app.moving ? (app.locked ? 'Unlocking…' : 'Locking…') : app.locked ? 'Locked' : 'Unlocked'}</b>
      </div>
      <div class="st {app.door ? 'open' : 'locked'}">
        <small>Door</small><b>{app.door ? 'Open' : 'Closed'}</b>
      </div>
    </div>
    {#if !app.online}
      <div class="banner">
        Can't reach the cupboard. Move your phone closer or check its power. It stays
        {app.locked ? 'locked' : 'unlocked'} and keeps logging.
      </div>
    {/if}
    <button class="btn" class:alt={!app.locked} disabled={!!why} onclick={() => setLock(!app.locked)}>
      {app.moving ? (app.locked ? 'Unlocking…' : 'Locking…') : app.locked ? 'Unlock cupboard' : 'Lock cupboard'}
    </button>
    {#if app.moving}<div class="bar"><i></i></div>{/if}
    {#if why}<p class="why">{why}</p>{/if}
  </section>

  <h2>Find an item</h2>
  <div class="search">
    <input type="search" bind:value={app.query} oninput={() => (app.sel = null)}
      placeholder="Search, e.g. rice" aria-label="Search items in cupboard" autocomplete="off">
  </div>

  <div class="cab {lk}" aria-label="Cupboard diagram, shelves match the real cupboard">
    <div class="cabhead">
      <span>{app.locked ? 'Locked' : 'Unlocked'}{app.door ? ', door open' : ''}</span>
      <span>Camera watching</span>
    </div>
    <div class="grid">
      <span></span><span class="colhead">Left</span><span class="colhead">Right</span>
      {#each SH as sh}
        <span class="rail">{sh}</span>
        {#each SD as sd}
          <div class="cell" class:hit={hl.has(sh + sd)}>
            {#each app.items.filter((i) => i.shelf === sh && i.side === sd) as i}
              {#if i.here}{i.name}<br>{:else}<s>{i.name} (out)</s>{/if}
            {/each}
          </div>
        {/each}
      {/each}
    </div>
  </div>

  <div style="margin-top:12px">
    <p class="why">
      {#if q}
        {hits.length ? `${hits.length} found. Tap one to highlight its shelf.` : `Nothing matches "${app.query.trim()}". Check the spelling or try a shorter word.`}
      {:else}In the cupboard: tap an item to highlight its shelf.{/if}
    </p>
    {#each list as i (i.id)}
      <button class="res" aria-pressed={app.sel === i.id} onclick={() => (app.sel = app.sel === i.id ? null : i.id)}>
        <span>{i.name}<small>{i.here ? loc(i) : `Out since ${tm(i.since)} (was on ${loc(i).toLowerCase()})`}</small></span>
        <span class="go" aria-hidden="true">›</span>
      </button>
    {/each}
  </div>

  <div class="sim">
    <b>Demo: pretend to be the cupboard</b>
    <p class="why">There's no hardware in this prototype. These controls stand in for the real door, shelves and Bluetooth range.</p>
    <div class="btns">
      <button class="btn sm out" disabled={(app.locked && !app.door) || app.moving} onclick={toggleDoor}>{app.door ? 'Close door' : 'Open door'}</button>
      <button class="btn sm out" onclick={toggleNet}>{app.online ? 'Go out of range' : 'Come back in range'}</button>
    </div>
    <div class="btns">
      <select bind:value={simId} aria-label="Item to move">
        {#each app.items as i}<option value={i.id}>{i.name}{i.here ? '' : ' (out)'}</option>{/each}
      </select>
    </div>
    <div class="btns">
      <button class="btn sm out" disabled={!app.door || !simItem.here} onclick={() => take(simItem)}>Take out</button>
      <button class="btn sm out" disabled={!app.door || simItem.here} onclick={() => put(simItem)}>Put back</button>
    </div>
    <p class="why">{simWhy}</p>
  </div>
</main>
