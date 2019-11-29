import { IUndirectedGraph, GraphReturn } from './graph';
import { IHierarchy, ROOT_NODE } from './compound-graph';

type Writer = ReturnType<typeof makeWriter>;
type Args = { intend?: string; compound?: boolean; directed?: boolean };
export function toDot<N, E>(g: GraphReturn<N, E>, args: Args): string;

export function toDot<N, E>(
  g: any,
  { intend = ' ', compound, directed }: Args
) {
  const graph: IUndirectedGraph<N, E> & IHierarchy = g;
  const writer = makeWriter(intend);
  const ec = directed ? '->' : '--';
  writer.writeBlock(directed ? 'digraph' : 'graph', () => {
    graph.nodes().forEach(([key, value]) => {
      writer.writeLine(`${id(key)}${attrsToString(value)}`);
    });

    graph.edges().forEach(edge => {
      writer.writeLine(
        `${id(edge.from)}${ec}${id(edge.to)}${attrsToString(edge.value)}`
      );
    });
    if (compound) {
      writeSubgraph(graph, ROOT_NODE, writer);
    }
  });
  return writer.toString();
}
function writeSubgraph(
  g: IHierarchy & IUndirectedGraph<any, any>,
  v: string,
  writer: Writer
) {
  g.getChildren(v).forEach(w => {
    if (g.getChildren(w).length > 0) {
      writer.writeBlock(`subgraph ${id(w)}`, () => {
        writeSubgraph(g, w, writer);
      });
    } else if (v !== ROOT_NODE) {
      writer.writeLine(`${id(w)};'`);
    }
  });
}

function id(obj: any) {
  if (!obj) {
    return '1';
  }
  if (typeof obj === 'number') {
    return obj;
  }

  return `"${String(obj).replace(/"/g, '\\"')}"`;
}

function attrsToString(attrs?: Object) {
  if (attrs && isObject(attrs)) {
    const attrStrs = Object.entries(attrs).map(
      ([key, val]) => `${id(key)}=${id(val)}`
    );
    if (attrStrs.length) {
      return ` [${attrStrs.join(',')}]`;
    }
  }
  return '';
}

function makeWriter(INDENT = '') {
  let indent = '';
  let content = '';
  let shouldIndent = true;
  const write = (str: string) => {
    if (shouldIndent) {
      shouldIndent = false;
      content += indent;
    }
    content += str;
  };
  function indentfn() {
    indent += INDENT;
  }
  function unindent() {
    indent = indent.slice(INDENT.length);
  }
  function writeLine(line = '') {
    write(`${line}\n`);
    shouldIndent = true;
  }
  return {
    indent: indentfn,
    unindent,
    toString() {
      return content;
    },
    writeLine,
    writeBlock(str: string, fn: () => void) {
      writeLine(str + ' {');
      indentfn();
      fn();
      unindent();
      writeLine('}');
    },
    write: write,
  };
}

function isObject(value: unknown): boolean {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}
