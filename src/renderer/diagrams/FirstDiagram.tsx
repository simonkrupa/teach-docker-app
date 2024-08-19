import { useCallback, useEffect, useRef } from 'react';
import { ReactFlow, useNodesState, Controls, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import ContainerNode from '../components/diagram-nodes/ContainerNode';
import NetworkNode from '../components/diagram-nodes/NetworkNode';

const nodeTypes = {
  containerNode: ContainerNode,
  // veth: Veth,
  networkNode: NetworkNode,
};

const initialNodes = [
  {
    id: '1',
    position: { x: 75, y: 80 },
    type: 'containerNode',
    data: {
      label: '/my-nginx',
      ip: '172.22.168.91',
      state: undefined,
      network: '',
    },
    draggable: false,
  },
  {
    id: '2',
    position: {
      x: 250,
      y: 80,
    },
    type: 'containerNode',
    data: {
      label: '/my-nginx2',
      ip: 'undefined',
      state: undefined,
      network: '',
    },
    draggable: false,
  },
  {
    id: '3',
    position: {
      x: 0,
      y: 0,
    },
    type: 'networkNode',
    data: {
      label: 'my-bridge',
      subnet: undefined,
      driver: undefined,
      gateway: undefined,
    },
    draggable: false,
  },
];

export default function FirstDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const containerEventListenerRef = useRef<() => void | null>(null);
  const networkEventListenerRef = useRef<() => void | null>(null);

  const onEdit = useCallback((newData) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (
          item.data.label === newData.label &&
          item.type === 'containerNode'
        ) {
          // console.log('Found node:', item);
          if (newData.network !== 'my-bridge') {
            item.position.y = 300;
          } else {
            item.position.y = 80;
          }
          return {
            ...item,
            data: {
              ...item.data,
              ip: newData.ip,
              label: newData.label,
              state: newData.status,
              network: newData.network,
            },
          };
        }
        if (item.data.label === newData.name && item.type === 'networkNode') {
          console.log('Found network node:', newData);
          return {
            ...item,
            data: {
              ...item.data,
              subnet: newData.subnet,
              driver: newData.driver,
              gateway: newData.gateway,
            },
          };
        }
        return item;
      });
      console.log(updatedNodes);
      return updatedNodes;
    });
  }, []);

  const handleIncomingData = useCallback(
    (data) => {
      console.log(Math.random());
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

  const handleIncomingNetworkData = useCallback(
    (data) => {
      const jsonData = JSON.parse(data);
      onEdit(jsonData);
    },
    [onEdit],
  );

  useEffect(() => {
    console.log('FirstDiagram mounted');
    handleStartListening();

    // Add the event listener and store the cleanup function
    containerEventListenerRef.current = window.electron.ipcRenderer.on(
      'container-data',
      handleIncomingData,
    );

    networkEventListenerRef.current = window.electron.ipcRenderer.on(
      'network-data',
      handleIncomingNetworkData,
    );

    return () => {
      console.log('Component unmounted');
      handleStopListening();

      // Call the cleanup function if it exists
      if (containerEventListenerRef.current) {
        containerEventListenerRef.current();
      }

      if (networkEventListenerRef.current) {
        networkEventListenerRef.current();
      }
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
