import { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './HostNode.css';

const HostNode = memo(function HostNode() {
  return (
    <div className="host-node">
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Top} />
      <div className="host-container">Host</div>
    </div>
  );
});

export default HostNode;
