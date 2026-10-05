<script>
  import { toast } from './store.svelte.js';
  let { ask } = $props();
  const unpair = () => ask('Unpair this cupboard?',
    'The app will stop controlling the lock and history on this phone is removed. The cupboard stays in its current lock state.',
    () => toast('Demo only: nothing was unpaired'));
</script>

<main>
<h2>How it works</h2>
<div class="card"><p><b>A camera and lock inside your cupboard do the watching; this app is the remote.</b> The camera logs what you take and put back on its own. You choose when to lock or unlock.</p>
<p><b>Automatic:</b> door sensing, item logging, time stamps.<br><b>You control:</b> locking, unlocking, searching, clearing history.</p>
<p><b>Out of range?</b> The cupboard keeps its last lock state and keeps logging. The app can't lock or unlock until it reconnects, then history syncs.</p></div>
<h2>Light on the cupboard</h2>
<div class="card"><p><span class="led" style="background:var(--lock)"></span>Steady teal: locked</p><p><span class="led" style="background:var(--open)"></span>Steady amber: unlocked</p><p><span class="led" style="background:var(--blue)"></span>Pulsing blue: lock is moving</p><p style="margin:0"><span class="led" style="background:var(--bad)"></span>Red: can't reach your phone</p></div>
<h2>Design principles used</h2>
<details><summary>Affordance</summary><ul><li>Actions are filled buttons, search results have a "›" and a border; history rows and status boxes are flat and not tappable.</li><li>Every cupboard function is reachable: lock/unlock (Cupboard), door state (Cupboard), item log (History), search (Cupboard), clear history and unpair (below).</li></ul></details>
<details><summary>Signifiers</summary><ul><li>Primary job (lock/unlock) is the large button under the status boxes, visible without scrolling.</li><li>All icons are paired with words. Lock, door and connection state show at the top of the phone and match the LED on the cupboard (see above).</li><li>No hidden gestures are used, so none need hints.</li></ul></details>
<details><summary>Constraints</summary><ul><li>Can't lock while the door is open; the button is greyed with the reason.</li><li>Can't open the door while locked, or lock/unlock while offline or already moving.</li><li>Clear history and unpair ask for confirmation, in red.</li><li>Pickers and filter chips replace free text where possible. Colours: teal = secure, amber = open, red = problem.</li></ul></details>
<details><summary>Mapping</summary><ul><li>The diagram's Top/Middle/Bottom and Left/Right cells match the real shelves.</li><li>Search results highlight the matching shelf cell directly above them.</li><li>Lock controls sit next to lock status; item controls sit next to the item list.</li></ul></details>
<details><summary>Feedback</summary><ul><li>Buttons depress instantly; a progress bar shows the 1.4 s lock motor.</li><li>A toast confirms success; errors say what happened and what to do. Only real changes notify you.</li><li>The app only says "Locked" after the cupboard reports it.</li></ul></details>
<details><summary>Conceptual model</summary><ul><li>"The camera records, the lock secures, the app is a remote."</li><li>Offline behaviour is shown in a red banner and in "waiting to sync" tags.</li></ul></details>

<h2>How AI was used</h2>
<div class="card"><p><b>Tool:</b> Claude (Anthropic), 2 October 2026.</p>
<p><b>Prompt:</b> I gave Claude my assignment (Smart Kitchen Cupboard: lock, door state, item log with times, search) plus the rubric table of affordance, signifier, constraint, mapping, feedback and conceptual model, and asked for a mobile interface and AI documentation.</p>
<p><b>What the AI produced:</b> the screen structure, the layout, the working prototype code, the demo controls, the copy, and the rubric mapping above.</p>
<p><b>What I did:</b> <i>(edit this part)</i> tested every screen against the rubric checklist, tried the offline and door-open cases, changed anything that didn't match my own design ideas, and checked that I can explain every decision.</p>
<p><b>Limits:</b> the lock, camera and Bluetooth are simulated; AI did not test with real users. Item names are made-up sample data.</p></div>
<h2>Device</h2>
<button class="btn danger" onclick={unpair}>Unpair cupboard…</button>
</main>
