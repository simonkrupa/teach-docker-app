import { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './NetworkNode.css';

const NetworkNode = memo(function NetworkNode(props) {
  const [networkNodeComponent, setNetworkNodeComponent] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (props.data.driver === undefined) {
      setNetworkNodeComponent(false);
    } else {
      setNetworkNodeComponent(true);
    }
    if (props.data.label.includes('docker_gwbridge')) {
      setLabel(props.data.label.slice(0, -1));
    } else {
      setLabel(props.data.label);
    }
  }, [props]);

  return (
    <div className="cloud-container">
      {networkNodeComponent ? (
        <div className="cloud">
          {/* <Handle type="source" id="cont" position={Position.Top} /> */}
          <Handle
            className="handle-postion-network"
            type="target"
            position={Position.Top}
          />
          <Handle type="target" id="left" position={Position.Left} />
          <Handle type="target" id="right" position={Position.Right} />
          <div className="grid-container">
            <div className="grid-item">
              <b>{label}</b>
            </div>
            <div className="grid-item">
              Driver: <b>{props.data.driver}</b>
            </div>
            <div className="grid-item">
              Subnet: <b>{props.data.subnet}</b>
            </div>
            <div className="grid-item">
              Gateway: <b>{props.data.gateway}</b>
            </div>
          </div>
          <Handle type="source" id="host" position={Position.Bottom} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
});

export default NetworkNode;
