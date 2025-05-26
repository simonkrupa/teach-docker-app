import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import ipvlanImage from 'assets/imgs/ipvlan.drawio.png';
import DropdownWithHint from '../../components/Hint';

export default function IpvlanOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/ipvlan/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - IPVLAN sieť</h1>
      <p>
        Docker poskytuje sieťový mód IPVLAN v podobe ovládača ipvlan. IPVLAN
        sieť umožňuje pripájanie kontajnerov priamo na hostiteľskú fyzickú sieť
        pomocou virtuálnych podrozhraní, ktoré na rozdiel od MACVLAN siete
        zdieľajú rovnakú MAC adresu. Táto MAC adresa je rovnaká ako MAC adresa
        rodičovského sieťového rozhrania. IPVLAN sieť pracuje na vrstve 2 a 3
        oproti MACVLAN sieti, ktorá operuje len na sieťovej vrstve 2. Pri sieti
        IPVLAN nie je potrebný promiskuitný mód, čo prináša zvýšenie bezpečnosti
        na rozdiel od MACVLAN siete. Ďalšou výhodou je podpora bezdrôtového
        pripojenia, ktoré MACVLAN sieť nepodporuje.
      </p>

      <img
        src={ipvlanImage}
        alt=""
        style={{
          width: '411px',
          height: '451px',
          display: 'block',
          margin: '0 auto',
          marginTop: '20px',
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
