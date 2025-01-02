import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function NoneOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/none/task');
  };
  return (
    <div className="all-pages">
      <h1>None overview</h1>
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
