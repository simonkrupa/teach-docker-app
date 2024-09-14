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
import { throttle } from 'lodash';

const correctAnswers = require('../data/correctAnswers/firstDiagram.json');

const nodeTypes = {
  containerNode: ContainerNode,
  hostNode: HostNode,
  networkNode: NetworkNode,
};

const initialNodes = [
  {
    id: '0',
    position: {
      x: 210,
      y: 450,
    },
    type: 'hostNode',
    data: {
      label: 'host',
    },
  },
  {
    id: '1',
    position: {
      x: 100,
      y: 80,
    },
    type: 'containerNode',
    data: {
      label: '/my-nginx',
      ip: 'undefined',
      state: undefined,
      network: '',
      port: '',
      hostPort: '',
    },
    // draggable: false,
  },
  {
    id: '2',
    position: {
      x: 340,
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
    // draggable: false,
  },
  {
    id: '3',
    position: {
      x: 120,
      y: 300,
    },
    type: 'networkNode',
    data: {
      label: 'my-bridge',
      subnet: undefined,
      driver: undefined,
      gateway: undefined,
    },
    // draggable: false,
  },
];

const initialEdges = [
  {
    id: '1-3',
    source: '1',
    target: '3',
    animated: true,
    hidden: true,
  },
  {
    id: '2-3',
    source: '2',
    target: '3',
    animated: true,
    hidden: true,
  },
  {
    id: '3-0',
    source: '3',
    sourceHandle: 'host',
    target: '0',
    animated: true,
  },
];

export default function FirstDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useNodesState(initialEdges);
  const containerEventListenerRef = useRef<() => void | null>(null);
  const networkEventListenerRef = useRef<() => void | null>(null);
  const [messageBoxState, setMessageBoxState] = useState('hidden');
  const [startEdge, setStartEdge] = useState(null);
  const [deleteEdge, setDeleteEdge] = useState(null);

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
          if (newData.status === 'running') {
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

  const handleValidateAnswer = () => {
    console.log(edges);
    // if (nodesValidator(nodes, correctAnswers)) {
    //   setMessageBoxState('success');
    //   console.log('Correct');
    // } else {
    //   setMessageBoxState('error');
    //   console.log('Incorrect');
    // }
  };

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
        edges={edges}
        onEdgeUpdate={onEdgesChange}
        fitView
        // panOnDrag={false}
        // zoomOnScroll={false}
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
