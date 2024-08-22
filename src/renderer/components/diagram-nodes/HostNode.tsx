import { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './HostNode.css';

const HostNode = memo(function HostNode() {
  // const [hostNodeComponent, setHostNodeComponent] = useState(false);

  // useEffect(() => {
  //   if (props.data.driver === undefined) {
  //     setHostNodeComponent(false);
  //   } else {
  //     setHostNodeComponent(true);
  //   }
  // }, [props]);

  return (
    <div>
      {/* {setHostNodeComponent ? ( */}
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Top} />
      <div className="host-container">Host</div>
    </div>
  );
});

export default HostNode;
