import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './LanNode.css';

const LanNode = memo(function LanNode(props: any) {
  return (
    <div className="lan-node">
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Top} />
      <div className="lan-container">
        <div className="en-node-name">Externá sieť</div>
        <div className="en-node-info">
          <div>CIDR: {props.data.cidr}</div>
          <div>MAC: {props.data.mac}</div>
        </div>
      </div>
    </div>
  );
});

export default LanNode;
