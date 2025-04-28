import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import mybridgeImage from 'assets/imgs/mybridge.jpg';
import DropdownWithHint from '../../components/Hint';

export default function BridgeTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/bridge/first-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - bridge sieť</h1>
      <p>Úloha pre realizáciu docker bridge siete:</p>
      <ol>
        <li>
          Vytvorenie novej docker siete bridge s názvom my-bridge s podsieťou
          172.19.0.0
        </li>
        <li>
          Vytvorenie 2 nginx kontajnerov s názvami my-nginx a my-nginx2
          pripojených na my-bridge sieť.
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
        src={mybridgeImage}
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
