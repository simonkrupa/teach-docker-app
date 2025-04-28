import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './Pages.css';
import { useProgress } from '../UserContext';

export default function Home() {
  const navigate = useNavigate();
  const { setUserData, progress, username } = useProgress();

  const handleProceedNavigation = () => {
    if (progress === '1') {
      window.electron.ipcRenderer.sendMessage('write-user-progress', [
        username,
      ]);
      setUserData(username, String(Number(progress) + 1));
    }
    navigate('/default-bridge/overview');
  };

  return (
    <div className="all-pages">
      <h1>Komunikácia kontajnerov</h1>
      <p>
        Toto je domovská stránka aplikácie na výučbu komunikácie docker
        kontajnerov.
      </p>
      <p>
        Aplikácia obsahuje úlohy na demonštráciu všetkých dostupných druhov
        docker sietí. Každá úloha obsahuje v prvej sekcií teoretickú časť danej
        docker siete. V druhej časti je špecifikovaná praktická úloha. V tretej
        časti sa nachádza vizualizačné plátno, kde sa odzrkadľuje aktuálny stav
        docker kontajnerov, sietí a sieťových prvkov relevantných pre danú
        úlohu.
      </p>

      <p>
        Pre splnenie úlohy je potrebné overiť správnosť úlohy tlačidlom
        nachádzajúcim sa na vizualizačnom plátne úlohy.
      </p>

      <p>Čo je docker TODO</p>

      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Start
      </Button>
    </div>
  );
}
