import { Handle, Position } from 'reactflow';
import './VethNode.css';
import { memo, useEffect, useState } from 'react';
import { VethNodeProps } from '../../types/types';

const VethNode = memo(function ContainerNode(props: VethNodeProps) {
  const [vethNodeComponent, setVethNodeComponent] = useState(false);

  useEffect(() => {
    if (props?.data.label === undefined) {
      setVethNodeComponent(false);
    } else {
      setVethNodeComponent(true);
    }
  }, [props]);

  return (
    <div>
      {vethNodeComponent ? (
        <div className="veth-node">
          <div>
            <div>{props.data.label}</div>
            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
});

export default VethNode;
