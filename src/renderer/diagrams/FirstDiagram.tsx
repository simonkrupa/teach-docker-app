import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, useNodesState, Controls } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import { Button } from 'antd';
import { throttle } from 'lodash';
import ContainerNode from '../components/diagram-nodes/ContainerNode';
import NetworkNode from '../components/diagram-nodes/NetworkNode';
import nodesValidator from '../components/validators/nodesValidator';
import MessageBox from '../components/MessageBox';
import HostNode from '../components/diagram-nodes/HostNode';
import VethNode from '../components/diagram-nodes/VethNode';

import correctAnswers from '../data/correctAnswers/firstDiagram.json';

const nodeTypes = {
  containerNode: ContainerNode,
  hostNode: HostNode,
  networkNode: NetworkNode,
  vethNode: VethNode,
};

const initialNodes = [
  {
    id: '0',
    position: {
      x: 50,
      y: 50,
    },
    type: 'hostNode',
    data: {
      label: 'host',
      ip: 'undefined',
      hEth: '',
    },
    draggable: false,
  },
  {
    id: '1',
    position: {
      x: 140,
      y: 120,
    },
    type: 'containerNode',
    desiredNetwork: 'my-bridge',
    data: {
      label: '/my-nginx',
      ip: 'undefined',
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
    id: '2',
    position: {
      x: 340,
      y: 120,
    },
    type: 'containerNode',
    desiredNetwork: 'my-bridge',
    data: {
      label: '/my-nginx2',
      ip: 'undefined',
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
    position: {
      x: 220,
      y: 360,
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
  {
    id: 'v1',
    position: {
      x: 180,
      y: 280,
    },
    type: 'vethNode',
    desiredContainer: '/my-nginx',
    data: {
      label: undefined,
    },
    draggable: false,
  },
  {
    id: 'v2',
    position: {
      x: 320,
      y: 280,
    },
    type: 'vethNode',
    desiredContainer: '/my-nginx2',
    data: {
      label: undefined,
    },
    draggable: false,
  },
];

const initialEdges = [
  {
    id: '1-v1',
    source: '1',
    target: 'v1',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: 'v1-3',
    source: 'v1',
    target: '3',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: '2-v2',
    source: '2',
    target: 'v2',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: 'v2-3',
    source: 'v2',
    target: '3',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: '3-0',
    source: '3',
    sourceHandle: 'host',
    target: '0',
    animated: true,
    reconnectable: false,
    type: 'straight',
  },
];

export default function FirstDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useNodesState(initialEdges);
  const containerEventListenerRef = useRef<() => void | null>(null);
  const vethEventListenerRef = useRef<() => void | null>(null);
  const networkEventListenerRef = useRef<() => void | null>(null);
  const hostEventListenerRef = useRef<() => void | null>(null);
  const errorEventListenerRef = useRef<() => void | null>(null);
  const [messageBoxState, setMessageBoxState] = useState('hidden');
  const [startEdge, setStartEdge] = useState(null);
  const [deleteEdge, setDeleteEdge] = useState(null);
  const navigate = useNavigate();

  const resizeObserver = new ResizeObserver(throttle((entries) => {}, 100));

  const startEdges = useCallback((nodeId) => {
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => {
        if (edge.source === nodeId) {
          setStartEdge(null);
          return { ...edge, hidden: false };
        }
        const vethId = 'v' + nodeId;
        if (edge.source === vethId) {
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
        const vethId = 'v' + nodeId;
        if (edge.source === vethId) {
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
            setDeleteEdge(item.id);
          } else {
            setStartEdge(item.id);
          }
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
        if (
          item.type === 'vethNode' &&
          item.desiredContainer === newData.desiredContainer
        ) {
          return {
            ...item,
            data: {
              ...item.data,
              label: newData.label,
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
    window.electron.ipcRenderer.sendMessage('start-listening-1');
  };

  const handleIncomingNetworkData = useCallback(
    (data) => {
      setMessageBoxState('hidden');
      const jsonData = JSON.parse(data);
      onEdit(jsonData);
    },
    [onEdit],
  );

  const handleIncomingVethData = useCallback(
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

  const handleValidateAnswer = () => {
    if (nodesValidator(nodes, correctAnswers)) {
      setMessageBoxState('success');
      console.log('Correct');
    } else {
      setMessageBoxState('error');
      console.log('Incorrect');
    }
  };

  const handleIncomingError = () => {
    alert('error');
    navigate('/settings');
  };

  useEffect(() => {
    console.log('FirstDiagram mounted');
    handleStartListening();

    containerEventListenerRef.current = window.electron.ipcRenderer.on(
      'container-data',
      handleIncomingData,
    );

    networkEventListenerRef.current = window.electron.ipcRenderer.on(
      'network-data',
      handleIncomingNetworkData,
    );

    hostEventListenerRef.current = window.electron.ipcRenderer.on(
      'host-ip-address',
      handleIncomingHostData,
    );

    errorEventListenerRef.current = window.electron.ipcRenderer.on(
      'error',
      handleIncomingError,
    );

    vethEventListenerRef.current = window.electron.ipcRenderer.on(
      'veth-data',
      handleIncomingVethData,
    );

    return () => {
      console.log('Component unmounted');
      handleStopListening();

      if (containerEventListenerRef.current) {
        containerEventListenerRef.current();
      }

      if (networkEventListenerRef.current) {
        networkEventListenerRef.current();
      }

      if (hostEventListenerRef.current) {
        hostEventListenerRef.current();
      }

      if (errorEventListenerRef.current) {
        errorEventListenerRef.current();
      }

      if (vethEventListenerRef.current) {
        vethEventListenerRef.current();
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
            message="Úloha bola úspešne splnená."
          />
        )}
        {messageBoxState === 'error' && (
          <MessageBox
            type={messageBoxState}
            message="Výsledok úlohy nie je v správnom stave."
          />
        )}
        <Button
          className="validateButton"
          type="primary"
          onClick={handleValidateAnswer}
        >
          Overenie úlohy
        </Button>
      </ReactFlow>
    </div>
  );
}
