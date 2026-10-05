// Shared app state and actions. The "hardware" (lock, door, camera, Bluetooth) is simulated here.
export const SH = ['Top', 'Middle', 'Bottom'];
export const SD = ['Left', 'Right'];

const ago = (m) => new Date(Date.now() - m * 6e4);
export const tm = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const seed = [
  ['Rice', 'Top', 'Left'], ['Pasta', 'Top', 'Left'], ['Olive oil', 'Top', 'Right'],
  ['Cereal', 'Middle', 'Left'], ['Oats', 'Middle', 'Left'], ['Peanut butter', 'Middle', 'Right'],
  ['Canned tomatoes', 'Bottom', 'Left'], ['Black beans', 'Bottom', 'Left'], ['Flour', 'Bottom', 'Right']
].map(([name, shelf, side], id) => ({ id, name, shelf, side, here: true, since: null }));

export const app = $state({
  online: true, locked: true, door: false, moving: false,
  query: '', sel: null, filter: 'all',
  items: seed, log: [],
  toastText: '', toastOn: false
});

export const loc = (i) => `${i.shelf} shelf, ${i.side.toLowerCase()}`;

export function addLog(type, text, t) {
  // Events made while the phone is out of range are flagged until they sync.
  app.log.unshift({ type, text, t: t ?? new Date(), wait: !app.online && !t });
}

// Sample history so the screen isn't empty on first run
[[190, 'door', 'Unlocked'], [188, 'door', 'Door opened'], [187, 'take', 'Taken: Cereal'],
 [185, 'door', 'Door closed'], [184, 'door', 'Locked']].forEach(([m, ty, tx]) => addLog(ty, tx, ago(m)));
app.items[3].here = false;
app.items[3].since = ago(187);

let timer;
export function toast(msg) {
  app.toastText = msg;
  app.toastOn = true;
  clearTimeout(timer);
  timer = setTimeout(() => (app.toastOn = false), 2600);
}

export function setLock(target) {
  app.moving = true; // the lock motor takes 1.4 s; the UI shows progress meanwhile
  setTimeout(() => {
    app.moving = false;
    app.locked = target;
    addLog('door', target ? 'Locked' : 'Unlocked');
    toast(target ? 'Cupboard locked' : 'Cupboard unlocked');
  }, 1400);
}

export function toggleDoor() {
  app.door = !app.door;
  addLog('door', app.door ? 'Door opened' : 'Door closed');
  if (!app.door) toast('Door closed');
}

export function toggleNet() {
  app.online = !app.online;
  if (app.online) {
    const n = app.log.filter((e) => e.wait).length;
    app.log.forEach((e) => (e.wait = false));
    toast('Reconnected' + (n ? `. ${n} event${n > 1 ? 's' : ''} synced` : ''));
  } else toast('Lost connection to the cupboard');
}

export function take(i) {
  i.here = false; i.since = new Date();
  addLog('take', 'Taken: ' + i.name);
  toast(i.name + ' taken out');
}

export function put(i) {
  i.here = true;
  addLog('put', `Put back: ${i.name} (${loc(i).toLowerCase()})`);
  toast(i.name + ' put back');
}
