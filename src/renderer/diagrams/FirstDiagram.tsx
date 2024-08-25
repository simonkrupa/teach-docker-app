import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, useNodesState, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import { Button } from 'antd';
import ContainerNode from '../components/diagram-nodes/ContainerNode';
import NetworkNode from '../components/diagram-nodes/NetworkNode';
import nodesValidator from '../components/validators/nodesValidator';
import MessageBox from '../components/MessageBox';
import {
  DockerEventContainerData,
  DockerEventNetworkData,
} from '../types/types';

const correctAnswers = require('../data/correctAnswers/firstDiagram.json');

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
      port: '',
      hostPort: '',
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
      port: '',
      hostPort: '',
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
  const containerEventListenerRef = useRef<() => void | null>();
  const networkEventListenerRef = useRef<() => void | null>();
  const [messageBoxState, setMessageBoxState] = useState('hidden');

  const onEdit = useCallback(
    (newData: DockerEventContainerData | DockerEventNetworkData) => {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((item) => {
          if (
            item.data.label === newData.label &&
            item.type === 'containerNode'
          ) {
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
    },
    [],
  );

  const handleIncomingData = useCallback(
    (data: string) => {
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
    window.electron.ipcRenderer.sendMessage('start-listening-1');
  };

  const handleIncomingNetworkData = useCallback(
    (data: string) => {
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
      handleStopListening();
      if (containerEventListenerRef.current) {
        containerEventListenerRef.current();
      }

      if (networkEventListenerRef.current) {
        networkEventListenerRef.current();
      }
    };
  });

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
