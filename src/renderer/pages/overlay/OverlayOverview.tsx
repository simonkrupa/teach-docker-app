import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function OverlayOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/overlay/task');
  };
  return (
    <div className="all-pages">
      <h1>Overlay overview</h1>
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
