import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function MacvlanTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/macvlan/sixth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Maclvan task</h1>
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
