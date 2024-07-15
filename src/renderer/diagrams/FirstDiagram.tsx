import { useEffect } from 'react';
// import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import ContainerNode from '../components/diagram-nodes/ContainerNode';

export default function FirstDiagram() {
  const nodeTypes = {
    containerNode: ContainerNode,
    // veth: Veth,
    // networkType: NetworkType,
  };

  const initialNodes = [
    {
      id: '1',
      position: { x: 150, y: 300 },
      type: 'containerNode',
      data: {
        label: 'web',
        ip: '172.22.168.91',
        state: 'running',
      },
    },
  ];

  useEffect(() => {
    console.log('FirstDiagram component rendered');
  }, []);

  return (
    <div className="diagram-page">
      <ReactFlow
        defaultNodes={initialNodes}
        nodeTypes={nodeTypes}
        // defaultEdges={initialEdges}
        fitView
      />
    </div>
  );
}
