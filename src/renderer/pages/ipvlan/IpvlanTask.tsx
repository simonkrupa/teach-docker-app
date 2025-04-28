import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import ipvlanImage from 'assets/imgs/ipvlantask.jpg';
import DropdownWithHint from '../../components/Hint';

export default function IpvlanTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/ipvlan/seventh-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - ipvlan sieť</h1>
      <ol>
        <li>Vytvorenie docker ipvlan siete s názvom my-ipvlan.</li>
        <li>
          Vytvorenie 2 busybox docker kontajnerov pripojených na docker ipvlan
          sieť s názvami busybox-1 a busybox-2.
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>
      <img
        src={ipvlanImage}
        alt=""
        style={{
          width: '500px',
          height: '600px',
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
