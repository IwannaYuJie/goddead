(() => {
  'use strict';

  const MASKS = [
    (1 << 0) | (1 << 1) | (1 << 3),                // 0: (0,0) -> 0, 1, 3
    (1 << 1) | (1 << 0) | (1 << 2) | (1 << 4),     // 1: (0,1) -> 1, 0, 2, 4
    (1 << 2) | (1 << 1) | (1 << 5),                // 2: (0,2) -> 2, 1, 5
    (1 << 3) | (1 << 0) | (1 << 4) | (1 << 6),     // 3: (1,0) -> 3, 0, 4, 6
    (1 << 4) | (1 << 1) | (1 << 3) | (1 << 5) | (1 << 7), // 4: (1,1) -> 4, 1, 3, 5, 7
    (1 << 5) | (1 << 2) | (1 << 4) | (1 << 8),     // 5: (1,2) -> 5, 2, 4, 8
    (1 << 6) | (1 << 3) | (1 << 7),                // 6: (2,0) -> 6, 3, 7
    (1 << 7) | (1 << 4) | (1 << 6) | (1 << 8),     // 7: (2,1) -> 7, 4, 6, 8
    (1 << 8) | (1 << 5) | (1 << 7)                 // 8: (2,2) -> 8, 5, 7
  ];

  const AFFECTED = MASKS.map(mask => {
    const arr = [];
    for (let bit = 0; bit < 9; bit++) {
      if ((mask & (1 << bit)) !== 0) {
        arr.push(bit);
      }
    }
    return Object.freeze(arr);
  });

  const MATRIX = [];
  for (let r = 0; r < 9; r++) {
    let row = 0;
    for (let c = 0; c < 9; c++) {
      if ((MASKS[c] & (1 << r)) !== 0) {
        row |= (1 << c);
      }
    }
    MATRIX.push(row);
  }

  const SOL_MAP = new Int32Array(512);
  for (let b = 0; b < 512; b++) {
    const diff = (511 ^ b) & 511;
    let m = MATRIX.slice();
    let rhs = 0;
    for (let r = 0; r < 9; r++) {
      if ((diff & (1 << r)) !== 0) {
        rhs |= (1 << r);
      }
    }

    let pivotRow = 0;
    for (let col = 0; col < 9 && pivotRow < 9; col++) {
      let sel = -1;
      for (let r = pivotRow; r < 9; r++) {
        if ((m[r] & (1 << col)) !== 0) {
          sel = r;
          break;
        }
      }
      if (sel === -1) continue;
      if (sel !== pivotRow) {
        const tmpM = m[pivotRow];
        m[pivotRow] = m[sel];
        m[sel] = tmpM;

        const tmpR = (rhs >> pivotRow) & 1;
        const selR = (rhs >> sel) & 1;
        rhs = (rhs & ~(1 << pivotRow) & ~(1 << sel)) | (selR << pivotRow) | (tmpR << sel);
      }
      for (let r = 0; r < 9; r++) {
        if (r !== pivotRow && ((m[r] & (1 << col)) !== 0)) {
          m[r] ^= m[pivotRow];
          const bitP = (rhs >> pivotRow) & 1;
          rhs ^= (bitP << r);
        }
      }
      pivotRow++;
    }

    let sol = 0;
    for (let r = 0; r < 9; r++) {
      if ((rhs & (1 << r)) !== 0) {
        sol |= m[r];
      }
    }
    SOL_MAP[b] = sol;
  }

  function isIndex(i) {
    return typeof i === 'number' && Number.isInteger(i) && i >= 0 && i <= 8;
  }

  function isBoard(b) {
    return typeof b === 'number' && Number.isInteger(b) && b >= 0 && b <= 511;
  }

  function isValidRuling(r) {
    return r === 'A' || r === 'B' || r === null;
  }

  function getInitialBoard(r) {
    if (r === 'A') return 238;
    if (r === 'B') return 341;
    if (r === null) return 0;
    throw new TypeError('Invalid ruling');
  }

  function maskOfBoard(b, i) {
    return b ^ MASKS[i];
  }

  function solutionIndices(board) {
    const sol = SOL_MAP[board];
    const res = [];
    for (let i = 0; i < 9; i++) {
      if ((sol & (1 << i)) !== 0) {
        res.push(i);
      }
    }
    return res;
  }

  function computeBoard(initial, baseParity, moves) {
    let b = initial;
    for (let i = 0; i < 9; i++) {
      if ((baseParity & (1 << i)) !== 0) {
        b ^= MASKS[i];
      }
    }
    for (let idx = 0; idx < moves.length; idx++) {
      b ^= MASKS[moves[idx]];
    }
    return b;
  }

  const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  const getPrototypeOf = Object.getPrototypeOf;
  const fnToString = Function.prototype.toString;

  const NATIVE_OBJECT_SRC = fnToString.call(Object);
  const NATIVE_ARRAY_SRC = fnToString.call(Array);

  function isGenuineObjectPrototype(proto) {
    if (!proto || typeof proto !== 'object') return false;
    if (getPrototypeOf(proto) !== null) return false;

    const ctorDesc = getOwnPropertyDescriptor(proto, 'constructor');
    if (!ctorDesc || !('value' in ctorDesc) || ctorDesc.get || ctorDesc.set) return false;

    const ctor = ctorDesc.value;
    if (typeof ctor !== 'function') return false;

    const protoDesc = getOwnPropertyDescriptor(ctor, 'prototype');
    if (!protoDesc || !('value' in protoDesc) || protoDesc.get || protoDesc.set) return false;
    if (protoDesc.value !== proto) return false;

    try {
      if (fnToString.call(ctor) !== NATIVE_OBJECT_SRC) return false;
    } catch {
      return false;
    }

    return true;
  }

  function isGenuineArrayPrototype(proto) {
    if (!proto || typeof proto !== 'object') return false;
    if (!Array.isArray(proto)) return false;

    const parentProto = getPrototypeOf(proto);
    if (!isGenuineObjectPrototype(parentProto)) return false;

    const ctorDesc = getOwnPropertyDescriptor(proto, 'constructor');
    if (!ctorDesc || !('value' in ctorDesc) || ctorDesc.get || ctorDesc.set) return false;

    const ctor = ctorDesc.value;
    if (typeof ctor !== 'function') return false;

    const protoDesc = getOwnPropertyDescriptor(ctor, 'prototype');
    if (!protoDesc || !('value' in protoDesc) || protoDesc.get || protoDesc.set) return false;
    if (protoDesc.value !== proto) return false;

    try {
      if (fnToString.call(ctor) !== NATIVE_ARRAY_SRC) return false;
    } catch {
      return false;
    }

    return true;
  }

  function isPlainObject(o) {
    const proto = getPrototypeOf(o);
    if (proto === null) return true;
    return isGenuineObjectPrototype(proto);
  }

  function isPlainArray(a) {
    const proto = getPrototypeOf(a);
    return isGenuineArrayPrototype(proto);
  }

  function validateRawDraft(raw) {
    if (typeof raw !== 'object' || raw === null) return null;
    if (Array.isArray(raw)) return null;
    if (!isPlainObject(raw)) return null;

    const syms = Object.getOwnPropertySymbols(raw);
    if (syms.length > 0) return null;

    const names = Object.getOwnPropertyNames(raw);
    if (names.length !== 4) return null;

    const required = ['capturedRuling', 'baseParity', 'moves', 'holding'];
    for (let i = 0; i < 4; i++) {
      const k = required[i];
      const desc = Object.getOwnPropertyDescriptor(raw, k);
      if (!desc || !('value' in desc) || desc.get || desc.set) {
        return null;
      }
    }

    const r = raw.capturedRuling;
    if (!isValidRuling(r)) return null;

    const bp = raw.baseParity;
    if (!isBoard(bp)) return null;

    const m = raw.moves;
    if (typeof m !== 'object' || m === null || !Array.isArray(m)) return null;
    if (!isPlainArray(m)) return null;

    const mSyms = Object.getOwnPropertySymbols(m);
    if (mSyms.length > 0) return null;

    const mNames = Object.getOwnPropertyNames(m);
    const len = m.length;
    if (typeof len !== 'number' || !Number.isInteger(len) || len < 0 || len > 64) return null;
    if (mNames.length !== len + 1) return null;

    const movesCopy = new Array(len);
    for (let i = 0; i < len; i++) {
      const desc = Object.getOwnPropertyDescriptor(m, String(i));
      if (!desc || !('value' in desc) || desc.get || desc.set) return null;
      const val = desc.value;
      if (!isIndex(val)) return null;
      movesCopy[i] = val;
    }

    const h = raw.holding;
    if (typeof h !== 'boolean') return null;

    const init = getInitialBoard(r);
    const derived = computeBoard(init, bp, movesCopy);
    if (h && derived !== 511) return null;

    return {
      capturedRuling: r,
      baseParity: bp,
      moves: movesCopy,
      holding: h
    };
  }

  function create() {
    const api = {
      affected(i) {
        if (!isIndex(i)) throw new TypeError('Invalid index');
        return AFFECTED[i].slice();
      },

      initialBoard(r) {
        if (!isValidRuling(r)) throw new TypeError('Invalid ruling');
        return getInitialBoard(r);
      },

      toggle(board, i) {
        if (!isBoard(board)) throw new TypeError('Invalid board');
        if (!isIndex(i)) throw new TypeError('Invalid index');
        return maskOfBoard(board, i);
      },

      solution(board) {
        if (!isBoard(board)) throw new TypeError('Invalid board');
        return solutionIndices(board);
      },

      hint(board) {
        if (!isBoard(board)) throw new TypeError('Invalid board');
        const sol = solutionIndices(board);
        return sol.length > 0 ? sol[0] : null;
      },

      createDraft(r) {
        if (!isValidRuling(r)) throw new TypeError('Invalid ruling');
        return {
          capturedRuling: r,
          baseParity: 0,
          moves: [],
          holding: false
        };
      },

      normalizeDraft(raw) {
        return validateRawDraft(raw);
      },

      boardOf(d) {
        const canonical = validateRawDraft(d);
        if (!canonical) throw new TypeError('Invalid draft');
        return computeBoard(
          getInitialBoard(canonical.capturedRuling),
          canonical.baseParity,
          canonical.moves
        );
      },

      move(d, i) {
        const canonical = validateRawDraft(d);
        if (!canonical) throw new TypeError('Invalid draft');
        if (!isIndex(i)) throw new TypeError('Invalid index');

        if (canonical.holding) {
          return {
            capturedRuling: canonical.capturedRuling,
            baseParity: canonical.baseParity,
            moves: canonical.moves.slice(),
            holding: true
          };
        }

        const newMoves = canonical.moves.slice();
        let newBp = canonical.baseParity;

        if (newMoves.length === 64) {
          const oldest = newMoves.shift();
          newBp ^= (1 << oldest);
        }
        newMoves.push(i);

        return {
          capturedRuling: canonical.capturedRuling,
          baseParity: newBp,
          moves: newMoves,
          holding: false
        };
      },

      undo(d) {
        const canonical = validateRawDraft(d);
        if (!canonical) throw new TypeError('Invalid draft');

        if (canonical.holding) {
          return {
            capturedRuling: canonical.capturedRuling,
            baseParity: canonical.baseParity,
            moves: canonical.moves.slice(),
            holding: true
          };
        }

        const newMoves = canonical.moves.slice();
        if (newMoves.length > 0) {
          newMoves.pop();
        }

        return {
          capturedRuling: canonical.capturedRuling,
          baseParity: canonical.baseParity,
          moves: newMoves,
          holding: false
        };
      },

      reset(d) {
        const canonical = validateRawDraft(d);
        if (!canonical) throw new TypeError('Invalid draft');
        return {
          capturedRuling: canonical.capturedRuling,
          baseParity: 0,
          moves: [],
          holding: false
        };
      },

      hold(d, bool) {
        const canonical = validateRawDraft(d);
        if (!canonical) throw new TypeError('Invalid draft');
        if (typeof bool !== 'boolean') throw new TypeError('Invalid boolean');

        let newHolding = false;
        if (bool) {
          const b = computeBoard(
            getInitialBoard(canonical.capturedRuling),
            canonical.baseParity,
            canonical.moves
          );
          if (b === 511) {
            newHolding = true;
          }
        }

        return {
          capturedRuling: canonical.capturedRuling,
          baseParity: canonical.baseParity,
          moves: canonical.moves.slice(),
          holding: newHolding
        };
      }
    };

    return Object.freeze(api);
  }

  globalThis.GoddeadWarmthRules = Object.freeze({ create });
})();
