import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, useNodesState, Controls } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import { Button } from 'antd';
import ContainerNode from '../components/diagram-nodes/ContainerNode';
import NetworkNode from '../components/diagram-nodes/NetworkNode';
import nodesValidator from '../components/validators/nodesValidator';
import MessageBox from '../components/MessageBox';
import HostNode from '../components/diagram-nodes/HostNode';

const correctAnswers = require('../data/correctAnswers/fourthDiagram.json');

const nodeTypes = {
  containerNode: ContainerNode,
  // veth: Veth,
  networkNode: NetworkNode,
  hostNode: HostNode,
};

const initialNodes = [
  {
    id: '1',
    position: { x: 250, y: 200 },
    type: 'containerNode',
    data: {
      label: '/my-nginx5',
      ip: '',
      state: undefined,
      network: '',
      port: '',
      hostPort: '',
      mac: '',
      eth: '',
    },
    draggable: false,
  },
  {
    id: '0',
    position: {
      x: 50,
      y: 50,
    },
    type: 'hostNode',
    data: {
      label: 'Host',
      ip: 'undefined',
      hEth: '',
    },
    draggable: false,
  },
];

export default function FourthDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const containerEventListenerRef = useRef<() => void | null>(null);
  const hostEventListenerRef = useRef<() => void | null>(null);
  const [messageBoxState, setMessageBoxState] = useState('hidden');
  const errorEventListenerRef = useRef<() => void | null>(null);
  const navigate = useNavigate();

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
              mac: newData?.mac,
              eth: newData?.eth,
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

  const handleIncomingHostData = useCallback((data) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (item.type === 'hostNode') {
          return {
            ...item,
            data: {
              ...item.data,
              ip: data.ip,
              hEth: data.eth,
            },
          };
        }
        return item;
      });
      return updatedNodes;
    });
  }, []);

  const handleStopListening = () => {
    window.electron.ipcRenderer.sendMessage('stop-listening');
  };

  const handleStartListening = () => {
    window.electron.ipcRenderer.sendMessage('start-listening-4');
  };

  const handleValidateAnswer = () => {
    if (nodesValidator(nodes, correctAnswers)) {
      setMessageBoxState('success');
    } else {
      setMessageBoxState('error');
    }
  };

  const handleIncomingError = () => {
    alert('error');
    navigate('/settings');
  };

  useEffect(() => {
    console.log('FourthDiagram mounted');
    handleStartListening();

    // Add the event listener and store the cleanup function
    containerEventListenerRef.current = window.electron.ipcRenderer.on(
      'container-data',
      handleIncomingData,
    );

    hostEventListenerRef.current = window.electron.ipcRenderer.on(
      'host-ip-address',
      handleIncomingHostData,
    );

    errorEventListenerRef.current = window.electron.ipcRenderer.on(
      'error',
      handleIncomingError,
    );

    return () => {
      console.log('Component unmounted');
      handleStopListening();

      // Call the cleanup function if it exists
      if (containerEventListenerRef.current) {
        containerEventListenerRef.current();
      }

      if (hostEventListenerRef.current) {
        hostEventListenerRef.current();
      }

      if (errorEventListenerRef.current) {
        errorEventListenerRef.current();
      }
    };
  }, []);

  return (
    <div className="diagram-page">
      <ReactFlow
        className="diagram-background"
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
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
