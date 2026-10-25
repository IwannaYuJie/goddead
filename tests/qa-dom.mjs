// Independent QA-only DOM facade, extracted from accepted v128 unit tests. Not browser acceptance.
export class Element {
  constructor(id, tag = 'div', attrs = {}) {
    this.id = id; this.tagName = tag.toUpperCase(); this.attributes = new Map();
    this.children = []; this.parentElement = null; this.listeners = new Map(); this.textContent = '';
    this.disabledAssignments = 0; this._disabled = false;
    this.attributes.set('id', id);
    for (const [k, v] of Object.entries(attrs)) this.setAttribute(k, v);
    this.classList = {
      contains: token => this.className.split(/\s+/).includes(token),
      add: (...tokens) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...tokens])].join(' '); },
      remove: (...tokens) => { this.className = this.className.split(/\s+/).filter(t => t && !tokens.includes(t)).join(' '); },
      toggle: (token, force) => { const yes = force === undefined ? !this.classList.contains(token) : Boolean(force); yes ? this.classList.add(token) : this.classList.remove(token); return yes; },
    };
    this.dataset = new Proxy({}, {
      get: (_, key) => this.getAttribute('data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase())) ?? undefined,
      set: (_, key, value) => { this.setAttribute('data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase()), value); return true; },
    });
  }
  appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
  get parentNode() { return this.parentElement; }
  get firstChild() { return this.children[0] || null; }
  removeChild(child) { const i=this.children.indexOf(child); if(i<0)throw Error('not a child'); this.children.splice(i,1); child.parentElement=null; return child; }
  replaceChildren(...children) { for(const child of this.children)child.parentElement=null; this.children=[]; children.forEach(c=>this.appendChild(c)); }
  get className() { return this.getAttribute('class') || ''; }
  set className(v) { this.setAttribute('class', v); }
  get hidden() { return this.hasAttribute('hidden'); }
  set hidden(v) { v ? this.setAttribute('hidden', '') : this.removeAttribute('hidden'); }
  get inert() { return this.hasAttribute('inert'); }
  set inert(v) { v ? this.setAttribute('inert', '') : this.removeAttribute('inert'); }
  get disabled() { return this._disabled; }
  set disabled(v) { this.disabledAssignments++; this._disabled = Boolean(v); this._disabled ? this.attributes.set('disabled', '') : this.attributes.delete('disabled'); }
  setAttribute(k, v) { this.attributes.set(k, String(v)); if (k === 'disabled') { this.disabledAssignments++; this._disabled = true; } }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null; }
  hasAttribute(k) { return this.attributes.has(k); }
  removeAttribute(k) { this.attributes.delete(k); if (k === 'disabled') { this.disabledAssignments++; this._disabled = false; } }
  matches(selector) {
    return selector.split(',').some(part => {
      const s = part.trim();
      if (s === 'button:not([id^="sl-"])') return this.tagName === 'BUTTON' && !this.id.startsWith('sl-');
      if (s.startsWith('#')) return this.id === s.slice(1);
      if (s.startsWith('.')) return s.slice(1).split('.').every(c => this.classList.contains(c));
      const m = s.match(/^\[([^=\]]+)(?:=["']?([^"'\]]*)["']?)?\]$/);
      if (m) return m[2] === undefined ? this.hasAttribute(m[1]) : this.getAttribute(m[1]) === m[2];
      return this.tagName.toLowerCase() === s.toLowerCase();
    });
  }
  closest(selector) { for (let e = this; e; e = e.parentElement) if (e.matches(selector)) return e; return null; }
  querySelectorAll(selector) { return this.children.flatMap(c => [...(c.matches(selector) ? [c] : []), ...c.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  contains(child) { return child === this || this.children.some(c => c.contains(child)); }
  addEventListener(type, handler, options) {
    const list = this.listeners.get(type) || []; list.push({ handler, capture: options === true || Boolean(options?.capture) }); this.listeners.set(type, list);
  }
  removeEventListener(type, handler) { this.listeners.set(type, (this.listeners.get(type) || []).filter(l => l.handler !== handler)); }
}
