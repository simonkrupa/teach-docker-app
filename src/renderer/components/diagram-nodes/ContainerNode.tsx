import { Handle, Position } from 'reactflow';
import './ContainerNode.css';
import { memo, useEffect, useState } from 'react';

//TODO created status yellow

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

const ContainerNode = memo(function ContainerNode(props) {
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
    console.log('rendering', props);
    if (props?.data.state === undefined) {
      // console.log('ContainerNode component not rendered');
      setContainerNodeComponent(false);
    } else {
      // console.log('ContainerNode component rendered');
      setContainerNodeComponent(true);
    }
  }, [props]);

  return (
    <div style={{ zIndex: '2' }}>
      {containerNodeComponent ? (
        <div className="text-updater-node">
          <div style={{ display: 'flex' }}>
            <div className="container-category">{props.data.label}</div>
            {componentToRender}
          </div>
          <div className="ip-address">eth0: {props.data.ip}</div>
          <div>{props.data.network}</div>
          <div className="port-container-o">
            <div>Port: {props.data.port}</div>
            <div>HostPort: {props.data.hostPort}</div>
            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Bottom} />
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
});

export default ContainerNode;
