import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './LanNode.css';
import { useTranslation } from 'react-i18next';

const LanNode = memo(function LanNode(props: any) {
  const { t } = useTranslation();
  return (
    <div className="lan-node">
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Top} />
      <div className="lan-container">
        <div className="en-node-name">{t('external_net')}</div>
        <div className="en-node-info">
          <div>CIDR: {props.data.cidr}</div>
          <div>MAC: {props.data.mac}</div>
        </div>
      </div>
    </div>
  );
});

export default LanNode;
