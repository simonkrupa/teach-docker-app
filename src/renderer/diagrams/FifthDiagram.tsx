import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, useNodesState, Controls } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import 'reactflow/dist/style.css';
import './Diagrams.css';
import { Button } from 'antd';
import { throttle } from 'lodash';
import ResizeObserver from 'resize-observer-polyfill';
import ContainerNode from '../components/diagram-nodes/ContainerNode';
import NetworkNode from '../components/diagram-nodes/NetworkNode';
import nodesValidator from '../components/validators/nodesValidator';
import MessageBox from '../components/MessageBox';
import HostNode from '../components/diagram-nodes/HostNode';
import HostNodeEnhanced from '../components/diagram-nodes/HostNodeEnhanced';

import correctAnswers from '../data/correctAnswers/fifthDiagram.json';
import ContainerNodeEnhanced from '../components/diagram-nodes/ContainerNodeEnhanced';
import VethNode from '../components/diagram-nodes/VethNode';

const nodeTypes = {
  containerNode: ContainerNode,
  networkNode: NetworkNode,
  hostNode: HostNode,
  hostNodeEnhanced: HostNodeEnhanced,
  containerNodeEnhanced: ContainerNodeEnhanced,
  vethNode: VethNode,
};

const initialNodes = [
  {
    id: 'v1',
    position: {
      x: 120,
      y: 240,
    },
    type: 'vethNode',
    desiredContainer: '/my-nginx6',
    data: {
      label: undefined,
    },
    draggable: false,
  },
  {
    id: 'v3',
    position: {
      x: 480,
      y: 240,
    },
    type: 'vethNode',
    desiredContainer: '/my-nginx7',
    data: {
      label: undefined,
    },
    draggable: false,
  },
  {
    id: '1',
    position: { x: 100, y: 60 },
    type: 'containerNodeEnhanced',
    desiredNetwork: 'my-overlay',
    desiredNetwork2: 'docker_gwbridge1',
    data: {
      label: '/my-nginx6',
      ip: undefined,
      state: undefined,
      network: '',
      mac: '',
      eth: '',
      eth2: '',
      ip2: '',
      mac2: '',
      network2: '',
    },
    draggable: false,
  },
  {
    id: '3',
    position: { x: 460, y: 60 },
    type: 'containerNodeEnhanced',
    desiredNetwork: 'my-overlay',
    desiredNetwork2: 'docker_gwbridge2',
    data: {
      label: '/my-nginx7',
      ip: undefined,
      state: undefined,
      network: '',
      mac: '',
      eth: '',
      eth2: '',
      ip2: '',
      mac2: '',
      network2: '',
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
      hEth: '',
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
      //TODO
      ip: '192.168.56.108',
      id: '',
      label: '',
      availability: undefined,
      hEth: '',
    },
    draggable: false,
  },
  {
    id: '2',
    position: { x: 270, y: 170 },
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
  {
    id: '4',
    position: { x: 95, y: 300 },
    type: 'networkNode',
    data: {
      label: 'docker_gwbridge1',
      subnet: undefined,
      driver: undefined,
      gateway: undefined,
      peers: undefined,
    },
  },
  {
    id: '5',
    position: { x: 445, y: 300 },
    type: 'networkNode',
    data: {
      label: 'docker_gwbridge2',
      subnet: undefined,
      driver: undefined,
      gateway: undefined,
      peers: undefined,
    },
  },
];

const initialEdges = [
  {
    id: '1-v1',
    source: '1',
    target: 'v1',
    sourceHandle: 'handle2s',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: 'v1-4',
    source: 'v1',
    target: '4',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: '3-v3',
    source: '3',
    target: 'v3',
    sourceHandle: 'handle2s',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: 'v3-5',
    source: 'v3',
    target: '5',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: '4--2',
    source: '4',
    target: '-2',
    animated: true,
    reconnectable: false,
    type: 'straight',
  },
  {
    id: '5--1',
    source: '5',
    target: '-1',
    animated: true,
    reconnectable: false,
    type: 'straight',
  },
  // {
  //   id: '1-w1',
  //   source: '1',
  //   target: 'w1',
  //   sourceHandle: 'handle1s',
  //   animated: true,
  //   hidden: true,
  //   reconnectable: false,
  // },
  // {
  //   id: 'w1-2',
  //   source: 'w1',
  //   target: '2',
  //   animated: true,
  //   hidden: true,
  //   reconnectable: false,
  // },
  {
    id: '1-2',
    source: '1',
    target: '2',
    targetHandle: 'left',
    animated: true,
    hidden: true,
    reconnectable: false,
  },
  {
    id: '3-2',
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
  const vethEventListenerRef = useRef<() => void | null>(null);
  const nodeEventListenerRef = useRef<() => void | null>(null);
  const errorEventListenerRef = useRef<() => void | null>(null);
  const [messageBoxState, setMessageBoxState] = useState('hidden');
  const [startEdge, setStartEdge] = useState(null);
  const [deleteEdge, setDeleteEdge] = useState(null);
  const navigate = useNavigate();

  // Your existing ResizeObserver code
  const resizeObserver = new ResizeObserver(
    throttle((entries) => {
      // Your resize handling logic
    }, 100), // Adjust the throttle delay as needed
  );

  const startEdges = useCallback((nodeId) => {
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => {
        if (edge.source === nodeId) {
          setStartEdge(null);
          return { ...edge, hidden: false };
        }
        const vethId1 = 'v' + nodeId;
        const vethId2 = 'w' + nodeId;
        if (edge.source === vethId1) {
          setStartEdge(null);
          return { ...edge, hidden: false };
        }
        if (edge.source === vethId2) {
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
        const vethId1 = 'v' + nodeId;
        const vethId2 = 'w' + nodeId;
        if (edge.source === vethId1) {
          setDeleteEdge(null);
          return { ...edge, hidden: true };
        }
        if (edge.source === vethId2) {
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
          item.type === 'containerNodeEnhanced'
        ) {
          if (newData.status === 'running') {
            if (newData.network === item.desiredNetwork) {
              setStartEdge(item.id);
            }
            if (newData.network2 === item.desiredNetwork2) {
              console.log('start edge', newData, item);
              setStartEdge(item.id);
            }
          } else {
            setDeleteEdge(item.id);
          }

          if (newData.eth2) {
            return {
              ...item,
              data: {
                ...item.data,
                eth2: newData?.eth2,
                ip2: newData?.ip2,
                mac2: newData?.mac2,
              },
            };
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
          if (newData.driver === undefined) {
            let flag = false;
            prevNodes.forEach((node) => {
              if (
                node.type === 'containerNodeEnhanced' &&
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
              hEth: newData.eth,
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
    window.electron.ipcRenderer.sendMessage('start-listening-5');
  };

  const handleIncomingNetworkData = useCallback(
    (data) => {
      setMessageBoxState('hidden');
      const jsonData = JSON.parse(data);
      onEdit(jsonData);
    },
    [onEdit],
  );

  const handleIncomingNodeData = useCallback(
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

      if (nodeEventListenerRef.current) {
        nodeEventListenerRef.current();
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
