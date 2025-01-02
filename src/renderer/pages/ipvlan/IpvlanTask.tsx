import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function IpvlanTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/ipvlan/seventh-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Ipvlan task</h1>
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
