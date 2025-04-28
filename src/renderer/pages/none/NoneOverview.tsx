import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import DropdownWithHint from '../../components/Hint';

export default function NoneOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/none/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - none sieť</h1>
      <p>
        None, žiadna sieť znamená, že sieť kontajnera je úplne vypnutá,
        kontajner je izolovaný od všetkých ostatných kontajnerov a aj od
        hostiteľského počítača. Kontajner nie je schopný komunikovať so žiadnou
        inou entitou a nepovoľuje ani ingress komunikáciu. Jediným sieťovým
        rozhraním vo vnútri kontajnera je loopback rozhranie.
      </p>
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Ďalej
      </Button>
      <DropdownWithHint />
    </div>
  );
}
