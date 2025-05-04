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
      <h1>Prehľad - ipvlan sieť</h1>
      <p>
        Docker poskytuje sieťový mód ipvlan v podobe ovládača ipvlan. Ipvlan
        sieť umožňuje pripájanie kontajnerov priamo na hostiteľskú fyzickú sieť
        pomocou virtuálnych podrozhraní, ktoré na rozdiel od macvlan siete
        zdieľajú rovnakú mac adresu. Táto mac adresa je rovnaká ako mac adresa
        rodičovského sieťového rozhrania. Ipvlan sieť pracuje na vrstve 2 a 3
        oproti macvlan sieti, ktorá operuje len na sieťovej vrstve 2. Pri sieti
        ipvlan nie je potrebný promiskuitný mód, čo prináša zvýšenie bezpečnosti
        na rozdiel od macvlan siete. Ďalšou výhodou je podpora bezdrôtového
        pripojenia, ktoré macvlan sieť nepodporuje.
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
