import { useCallback, useEffect } from 'react';
import { ReactFlow, useNodesState, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import ContainerNode from '../components/diagram-nodes/ContainerNode';
import { Button } from 'antd';

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
];

export default function FirstDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const onEdit = useCallback(
    (newData) => {
      const res = nodes.map((item) => {
        if (item.data.label === newData.label) {
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

  useEffect(() => {
    window.electron.ipcRenderer.on('container-data', handleIncomingData);
  }, [handleIncomingData]);

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
      <Button onClick={handleStopListening}>Stop</Button>
    </div>
  );
}
