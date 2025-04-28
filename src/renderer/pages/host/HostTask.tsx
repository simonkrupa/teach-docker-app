import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import hostImage from 'assets/imgs/hosttask.jpg';
import DropdownWithHint from '../../components/Hint';

export default function HostTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/host/third-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - host sieť</h1>
      <ol>
        <li>
          Vytvorenie docker kontajnera pripojeného na docker host sieť s názvom
          my-nginx4.
        </li>
        <li>Validácia prístupu ku kontajneru a jeho komunikácia.</li>
      </ol>
      <img
        src={hostImage}
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
