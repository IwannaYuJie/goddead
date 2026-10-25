/**
 * spring-letter-rules.js
 * GoddeadSpringLetterRules - v129 "没有地址的春信 / A Letter Without an Address"
 * Pure rule engine for 3x4 dot letter routes.
 */
(function () {
  'use strict';

  if (Object.prototype.hasOwnProperty.call(globalThis, 'GoddeadSpringLetterRules')) {
    return;
  }

  var GRAPHS = Object.freeze({
    window: Object.freeze({
      letter: 'window',
      rows: 3,
      cols: 4,
      start: 0,
      end: 10,
      edges: Object.freeze([
        Object.freeze([0, 1]),
        Object.freeze([1, 5]),
        Object.freeze([2, 3]),
        Object.freeze([2, 6]),
        Object.freeze([3, 7]),
        Object.freeze([4, 5]),
        Object.freeze([4, 8]),
        Object.freeze([5, 6]),
        Object.freeze([5, 9]),
        Object.freeze([7, 11]),
        Object.freeze([8, 9]),
        Object.freeze([10, 11])
      ])
    }),
    drawer: Object.freeze({
      letter: 'drawer',
      rows: 3,
      cols: 4,
      start: 3,
      end: 8,
      edges: Object.freeze([
        Object.freeze([0, 1]),
        Object.freeze([0, 4]),
        Object.freeze([1, 5]),
        Object.freeze([2, 3]),
        Object.freeze([2, 6]),
        Object.freeze([4, 5]),
        Object.freeze([5, 6]),
        Object.freeze([5, 9]),
        Object.freeze([6, 7]),
        Object.freeze([6, 10]),
        Object.freeze([7, 11]),
        Object.freeze([8, 9]),
        Object.freeze([10, 11])
      ])
    }),
    chair: Object.freeze({
      letter: 'chair',
      rows: 3,
      cols: 4,
      start: 1,
      end: 4,
      edges: Object.freeze([
        Object.freeze([0, 1]),
        Object.freeze([0, 4]),
        Object.freeze([1, 2]),
        Object.freeze([1, 5]),
        Object.freeze([2, 3]),
        Object.freeze([3, 7]),
        Object.freeze([4, 5]),
        Object.freeze([4, 8]),
        Object.freeze([5, 6]),
        Object.freeze([5, 9]),
        Object.freeze([6, 10]),
        Object.freeze([7, 11]),
        Object.freeze([8, 9]),
        Object.freeze([10, 11])
      ])
    })
  });

  function isPlainObjectOrNullProto(val) {
    if (val === null || typeof val !== 'object') {
      return false;
    }
    var proto = Object.getPrototypeOf(val);
    return proto === null || proto === Object.prototype;
  }

  function isDenseOrdinaryArray(val) {
    if (!Array.isArray(val) || Object.getPrototypeOf(val) !== Array.prototype) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(val);
    if (syms.length > 0) {
      return false;
    }
    var len = val.length;
    var keys = Object.getOwnPropertyNames(val);
    if (keys.length !== len + 1) {
      return false;
    }
    for (var i = 0; i < len; i += 1) {
      var desc = Object.getOwnPropertyDescriptor(val, String(i));
      if (!desc || desc.get || desc.set) {
        return false;
      }
    }
    var lenDesc = Object.getOwnPropertyDescriptor(val, 'length');
    if (!lenDesc || lenDesc.get || lenDesc.set) {
      return false;
    }
    return true;
  }

  function validateOwnProps(obj, expectedProps) {
    if (!isPlainObjectOrNullProto(obj)) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length > 0) {
      return false;
    }
    var ownNames = Object.getOwnPropertyNames(obj);
    if (ownNames.length !== expectedProps.length) {
      return false;
    }
    for (var i = 0; i < expectedProps.length; i += 1) {
      var name = expectedProps[i];
      var desc = Object.getOwnPropertyDescriptor(obj, name);
      if (!desc || desc.get || desc.set) {
        return false;
      }
    }
    return true;
  }

  function cloneEdge(edge) {
    return [edge[0], edge[1]];
  }

  function cloneEdges(edges) {
    var out = [];
    for (var i = 0; i < edges.length; i += 1) {
      out.push(cloneEdge(edges[i]));
    }
    return out;
  }

  function getGraphDef(letter) {
    if (typeof letter !== 'string') {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(GRAPHS, letter)) {
      return GRAPHS[letter];
    }
    return null;
  }

  function getEdgeIndex(graph, u, v) {
    var edges = graph.edges;
    var a = u < v ? u : v;
    var b = u < v ? v : u;
    for (var i = 0; i < edges.length; i += 1) {
      var e = edges[i];
      if (e[0] === a && e[1] === b) {
        return i;
      }
    }
    return -1;
  }

  function validateDraftInternal(raw) {
    if (!validateOwnProps(raw, ['letter', 'path', 'sealed'])) {
      return null;
    }
    var letter = raw.letter;
    var graph = getGraphDef(letter);
    if (!graph) {
      return null;
    }
    var path = raw.path;
    if (!isDenseOrdinaryArray(path)) {
      return null;
    }
    var totalEdges = graph.edges.length;
    var maxPathLen = totalEdges + 1;
    if (path.length === 0 || path.length > maxPathLen) {
      return null;
    }
    var sealed = raw.sealed;
    if (typeof sealed !== 'boolean') {
      return null;
    }

    var cleanPath = [];
    var usedEdges = [];
    for (var m = 0; m < totalEdges; m += 1) {
      usedEdges.push(false);
    }

    for (var i = 0; i < path.length; i += 1) {
      var node = path[i];
      if (typeof node !== 'number' || !Number.isInteger(node) || node < 0 || node > 11) {
        return null;
      }
      cleanPath.push(node);
      if (i === 0) {
        if (node !== graph.start) {
          return null;
        }
      } else {
        var prev = cleanPath[i - 1];
        var edgeIdx = getEdgeIndex(graph, prev, node);
        if (edgeIdx === -1) {
          return null;
        }
        if (usedEdges[edgeIdx]) {
          return null;
        }
        usedEdges[edgeIdx] = true;
      }
    }

    var isComplete = (cleanPath.length === maxPathLen) && (cleanPath[cleanPath.length - 1] === graph.end);
    if (sealed && !isComplete) {
      return null;
    }

    return {
      letter: graph.letter,
      path: cleanPath,
      sealed: sealed,
      graph: graph,
      isComplete: isComplete
    };
  }

  function buildAdjacency(graph) {
    var adj = [];
    for (var i = 0; i < 12; i += 1) {
      adj.push([]);
    }
    for (var e = 0; e < graph.edges.length; e += 1) {
      var u = graph.edges[e][0];
      var v = graph.edges[e][1];
      adj[u].push({ to: v, edge: e });
      adj[v].push({ to: u, edge: e });
    }
    for (var j = 0; j < 12; j += 1) {
      adj[j].sort(function (a, b) {
        return a.to - b.to;
      });
    }
    return adj;
  }

  var CACHED_ADJ = {
    window: buildAdjacency(GRAPHS.window),
    drawer: buildAdjacency(GRAPHS.drawer),
    chair: buildAdjacency(GRAPHS.chair)
  };

  function findFirstStepDfs(graph, currNode, remainingCount, usedEdgesMask) {
    if (remainingCount === 0) {
      return currNode === graph.end;
    }
    var adjList = CACHED_ADJ[graph.letter][currNode];
    for (var i = 0; i < adjList.length; i += 1) {
      var edgeIdx = adjList[i].edge;
      if ((usedEdgesMask & (1 << edgeIdx)) === 0) {
        var nextNode = adjList[i].to;
        if (findFirstStepDfs(graph, nextNode, remainingCount - 1, usedEdgesMask | (1 << edgeIdx))) {
          return true;
        }
      }
    }
    return false;
  }

  function solveLexicographicFirst(graph, currNode, remainingCount, usedEdgesMask) {
    var adjList = CACHED_ADJ[graph.letter][currNode];
    for (var i = 0; i < adjList.length; i += 1) {
      var edgeIdx = adjList[i].edge;
      if ((usedEdgesMask & (1 << edgeIdx)) === 0) {
        var nextNode = adjList[i].to;
        if (findFirstStepDfs(graph, nextNode, remainingCount - 1, usedEdgesMask | (1 << edgeIdx))) {
          return nextNode;
        }
      }
    }
    return null;
  }

  function layout(letter) {
    var graph = getGraphDef(letter);
    if (!graph) {
      return null;
    }
    return {
      letter: graph.letter,
      rows: 3,
      cols: 4,
      start: graph.start,
      end: graph.end,
      edges: cloneEdges(graph.edges)
    };
  }

  function createDraft(letter) {
    var graph = getGraphDef(letter);
    if (!graph) {
      return null;
    }
    return {
      letter: graph.letter,
      path: [graph.start],
      sealed: false
    };
  }

  function normalizeDraft(raw) {
    var valid = validateDraftInternal(raw);
    if (!valid) {
      return null;
    }
    var pathCopy = [];
    for (var i = 0; i < valid.path.length; i += 1) {
      pathCopy.push(valid.path[i]);
    }
    return {
      letter: valid.letter,
      path: pathCopy,
      sealed: valid.sealed
    };
  }

  function analyze(draft) {
    var valid = validateDraftInternal(draft);
    if (!valid) {
      return null;
    }
    var graph = valid.graph;
    var path = valid.path;
    var totalEdges = graph.edges.length;

    var visitedEdges = [];
    var usedEdgesMask = 0;
    for (var i = 1; i < path.length; i += 1) {
      var eIdx = getEdgeIndex(graph, path[i - 1], path[i]);
      visitedEdges.push(eIdx);
      usedEdgesMask |= (1 << eIdx);
    }

    var curr = path[path.length - 1];
    var available = [];
    if (!valid.sealed) {
      var adj = CACHED_ADJ[graph.letter][curr];
      for (var a = 0; a < adj.length; a += 1) {
        var edgeIdx = adj[a].edge;
        if ((usedEdgesMask & (1 << edgeIdx)) === 0) {
          available.push(adj[a].to);
        }
      }
    }

    var complete = valid.isComplete;
    var stuck = !complete && (available.length === 0);

    return {
      current: curr,
      used: visitedEdges.length,
      total: totalEdges,
      complete: complete,
      stuck: stuck,
      available: available,
      visitedEdges: visitedEdges
    };
  }

  function options(draft) {
    var info = analyze(draft);
    if (!info) {
      return null;
    }
    var out = [];
    for (var i = 0; i < info.available.length; i += 1) {
      out.push(info.available[i]);
    }
    return out;
  }

  function step(draft, node) {
    if (typeof node !== 'number' || !Number.isInteger(node) || node < 0 || node > 11) {
      return null;
    }
    var valid = validateDraftInternal(draft);
    if (!valid || valid.sealed) {
      return null;
    }
    var graph = valid.graph;
    var curr = valid.path[valid.path.length - 1];
    var eIdx = getEdgeIndex(graph, curr, node);
    if (eIdx === -1) {
      return null;
    }
    for (var i = 1; i < valid.path.length; i += 1) {
      if (getEdgeIndex(graph, valid.path[i - 1], valid.path[i]) === eIdx) {
        return null;
      }
    }

    var newPath = [];
    for (var j = 0; j < valid.path.length; j += 1) {
      newPath.push(valid.path[j]);
    }
    newPath.push(node);

    return {
      letter: valid.letter,
      path: newPath,
      sealed: false
    };
  }

  function undo(draft) {
    var valid = validateDraftInternal(draft);
    if (!valid) {
      return null;
    }
    var path = valid.path;
    var newPath = [];
    if (valid.sealed || path.length <= 1) {
      for (var i = 0; i < path.length; i += 1) {
        newPath.push(path[i]);
      }
      return {
        letter: valid.letter,
        path: newPath,
        sealed: valid.sealed
      };
    }

    for (var j = 0; j < path.length - 1; j += 1) {
      newPath.push(path[j]);
    }
    return {
      letter: valid.letter,
      path: newPath,
      sealed: false
    };
  }

  function reset(draft) {
    var valid = validateDraftInternal(draft);
    if (!valid) {
      return null;
    }
    if (valid.sealed) {
      var pathCopy = [];
      for (var i = 0; i < valid.path.length; i += 1) {
        pathCopy.push(valid.path[i]);
      }
      return {
        letter: valid.letter,
        path: pathCopy,
        sealed: true
      };
    }
    return {
      letter: valid.letter,
      path: [valid.graph.start],
      sealed: false
    };
  }

  function seal(draft, value) {
    if (typeof value !== 'boolean') {
      return null;
    }
    var valid = validateDraftInternal(draft);
    if (!valid) {
      return null;
    }
    if (value) {
      if (!valid.isComplete) {
        return null;
      }
      var sealedPath = [];
      for (var i = 0; i < valid.path.length; i += 1) {
        sealedPath.push(valid.path[i]);
      }
      return {
        letter: valid.letter,
        path: sealedPath,
        sealed: true
      };
    }
    var unsealedPath = [];
    for (var j = 0; j < valid.path.length; j += 1) {
      unsealedPath.push(valid.path[j]);
    }
    return {
      letter: valid.letter,
      path: unsealedPath,
      sealed: false
    };
  }

  function hint(draft) {
    var valid = validateDraftInternal(draft);
    if (!valid) {
      return null;
    }
    var graph = valid.graph;
    var totalEdges = graph.edges.length;
    if (valid.isComplete) {
      return {
        next: null,
        undo: 0
      };
    }

    var edgeIndices = [];
    for (var i = 1; i < valid.path.length; i += 1) {
      edgeIndices.push(getEdgeIndex(graph, valid.path[i - 1], valid.path[i]));
    }

    var currentPrefixLen = valid.path.length;
    for (var pLen = currentPrefixLen; pLen >= 1; pLen -= 1) {
      var mask = 0;
      for (var e = 0; e < pLen - 1; e += 1) {
        mask |= (1 << edgeIndices[e]);
      }
      var curr = valid.path[pLen - 1];
      var remaining = totalEdges - (pLen - 1);
      var nextStep = solveLexicographicFirst(graph, curr, remaining, mask);
      if (nextStep !== null) {
        return {
          next: nextStep,
          undo: currentPrefixLen - pLen
        };
      }
    }

    return null;
  }

  function create() {
    var api = {
      layout: layout,
      createDraft: createDraft,
      normalizeDraft: normalizeDraft,
      analyze: analyze,
      options: options,
      step: step,
      undo: undo,
      reset: reset,
      seal: seal,
      hint: hint
    };
    return Object.freeze(api);
  }

  var GoddeadSpringLetterRules = Object.freeze({
    create: create
  });

  Object.defineProperty(globalThis, 'GoddeadSpringLetterRules', {
    value: GoddeadSpringLetterRules,
    writable: false,
    enumerable: true,
    configurable: false
  });
})();
