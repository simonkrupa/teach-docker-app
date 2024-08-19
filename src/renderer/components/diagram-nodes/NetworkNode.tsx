import { memo } from 'react';
import './NetworkNode.css';

const NetworkNode = memo(function NetworkNode(props) {
  return (
    <div className="network-container">
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
    </div>
  );
});

export default NetworkNode;
