import { Handle, Position } from 'reactflow';
import './ContainerNode.css';
import { memo, useEffect, useState } from 'react';
import { ContainerNodeProps } from '../../types/types';
import DockerLogo from '../../../../assets/Docker.png';

export function RunningState() {
  return (
    <div className="container-state">
      Running
      <div className="state-indicator-running" />
    </div>
  );
}

export function CreatedState() {
  return (
    <div className="container-state">
      Created
      <div className="state-indicator-paused" />
    </div>
  );
}

export function PausedState() {
  return (
    <div className="container-state">
      Paused
      <div className="state-indicator-paused" />
    </div>
  );
}

export function ExitedState() {
  return (
    <div className="container-state">
      Exited
      <div className="state-indicator-exited" />
    </div>
  );
}

const ContainerNodeEnhanced = memo(function ContainerNodeEnhanced(props) {
  const [containerNodeComponent, setContainerNodeComponent] = useState(false);

  let componentToRender;
  if (props?.data.state === 'running') {
    componentToRender = <RunningState />;
  } else if (props?.data.state === 'exited') {
    componentToRender = <ExitedState />;
  } else if (props?.data.state === 'paused') {
    componentToRender = <PausedState />;
  } else if (props?.data.state === 'created') {
    componentToRender = <CreatedState />;
  } else {
    componentToRender = <div />;
  }

  useEffect(() => {
    if (props?.data.state === undefined) {
      setContainerNodeComponent(false);
    } else {
      setContainerNodeComponent(true);
    }
  }, [props]);

  return (
    <div style={{ zIndex: '2' }}>
      {containerNodeComponent ? (
        <div className="text-updater-node-enhanced">
          <div style={{ display: 'flex' }}>
            <div className="container-category">{props.data.label}</div>
            {componentToRender}
          </div>
          <div className="ip-address1">
            <div>{props.data.eth}</div>
            <div>{props.data.ip}</div>
            <div>{props.data.mac}</div>
            <Handle type="source" id="handle1s" position={Position.Bottom} />
            <Handle type="target" id="handle1t" position={Position.Bottom} />
          </div>
          <div className="ip-address2">
            <div>{props.data.eth2}</div>
            <div>{props.data.ip2}</div>
            <div>{props.data.mac2}</div>
            <Handle type="source" id="handle2s" position={Position.Bottom} />
            <Handle type="target" id="handle2t" position={Position.Bottom} />
          </div>
          <img
            className="docker-image-logo"
            src={DockerLogo}
            alt="docker logo"
          />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
});

export default ContainerNodeEnhanced;
