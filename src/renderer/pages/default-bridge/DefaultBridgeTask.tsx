import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function DefaultBridgeTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/default-bridge/second-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Default bridge task</h1>
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
