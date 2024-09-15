import { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './NetworkNode.css';

const NetworkNode = memo(function NetworkNode(props) {
  const [networkNodeComponent, setNetworkNodeComponent] = useState(false);

  useEffect(() => {
    if (props.data.driver === undefined) {
      setNetworkNodeComponent(false);
    } else {
      setNetworkNodeComponent(true);
    }
  }, [props]);

  return (
    <div>
      {networkNodeComponent ? (
        <div className="network-container">
          {/* <Handle type="source" id="cont" position={Position.Top} /> */}
          <Handle type="target" position={Position.Top} />
          <div className="grid-container">
            <div className="grid-item">
              Name: <b>{props.data.label}</b>
            </div>
            <div className="grid-item">
              Subnet: <b>{props.data.subnet}</b>
            </div>
            <div className="grid-item">
              Driver: <b>{props.data.driver}</b>
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
