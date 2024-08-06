import { useCallback, useEffect, useRef } from 'react';
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
    position: { x: 140, y: 100 },
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
      x: 260,
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
  const eventListenerRef = useRef<() => void | null>(null);

  const onEdit = useCallback((newData) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (item.data.label === newData.label) {
          // console.log('Found node:', item);
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
      console.log('New nodes:', updatedNodes);
      return updatedNodes;
    });
  }, []);

  const handleIncomingData = useCallback(
    (data) => {
      console.log(Math.random());
      console.log('Incoming data:', data);
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

  // start TODO fixlo sa to ale teraz mi ide len vzdy jeden container naraz
  useEffect(() => {
    console.log('FirstDiagram mounted');
    handleStartListening();

    // Add the event listener and store the cleanup function
    eventListenerRef.current = window.electron.ipcRenderer.on(
      'container-data',
      handleIncomingData,
    );

    return () => {
      console.log('Component unmounted');
      handleStopListening();

      // Call the cleanup function if it exists
      if (eventListenerRef.current) {
        eventListenerRef.current();
      }
    };
  }, []);
  // stop

  // eventListenerRef = window.electron.ipcRenderer.on(
  //   'container-data',
  //   handleIncomingData,
  // );

  // useEffect(() => {
  //   console.log('FirstDiagram mounted');
  //   handleStartListening();
  //   return () => {
  //     console.log('Component unmounted');
  //     handleStopListening();
  //     eventListenerRef();
  //   };
  // }, []);

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
