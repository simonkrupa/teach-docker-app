import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import bridgeImage from 'assets/imgs/defaultbridgetask.jpg';
import DropdownWithHint from '../../components/Hint';

export default function DefaultBridgeTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/default-bridge/second-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - predvolená bridge sieť</h1>
      <ol>
        <li>
          Vytvorenie nginx kontajnera s názvom my-nginx3 pripojeného na
          predvolenú sieť bridge
        </li>
        <li>
          Vytvorenie alpine kontajnera s názvom my-alpine pripojeného na
          predvolenú sieť bridge
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>

      <p>
        Pre testovanie egress komunikácie môžete využiť príkaz ping. Takisto
        otestujte vzájomnú komunikáciu kontajnerov pomocou IP adresy a názvu
        kontajnera. Ingress si môžeme overiť prístupom na port 80 kde sa
        nachádza nginx server.
      </p>
      <img
        src={bridgeImage}
        alt=""
        style={{
          width: '500px',
          height: '500px',
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
