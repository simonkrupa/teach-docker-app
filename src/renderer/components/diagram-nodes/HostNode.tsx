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
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Top} />
      <div className="host-container">
        <div>Host</div>
        <div>{props.data.ip}</div>
      </div>
    </div>
  );
});

export default HostNode;
