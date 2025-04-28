import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import overlayImage from 'assets/imgs/overlaytask.jpg';
import DropdownWithHint from '../../components/Hint';

export default function OverlayTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/overlay/fifth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - overlay sieť</h1>
      <ol>
        <li>
          Vytvorenie docker swarmu a pripojenie druhého virtuálneho stroja do
          swarmu.
        </li>
        <li>Vytvorenie docker overlay siete s názvom my-overlay.</li>
        <li>
          Vytvorenie nginx kontajnera na manažérskom stroji s názvom my-nginx6 a
          vytvore- nie nginx kontajnera na pracovníkovi s názvom my-nginx7.
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>
      <p>
        Pre testovanie egress komunikácie môžete využiť príkaz ping. Takisto
        otestujte vzájomnú komunikáciu kontajnerov pomocou IP adresy a názvu
        kontajnera. Ingress si môžeme overiť prístupom na port 80 kde sa
        nachádza nginx server. Pomocou príkazu tcpdump si môžete porovnať
        sieťovú komunikáciu pri egresse a vzájomnej kommunikácií kontajnerov.
      </p>
      <img
        src={overlayImage}
        alt=""
        style={{
          width: '700px',
          height: '794px',
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
