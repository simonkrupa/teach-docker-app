import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function IpvlanOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/ipvlan/task');
  };
  return (
    <div className="all-pages">
      <h1>Ipvlan overview</h1>
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
