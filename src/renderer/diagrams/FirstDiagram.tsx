import { useCallback, useEffect } from 'react';
import { ReactFlow, useNodesState, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import ContainerNode from '../components/diagram-nodes/ContainerNode';

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
      label: '/my-nginx',
      ip: '172.22.168.91',
      state: undefined,
    },
  },
  {
    id: '2',
    position: {
      x: 250,
      y: 100,
    },
    type: 'containerNode',
    data: {
      label: '/my-nginx2',
      ip: 'undefined',
      state: undefined,
    },
  },
];

export default function FirstDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const onEdit = useCallback(
    (newData) => {
      const res = nodes.map((item) => {
        if (item.data.label === newData.label) {
          console.log('Found node:', item);
          return {
            ...item,
            data: {
              ...item.data,
              ip: newData.ip,
              label: newData.label,
              state: newData.status,
            },
          };
        }
        return item;
      });
      setNodes(res);
    },
    [nodes, setNodes],
  );

  const handleIncomingData = useCallback(
    (data) => {
      const jsonData = JSON.parse(data);
      onEdit(jsonData);
    },
    [onEdit],
  );

  const handleStopListening = () => {
    window.electron.ipcRenderer.sendMessage('stop-listening');
  };

  const handleStartListening = () => {
    window.electron.ipcRenderer.sendMessage('start-listening-1');
  };

  // useEffect(() => {
  // console.log('Inc event');
  window.electron.ipcRenderer.on('container-data', handleIncomingData);
  // }, [handleIncomingData]);

  useEffect(() => {
    console.log('FirstDiagram mounted');
    handleStartListening();
    return () => {
      console.log('Component unmounted');
      handleStopListening();
    };
  }, []);

  return (
    <div className="diagram-page">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        // defaultEdges={initialEdges}
        fitView
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
