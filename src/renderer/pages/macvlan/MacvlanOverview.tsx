import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function MacvlanOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/maclvan/task');
  };
  return (
    <div className="all-pages">
      <h1>Macvlan overview</h1>
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
