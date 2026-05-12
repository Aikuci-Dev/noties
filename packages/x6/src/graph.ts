import { Graph } from "@antv/x6";

export function createGraphInstance({ container, gridSize }: { gridSize: number; container: HTMLElement }) {
  // https://x6.antv.antgroup.com/en/api/graph/graph
  return new Graph({
    container,
    virtual: true,
    interacting: {
      // // general
      // toolsAddable: false,

      // edge
      edgeMovable: false,
      edgeLabelMovable: false,
      arrowheadMovable: false,
      vertexMovable: false,
      vertexAddable: false,
      vertexDeletable: false,
      useEdgeTools: false,

      // node
      nodeMovable: false,
      magnetConnectable: false,
      stopDelegateOnDragging: false,
    },
    autoResize: true,
    background: { color: "#eee" },
    grid: {
      visible: true,
      type: "dot",
      size: gridSize,
      args: [{ color: "#bbb", thickness: 2 }],
    },
  });
}
