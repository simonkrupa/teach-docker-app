import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function BridgeTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/bridge/first-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Bridge task</h1>
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
