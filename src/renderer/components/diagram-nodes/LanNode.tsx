import { memo, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import './LanNode.css';

const LanNode = memo(function LanNode(props: any) {
  // useEffect(() => {
  //   if (props?.data?.ip !== undefined) {
  //     console.log('HostNode component not rendered');
  //   }
  // }, [props]);

  return (
    <div className="lan-node">
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Top} />
      <div className="lan-container">
        <div className="en-node-name">External Network</div>
        <div className="en-node-info">
          <div>Subnet: {props.data.cidr}</div>
          <div>MAC: {props.data.mac}</div>
        </div>
      </div>
    </div>
  );
});

export default LanNode;
