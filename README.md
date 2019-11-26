<div align="center">
  <h1>
    <br/>
   <img src="https://raw.githubusercontent.com/zmitry/struct/master/docs/logo.svg">
    <br />
    Data structures library
    <br />
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/@zmitry/struct">
       <img src="https://img.shields.io/npm/v/@zmitry/struct.svg" alt="npm package" />
    </a>
    <a href="https://www.npmjs.com/package/@zmitry/struct">
      <img src="https://img.shields.io/npm/dm/@zmitry/struct" alt="npm downloads" />
    </a>
    <br />
    Collection of essential data structures for web development.</em></a>.

  </sup>
  <br />
  <br />
  <br />
  <br />
  <pre>yarn add <a href="https://www.npmjs.com/package/@zmitry/struct">@zmitry/struct</a></pre>
  <br />
  <br />
  <br />
</div>

- [**Graph**](./src/graph/Readme.md)
  - [`createGraph`](./src/graph/Readme.md) &mdash; graph data structure
  - [`createCompoundGraph`](./src/graph/Readme.md) &mdash; hierarchal graph
    <br/>
    <br/>
- [**Advanced graph algorithms**](./src/graph-alg/Readme.md)
  - [`dfs`](./src/graph-alg/dfs.ts) &mdash; depth first graph traversal
  - [`topologicalSort`](./src/graph-alg/topological-stort-kahn.ts) &mdash; Kahn topological sort
  - [`connectedComponents`](./src/graph-alg/components.ts) &mdash; connected components algorithm
    <br/>
    <br/>
- [**Primitive**](./src/index.ts)
  - [`createHeap`](./src/pairing-heap.ts) &mdash; Pairing heap implementation.
  - [`LRUCache`](./src/LRUCache.ts) &mdash; LRU cache implementation
    <br/>
    <br/>

<br />

<!-- <p align="center">
  <a href="./docs/Usage.md"><strong>Usage</strong></a> &mdash; how to import.
  <br />
  <a href="https://opencollective.com/@zmitry/struct/contribute"><strong>Support</strong></a> &mdash; add yourself to backer list below.
</p> -->

<br />
<br />
<br />

<div align="center">
<h2>Roadmap</h2>
</div>

- [x] LRU Cache
- LRU with ttl
- [x] Graph data structure without parent/multigraph support
- [x] Topological sort
- [x] Pairing heap using linked list
- Priority queue
- link-cut tree
