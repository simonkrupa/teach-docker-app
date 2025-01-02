import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function DefaultBridgeOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/default-bridge/task');
  };
  return (
    <div className="all-pages">
      <h1>Default bridge overview</h1>
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Next
      </Button>
    </div>
  );
}
