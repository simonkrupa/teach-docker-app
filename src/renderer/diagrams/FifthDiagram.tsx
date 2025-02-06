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
import HostNodeEnhanced from '../components/diagram-nodes/HostNodeEnhanced';

const correctAnswers = require('../data/correctAnswers/fifthDiagram.json');

const nodeTypes = {
  containerNode: ContainerNode,
  networkNode: NetworkNode,
  hostNode: HostNode,
  hostNodeEnhanced: HostNodeEnhanced,
};

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 80 },
    type: 'containerNode',
    desiredNetwork: 'my-overlay',
    data: {
      label: '/my-nginx6',
      ip: undefined,
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
    id: '3',
    position: { x: 500, y: 80 },
    type: 'containerNode',
    desiredNetwork: 'my-overlay',
    data: {
      label: '/my-nginx7',
      ip: undefined,
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
    id: '-2',
    position: {
      x: 50,
      y: 20,
    },
    type: 'hostNodeEnhanced',
    data: {
      role: '',
      status: '',
      ip: '192.168.56.106',
      id: '',
      label: '',
      availability: undefined,
    },
    draggable: false,
  },
  {
    id: '-1',
    position: {
      x: 400,
      y: 20,
    },
    type: 'hostNodeEnhanced',
    data: {
      role: '',
      status: '',
      ip: '192.168.56.108',
      id: '',
      label: '',
      availability: undefined,
    },
    draggable: false,
  },
  {
    id: '2',
    position: { x: 270, y: 200 },
    type: 'networkNode',
    data: {
      label: 'my-overlay',
      subnet: undefined,
      driver: undefined,
      gateway: undefined,
      peers: undefined,
    },
    draggable: false,
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    targetHandle: 'left',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: 'e3-2',
    source: '3',
    target: '2',
    targetHandle: 'right',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
];

export default function FifthDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useNodesState(initialEdges);
  const containerEventListenerRef = useRef<() => void | null>(null);
  const networkEventListenerRef = useRef<() => void | null>(null);
  const hostEventListenerRef = useRef<() => void | null>(null);
  const nodeEventListenerRef = useRef<() => void | null>(null);
  const errorEventListenerRef = useRef<() => void | null>(null);
  const [messageBoxState, setMessageBoxState] = useState('hidden');
  const [startEdge, setStartEdge] = useState(null);
  const [deleteEdge, setDeleteEdge] = useState(null);
  const navigate = useNavigate();

  const startEdges = useCallback((nodeId) => {
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => {
        if (edge.source === nodeId) {
          setStartEdge(null);
          return { ...edge, hidden: false };
        }
        return edge;
      });
    });
  }, []);

  const deleteEdges = useCallback((nodeId) => {
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => {
        if (edge.source === nodeId) {
          setDeleteEdge(null);
          return { ...edge, hidden: true };
        }
        return edge;
      });
    });
  }, []);

  const onEdit = useCallback((newData) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (
          item.data.label === newData.label &&
          item.type === 'containerNode'
        ) {
          if (
            newData.status === 'running' &&
            newData.network === item.desiredNetwork
          ) {
            setStartEdge(item.id);
          } else {
            setDeleteEdge(item.id);
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
              mac: newData?.mac,
              eth: newData?.eth,
            },
          };
        }
        if (item.data.label === newData.name && item.type === 'networkNode') {
          if (newData.driver === undefined) {
            let flag = false;
            prevNodes.forEach((node) => {
              if (
                node.type === 'containerNode' &&
                node.data.state === 'running'
              ) {
                flag = true;
              }
            });
            if (flag) {
              return item;
            }
          }
          return {
            ...item,
            data: {
              ...item.data,
              subnet: newData.subnet,
              driver: newData.driver,
              gateway: newData.gateway,
              peers: newData.peers,
            },
          };
        }
        if (
          item.data.ip === newData.ip &&
          item.data.ip !== '' &&
          item.type === 'hostNodeEnhanced'
        ) {
          return {
            ...item,
            data: {
              ...item.data,
              role: newData.role,
              status: newData.status,
              ip: newData.ip,
              id: newData.id,
              label: newData.hostname,
              availability: newData.availability,
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
      console.log('handleIncomingData');
      setMessageBoxState('hidden');
      const jsonData = JSON.parse(data);
      console.log(jsonData);
      onEdit(jsonData);
    },
    [onEdit],
  );

  useEffect(() => {
    if (deleteEdge !== null) {
      deleteEdges(deleteEdge);
    }
  }, [deleteEdge, deleteEdges]);

  useEffect(() => {
    if (startEdge !== null) {
      startEdges(startEdge);
    }
  }, [startEdge, startEdges]);

  const handleStopListening = () => {
    window.electron.ipcRenderer.sendMessage('stop-listening');
  };

  const handleStartListening = () => {
    window.electron.ipcRenderer.sendMessage('start-listening-5');
  };

  const handleIncomingNetworkData = useCallback(
    (data) => {
      console.log('handleIncomingNetworkData');
      setMessageBoxState('hidden');
      const jsonData = JSON.parse(data);
      onEdit(jsonData);
    },
    [onEdit],
  );

  const handleIncomingNodeData = useCallback(
    (data) => {
      console.log('handleIncomingNodeData');
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

  const handleIncomingError = () => {
    alert('error');
    navigate('/settings');
  };

  useEffect(() => {
    console.log('FifthDiagram mounted');
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

    nodeEventListenerRef.current = window.electron.ipcRenderer.on(
      'node-vm-data',
      handleIncomingNodeData,
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

      if (networkEventListenerRef.current) {
        networkEventListenerRef.current();
      }

      if (hostEventListenerRef.current) {
        hostEventListenerRef.current();
      }

      if (nodeEventListenerRef.current) {
        nodeEventListenerRef.current();
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
        edges={edges}
        onEdgeUpdate={onEdgesChange}
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
