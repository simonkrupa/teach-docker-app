import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import noneImage from 'assets/imgs/nonetask.jpg';
import DropdownWithHint from '../../components/Hint';

export default function NoneTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/none/fourth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - none sieť</h1>
      <ol>
        <li>
          Vytvorenie docker kontajnera pripojeného na docker none sieť s názvom
          my-nginx5.
        </li>
        <li>Validácia prístupu ku kontajneru a jeho komunikácia.</li>
      </ol>
      <p>
        Pre testovanie egress komunikácie môžete využiť príkaz ping. Takisto
        otestujte vzájomnú komunikáciu kontajnerov pomocou IP adresy. Ingress si
        môžeme overiť prístupom na port 80 kde sa nachádza nginx server.
      </p>
      <img
        src={noneImage}
        alt=""
        style={{
          width: '500px',
          height: '505px',
          display: 'block',
          margin: '0 auto',
        }}
      />
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
