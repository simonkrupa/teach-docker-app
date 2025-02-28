import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function HostTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/host/third-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Host task</h1>
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
