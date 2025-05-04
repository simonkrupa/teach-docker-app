import { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './HostNodeEnhanced.css';

export function ReadyState() {
  return (
    <div className="host-state">
      Ready
      <div className="state-indicator-running" />
    </div>
  );
}

export function DownState() {
  return (
    <div className="host-state">
      Down
      <div className="state-indicator-exited" />
    </div>
  );
}

export function PausedState() {
  return (
    <div className="host-state">
      Paused
      <div className="state-indicator-paused" />
    </div>
  );
}

export function DisconnectedState() {
  return (
    <div className="host-state">
      Disconnected
      <div className="state-indicator-exited" />
    </div>
  );
}

export function UnknownState() {
  return (
    <div className="host-state">
      Unknown
      <div className="state-indicator-exited" />
    </div>
  );
}

export function DrainedState() {
  return (
    <div className="host-state">
      Drained
      <div className="state-indicator-exited" />
    </div>
  );
}

export function ActiveState() {
  return (
    <div className="host-state">
      Active
      <div className="state-indicator-running" />
    </div>
  );
}

const HostNodeEnhanced = memo(function HostNodeEnhanced(props: any) {
  const [hostNodeComponent, setHostNodeComponent] = useState(false);

  let componentToRender;
  if (props?.data.status === 'active') {
    componentToRender = <ActiveState />;
  } else if (props?.data.status === 'paused') {
    componentToRender = <PausedState />;
  } else if (props?.data.status === 'down') {
    componentToRender = <DownState />;
  } else if (props?.data.status === 'disconnected') {
    componentToRender = <DisconnectedState />;
  } else if (props?.data.status === 'ready') {
    componentToRender = <ReadyState />;
  } else if (props?.data.status === 'unknown') {
    componentToRender = <UnknownState />;
  } else if (props?.data.status === 'drained') {
    componentToRender = <DrainedState />;
  } else {
    componentToRender = <div />;
  }

  useEffect(() => {
    if (props?.data.availability === undefined) {
      setHostNodeComponent(false);
    } else {
      setHostNodeComponent(true);
    }
  }, [props]);

  return (
    <div>
      {hostNodeComponent ? (
        <div>
          <div className="host-node-enhanced">
            <div className="host-container-enhanced">
              <div style={{ display: 'flex' }}>
                <div className="host-category">{props.data.nodeLabel}</div>
                {componentToRender}
              </div>
              <div style={{ display: 'flex' }}>
                <div className="host-info">Rola: {props.data.role}</div>
                <div className="host-ip">IP: {props.data.ip}</div>
              </div>
            </div>
          </div>
          {/* <div className="host-network-interface">
            <Handle type="target" position={Position.Top} />
            {props.data.hEth}
          </div> */}
          <Handle type="target" position={Position.Bottom} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
});

export default HostNodeEnhanced;
