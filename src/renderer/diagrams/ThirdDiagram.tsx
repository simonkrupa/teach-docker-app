import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, useNodesState, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import ContainerNode from '../components/diagram-nodes/ContainerNode';
import NetworkNode from '../components/diagram-nodes/NetworkNode';
import { Button } from 'antd';
import nodesValidator from '../components/validators/nodesValidator';
import MessageBox from '../components/MessageBox';
import HostNode from '../components/diagram-nodes/HostNode';

const correctAnswers = require('../data/correctAnswers/thirdDiagram.json');

const nodeTypes = {
  containerNode: ContainerNode,
  // veth: Veth,
  networkNode: NetworkNode,
  hostNode: HostNode,
};

const initialNodes = [
  {
    id: '1',
    position: { x: 75, y: 80 },
    type: 'containerNode',
    data: {
      label: '/my-nginx4',
      ip: '172.22.168.91',
      state: undefined,
      network: '',
      port: '',
      hostPort: '',
    },
    draggable: false,
  },
  {
    id: '2',
    position: {
      x: 100,
      y: 300,
    },
    type: 'hostNode',
    data: {
      label: 'Host',
    },
    // draggable: false,
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    // hidden: true,
  },
];

export default function ThirdDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const containerEventListenerRef = useRef<() => void | null>(null);
  const networkEventListenerRef = useRef<() => void | null>(null);
  const [messageBoxState, setMessageBoxState] = useState('hidden');

  const onEdit = useCallback((newData) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (
          item.data.label === newData.label &&
          item.type === 'containerNode'
        ) {
          return {
            ...item,
            data: {
              ...item.data,
              ip: newData.ip,
              label: newData.label,
              state: newData.status,
              network: newData.network,
              port: newData?.port || '',
              hostPort: newData?.hostPort || '',
            },
          };
        }
        if (item.data.label === newData.name && item.type === 'networkNode') {
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
      return updatedNodes;
    });
  }, []);

  const handleIncomingData = useCallback(
    (data) => {
      setMessageBoxState('hidden');
      const jsonData = JSON.parse(data);
      onEdit(jsonData);
    },
    [onEdit],
  );

  const handleStopListening = () => {
    window.electron.ipcRenderer.sendMessage('stop-listening');
  };

  const handleStartListening = () => {
    window.electron.ipcRenderer.sendMessage('start-listening-3');
  };

  const handleIncomingNetworkData = useCallback(
    (data) => {
      setMessageBoxState('hidden');
      const jsonData = JSON.parse(data);
      onEdit(jsonData);
    },
    [onEdit],
  );

  const handleValidateAnswer = () => {
    if (nodesValidator(nodes, correctAnswers)) {
      setMessageBoxState('success');
    } else {
      setMessageBoxState('error');
    }
  };

  useEffect(() => {
    console.log('ThirdDiagram mounted');
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
        defaultEdges={initialEdges}
        fitView
      >
        <Controls showInteractive={false} />
        {messageBoxState === 'success' && (
          <MessageBox
            type={messageBoxState}
            message="Task completed successfully"
          />
        )}
        {messageBoxState === 'error' && (
          <MessageBox
            type={messageBoxState}
            message="Not all requirements fulfilled"
          />
        )}
        <Button
          // style={{ zIndex: 100 }}
          className="validateButton"
          type="primary"
          onClick={handleValidateAnswer}
        >
          Validate Answer
        </Button>
      </ReactFlow>
    </div>
  );
}
