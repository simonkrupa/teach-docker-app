import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import macvlanImage from 'assets/imgs/macvlantask.jpg';
import DropdownWithHint from '../../components/Hint';

export default function MacvlanTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/macvlan/sixth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - macvlan sieť</h1>
      <ol>
        <li>Vytvorenie docker macvlan siete s názvom my-macvlan.</li>
        <li>
          Vytvorenie 2 nginx docker kontajnerov pripojených na docker macvlan
          sieť s názvami my-nginx8 a my-nginx10.
        </li>
        <li>
          Vytvorenie nginx kontajnera pripojeného na docker host sieť s názvom
          my-nginx9.
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>
      <img
        src={macvlanImage}
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
