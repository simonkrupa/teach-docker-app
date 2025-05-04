import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './OverlayNetworkNode.css';

const OverlayNetworkNode = memo(function OverlayNetworkNode(props: any) {
  return (
    <div className="network-container">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} id="12-1" />
      <Handle type="source" position={Position.Top} id="12-2" />
      <div className="overlay-id">Menný priestor: {props.data.namespace}</div>
      <div className="containers-wrapper">
        <div className="veth-cont left">
          <div className="veth-box">
            <Handle type="target" id="veth1-target" position={Position.Top} />
            {props.data.veth1}
            <Handle
              type="source"
              id="veth1-source"
              position={Position.Bottom}
            />
          </div>
        </div>
        <div className="br0-container left">
          <div className="br-container">
            <div className="br">
              <Handle
                type="target"
                id="br1-target"
                position={Position.Top}
                style={{ top: '-30px' }}
              />
              {props.data.br1}
              <Handle type="source" id="br1-source" position={Position.Right} />
            </div>
          </div>
        </div>
        {/* Left VXLAN */}
        <div className="vxlan-container left">
          <div className="vxlan-box">
            <Handle type="target" id="vxlan1-target" position={Position.Left} />
            {props.data.vxlan1}
            <Handle
              type="target"
              id="vxlan1-udp-target"
              position={Position.Right}
            />
          </div>
        </div>
        {/* Right VXLAN */}
        <div className="vxlan-container right">
          <div className="vxlan-box">
            <Handle
              type="target"
              id="vxlan2-target"
              position={Position.Right}
            />
            {props.data.vxlan2}
            <Handle type="source" id="vxlan2-source" position={Position.Left} />
          </div>
        </div>
        {/* Right Side */}
        <div className="veth-cont right">
          <div className="veth-box">
            <Handle type="target" id="veth2-target" position={Position.Top} />{' '}
            {props.data.veth2}
            <Handle
              type="source"
              id="veth2-source"
              position={Position.Bottom}
            />
          </div>
        </div>
        <div className="br0-container right">
          <div className="br-container">
            <div className="br">
              <Handle
                type="target"
                id="br2-target"
                position={Position.Top}
                style={{ top: '-30px' }}
              />
              {props.data.br2}
              <Handle type="source" id="br2-source" position={Position.Left} />
            </div>
          </div>
        </div>
        {/* Connection Lines */}
        <div className="connection-label">UDP 4789</div>
      </div>
    </div>
  );
});

export default OverlayNetworkNode;
