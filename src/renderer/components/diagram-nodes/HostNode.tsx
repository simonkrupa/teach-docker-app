import { memo, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import './HostNode.css';

const HostNode = memo(function HostNode(props: any) {
  // useEffect(() => {
  //   if (props?.data?.ip !== undefined) {
  //     console.log('HostNode component not rendered');
  //   }
  // }, [props]);

  return (
    <div className="host-node">
      {/* <Handle type="source" position={Position.Top} /> */}
      <Handle type="source" id="target-lan" position={Position.Bottom} />

      <div className="host-container">
        <div className="host-node-category">Host</div>
        <div className="host-node-ip">{props.data.ip}</div>
      </div>
      <div className="host-network-interface">
        <Handle type="target" position={Position.Top} />
        {props.data.hEth}
      </div>
    </div>
  );
});

export default HostNode;
