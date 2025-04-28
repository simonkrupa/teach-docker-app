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
import LanNode from '../components/diagram-nodes/LanNode';

import correctAnswers from '../data/correctAnswers/sixthDiagram.json';

const nodeTypes = {
  containerNode: ContainerNode,
  hostNode: HostNode,
  networkNode: NetworkNode,
  lanNode: LanNode,
};

const initialNodes = [
  {
    id: '0',
    position: {
      x: 50,
      y: 50,
    },
    type: 'hostNode',
    desiredNetwork: 'host',
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
      x: 250,
      y: 150,
    },
    type: 'containerNode',
    desiredNetwork: 'my-macvlan',
    data: {
      label: '/my-nginx8',
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
    id: '6',
    position: {
      x: 400,
      y: 150,
    },
    type: 'containerNode',
    desiredNetwork: 'my-macvlan',
    data: {
      label: '/my-nginx10',
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
    id: '4',
    position: { x: 85, y: 150 },
    type: 'containerNode',
    desiredNetwork: 'host',
    data: {
      label: '/my-nginx9',
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
    id: '2',
    position: {
      x: 300,
      y: 400,
    },
    type: 'networkNode',
    data: {
      label: 'my-macvlan',
      subnet: undefined,
      driver: undefined,
      gateway: undefined,
    },
    draggable: false,
  },
  {
    id: '5',
    position: {
      x: 250,
      y: 600,
    },
    type: 'lanNode',
    data: {
      cidr: '',
      mac: '',
    },
    draggable: false,
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: 'e6-2',
    source: '6',
    target: '2',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: 'e2-5',
    source: '2',
    sourceHandle: 'host',
    target: '5',
    animated: true,
    reconnectable: false,
    label: '',
  },
  {
    id: 'e4-0',
    source: '4',
    target: '0',
    animated: true,
    hidden: true,
    reconnectable: false,
    type: 'straight',
  },
  {
    id: 'e0-5',
    source: '0',
    sourceHandle: 'target-lan',
    target: '5',
    animated: true,
    reconnectable: false,
  },
];
export default function SixthDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useNodesState(initialEdges);
  const containerEventListenerRef = useRef<() => void | null>(null);
  const networkEventListenerRef = useRef<() => void | null>(null);
  const hostEventListenerRef = useRef<() => void | null>(null);
  const lanEventListenerRef = useRef<() => void | null>(null);
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
          setDeleteEdge(null, null);
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
              mac: newData?.mac,
              eth: newData?.eth,
            },
          };
        }
        if (item.data.label === newData.name && item.type === 'networkNode') {
          if (newData.parentInterface !== '') {
            setEdges((prevEdges) =>
              prevEdges.map((edge) =>
                edge.id === 'e2-5'
                  ? { ...edge, label: newData.parentInterface }
                  : edge,
              ),
            );
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
    window.electron.ipcRenderer.sendMessage('start-listening-6');
  };

  const handleIncomingLanData = useCallback((data) => {
    const jsonData = JSON.parse(data);
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (item.type === 'lanNode') {
          return {
            ...item,
            data: {
              ...item.data,
              cidr: jsonData.cidr,
              mac: jsonData.mac,
            },
          };
        }
        return item;
      });
      return updatedNodes;
    });
  }, []);

  const handleIncomingNetworkData = useCallback(
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
        if (item.type === 'containerNode' && item.desiredNetwork === 'host') {
          return {
            ...item,
            data: {
              ...item.data,
              ip: data.ip,
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
    console.log('SixthDiagram mounted');
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

    lanEventListenerRef.current = window.electron.ipcRenderer.on(
      'lan-data',
      handleIncomingLanData,
    );

    errorEventListenerRef.current = window.electron.ipcRenderer.on(
      'error',
      handleIncomingError,
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

      if (lanEventListenerRef.current) {
        lanEventListenerRef.current();
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
          <MessageBox type={messageBoxState} message="Úloha úspešne splnená" />
        )}
        {messageBoxState === 'error' && (
          <MessageBox
            type={messageBoxState}
            message="Úloha nesplnená, skontrolujte diagram"
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
