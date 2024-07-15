import { Handle, Position, NodeProps } from 'reactflow';
import './ContainerNode.css';
import { useEffect, useState } from 'react';

export function RunningState() {
  return (
    <div className="container-state">
      Running
      <div className="state-indicator-running" />
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

export default function ContainerNode(props: NodeProps) {
  const [containerNodeComponent, setContainerNodeComponent] = useState(false);

  let componentToRender;
  if (props?.data.state === 'running') {
    componentToRender = <RunningState />;
  } else if (props?.data.state === 'exited') {
    componentToRender = <ExitedState />;
  } else if (props?.data.state === 'paused') {
    componentToRender = <PausedState />;
  } else {
    componentToRender = <div />;
  }

  const { data } = props;

  useEffect(() => {
    if (props?.data.state === undefined) {
      setContainerNodeComponent(false);
    } else {
      setContainerNodeComponent(true);
    }
    console.log('ContainerNode component rendered');
  }, [props]);

  return (
    <div>
      {containerNodeComponent ? (
        <div className="text-updater-node">
          <div style={{ display: 'flex' }}>
            <div className="container-category">{data.label}</div>
            {componentToRender}
          </div>
          <div className="ip-address">eth0: {data.ip}</div>
          <Handle type="source" position={Position.Bottom} />
          <Handle type="target" position={Position.Bottom} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
