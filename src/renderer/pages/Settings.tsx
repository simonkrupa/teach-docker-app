import { useNavigate } from 'react-router-dom';
import { Button, Input, Space } from 'antd';
import './Pages.css';

export default function Settings() {
  const navigate = useNavigate();

  const handlePrimaryIpTest = () => {};

  const handleSecondaryIpTest = () => {};

  return (
    <div className="settings-page">
      <h1>SETTINGS</h1>
      <h2>Please provide IP Addresses for VMs with Docker</h2>
      <h3>Primary VM's IP address</h3>
      <div>
        <Space.Compact>
          <Input className="input-component" />
          <Button
            className="generic-button"
            type="primary"
            onClick={handlePrimaryIpTest}
          >
            Test
          </Button>
        </Space.Compact>
      </div>
      <h3>Secondary VM's IP address (for Overlay network task)</h3>
      <div>
        <Space.Compact>
          <Input className="input-component" />
          <Button
            className="generic-button"
            type="primary"
            onClick={handleSecondaryIpTest}
          >
            Test
          </Button>
        </Space.Compact>
      </div>
      <Button
        onClick={() => navigate('/')}
        className="generic-button"
        type="primary"
        style={{ marginTop: '30%' }}
      >
        Start
      </Button>
    </div>
  );
}
