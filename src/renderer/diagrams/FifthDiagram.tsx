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
import OverlayNetworkNode from '../components/diagram-nodes/OverlayNetworkNode';

const nodeTypes = {
  containerNode: ContainerNode,
  networkNode: NetworkNode,
  hostNode: HostNode,
  hostNodeEnhanced: HostNodeEnhanced,
  containerNodeEnhanced: ContainerNodeEnhanced,
  vethNode: VethNode,
  overlayNetworkNode: OverlayNetworkNode,
};

const initialNodes = [
  {
    id: '12',
    position: {
      x: 50,
      y: 500,
    },
    type: 'overlayNetworkNode',
    data: {
      label: '',
      namespace: '',
      veth1: '',
      veth2: '',
      br1: '',
      br2: '',
      vxlan1: '',
      vxlan2: '',
    },
    draggable: false,
    reconnectable: false,
    hidden: true,
  },
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
      ip: '192.168.56.106qwewq',
      nodeId: '',
      nodeLabel: '',
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
      ip: '192.168.56.108ewqeqw',
      nodeId: '',
      nodeLabel: '',
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
    draggable: false,
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
    draggable: false,
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
  {
    id: '2detail',
    source: '2',
    target: '12',
    type: 'smoothstep',
    reconnectable: false,
    label: 'Overlay in detail',
    labelStyle: { fill: 'black', fontWeight: 'bold', fontSize: '10px' },
  },
  {
    id: '12-veth1',
    source: '12',
    sourceHandle: '12-1',
    targetHandle: 'veth1-target',
    target: '12',
    animated: true,
    type: 'straight',
    // hidden: true,
  },
  {
    id: '12-veth2',
    source: '12',
    sourceHandle: '12-2',
    targetHandle: 'veth2-target',
    target: '12',
    animated: true,
    type: 'straight',
    // hidden: true,
  },
  {
    id: '12-br1',
    source: '12',
    sourceHandle: 'veth1-source',
    targetHandle: 'br1-target',
    target: '12',
    animated: true,
    // hidden: true,
  },
  {
    id: '12-br2',
    source: '12',
    sourceHandle: 'veth2-source',
    targetHandle: 'br2-target',
    target: '12',
    animated: true,
    // hidden: true,
  },
  {
    id: '12-vxlan1',
    source: '12',
    sourceHandle: 'br1-source',
    targetHandle: 'vxlan1-target',
    target: '12',
    animated: true,
    // hidden: true,
  },
  {
    id: '12-vxlan2',
    source: '12',
    sourceHandle: 'br2-source',
    targetHandle: 'vxlan2-target',
    target: '12',
    animated: true,
    // hidden: true,
  },
  {
    id: '12-udp',
    source: '12',
    targetHandle: 'vxlan1-udp-target',
    sourceHandle: 'vxlan2-source',
    target: '12',
    markerEnd: { type: 'arrow', color: 'black' },
    markerStart: { type: 'arrow', color: 'black' },
    style: { stroke: 'black' },
    // hidden: true,
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
  const nodesIpEventListenerRef = useRef<() => void | null>(null);
  const overlayNetworkPropEventListenerRef = useRef<() => void | null>(null);
  const [messageBoxState, setMessageBoxState] = useState('hidden');
  const [startEdge, setStartEdge] = useState(null);
  const [deleteEdge, setDeleteEdge] = useState(null);
  const navigate = useNavigate();
  const [isOverlayRunning, setIsOverlayRunning] = useState({
    node1: false,
    node2: false,
  });

  const resizeObserver = new ResizeObserver(throttle((entries) => {}, 100));

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

  useEffect(() => {
    if (isOverlayRunning.node1 && isOverlayRunning.node2) {
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          if (node.type === 'overlayNetworkNode') {
            return {
              ...node,
              hidden: false,
            };
          }
          return node;
        });
      });
    } else {
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          if (node.type === 'overlayNetworkNode') {
            return {
              ...node,
              hidden: true,
            };
          }
          return node;
        });
      });
    }
  }, [isOverlayRunning]);

  const onEdit = useCallback((newData) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (
          item.type === 'overlayNetworkNode' &&
          newData.nodeType === 'overlayNetworkNode'
        ) {
          if (newData.containerName === '/my-nginx6') {
            if (newData.vxlan !== '') {
              setIsOverlayRunning((prev) => {
                return {
                  ...prev,
                  node1: true,
                };
              });
            } else {
              setIsOverlayRunning((prev) => {
                return {
                  ...prev,
                  node1: false,
                };
              });
            }
            return {
              ...item,
              data: {
                ...item.data,
                namespace: newData.namespace,
                veth1: newData.veth,
                br1: newData.bridge,
                vxlan1: newData.vxlan,
              },
            };
          }
          if (newData.containerName === '/my-nginx7') {
            if (newData.vxlan !== '') {
              setIsOverlayRunning((prev) => {
                return {
                  ...prev,
                  node2: true,
                };
              });
            } else {
              setIsOverlayRunning((prev) => {
                return {
                  ...prev,
                  node2: false,
                };
              });
            }
            return {
              ...item,
              data: {
                ...item.data,
                namespace: newData.namespace,
                veth2: newData.veth,
                br2: newData.bridge,
                vxlan2: newData.vxlan,
              },
            };
          }
        }
        if (
          item.data.label === newData.label &&
          item.type === 'containerNodeEnhanced'
        ) {
          if (newData.status === 'running') {
            if (newData.network === item.desiredNetwork) {
              setStartEdge(item.id);
            }
            if (newData.network2 === item.desiredNetwork2) {
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
              nodeId: newData.id,
              nodeLabel: newData.hostname,
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

  const handleNodesIp = (data) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((item) => {
        if (item.id === '-2') {
          return {
            ...item,
            data: {
              ...item.data,
              ip: data.ip1,
            },
          };
        }
        if (item.id === '-1') {
          return {
            ...item,
            data: {
              ...item.data,
              ip: data.ip2,
            },
          };
        }
        return item;
      });
      return updatedNodes;
    });
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
    nodesIpEventListenerRef.current = window.electron.ipcRenderer.on(
      'set-nodes-ip',
      handleNodesIp,
    );
    overlayNetworkPropEventListenerRef.current = window.electron.ipcRenderer.on(
      'overlay-network-prop',
      handleIncomingData,
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

      if (nodesIpEventListenerRef.current) {
        nodesIpEventListenerRef.current();
      }

      if (overlayNetworkPropEventListenerRef.current) {
        overlayNetworkPropEventListenerRef.current();
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
          Overenie úlohy
        </Button>
      </ReactFlow>
    </div>
  );
}
