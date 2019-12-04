import { toDot } from '../dot';
import { createGraph } from '../index';

function setup() {
  const g = createGraph<any, any>({
    compound: true,
    directed: true,
  });
  g.setNode('1');
  g.setNode('2', { color: 'red' });
  g.setEdge('1', '2');
  g.setEdge('3', '4');
  g.setParent('4', '3');
  return {
    graph: g,
  };
}
describe('dot converted', () => {
  it('compound', () => {
    const { graph } = setup();
    expect(
      toDot(graph, { intend: '  ', compound: true, directed: true })
    ).toMatchSnapshot();
  });

  it('basic', () => {
    const { graph } = setup();
    expect(toDot(graph, { intend: '  ' })).toMatchSnapshot();
  });
});
