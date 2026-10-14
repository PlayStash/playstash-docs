'use strict';

// Bound recursive upstream AST walkers even for caller-supplied AST objects.
const MAX_DEPTH = 256;
const MAX_NODES = 65536;

const fail = message => {
  const error = new SyntaxError(message);
  error.code = 'ERR_BRACES_COMPLEXITY';
  throw error;
};

const assertDepth = depth => {
  if (depth > MAX_DEPTH) fail(`Brace AST nesting exceeds ${MAX_DEPTH} levels`);
};

const assertAst = ast => {
  const active = new WeakSet();
  const pending = [{ node: ast, depth: 0, leave: false }];
  let count = 0;

  while (pending.length) {
    const { node, depth, leave } = pending.pop();
    if (!node || typeof node !== 'object') continue;
    if (leave) {
      active.delete(node);
      continue;
    }
    assertDepth(depth);
    if (++count > MAX_NODES) fail(`Brace AST exceeds ${MAX_NODES} nodes`);
    if (active.has(node)) fail('Brace AST contains a nodes cycle');
    active.add(node);
    pending.push({ node, depth, leave: true });
    if (Array.isArray(node.nodes)) {
      if (node.nodes.length > MAX_NODES - count) fail(`Brace AST exceeds ${MAX_NODES} nodes`);
      for (let i = node.nodes.length - 1; i >= 0; i--) {
        pending.push({ node: node.nodes[i], depth: depth + 1, leave: false });
      }
    }
  }
};

module.exports = { MAX_DEPTH, MAX_NODES, assertDepth, assertAst };
