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
        <div>LAN</div>
        <div>{props.data.cidr}</div>
        <div>{props.data.mac}</div>
      </div>
    </div>
  );
});

export default LanNode;
