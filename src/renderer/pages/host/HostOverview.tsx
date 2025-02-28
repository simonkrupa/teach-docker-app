import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function HostOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/host/task');
  };
  return (
    <div className="all-pages">
      <h1>Host overview</h1>
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
