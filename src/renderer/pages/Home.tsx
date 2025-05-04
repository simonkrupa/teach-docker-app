import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './Pages.css';
import dockerArch from 'assets/imgs/dockerarchtransparent.png';
import dockerImg from 'assets/imgs/docker-arch-transp.png';
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
      <h2>Docker</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <p style={{ maxWidth: '60%' }}>
          Docker je open-source platforma pre kontajnerizáciu aplikácií, pre
          zjednodušenie ich vývoja a nasadenia. Docker vytvára takzvané
          kontajnere. Tieto kontajnere obsahujú aplikácie, všetky potrebné
          závislosti, knižnice a nástroje pre beh týchto aplikácií. Kontajnere
          sú izolované od vonkajšieho prostredia rovnako ako virtuálne stroje.
          Na rozdiel od virtuálnych strojov si docker kontajnere nevytvárajú
          vlastný operačný systém, ale pracujú na rovnakom operačnom systéme ako
          ich hostiteľské zariadenie. Hlavnou výhodou tohto rozdielu je to, že
          docker kontajnere sú týmto menej záťažové pre systém a rýchlejšie
          spustiteľné. Kontajnere sú jednoducho prenášateľné, keďže všetky
          závislosti potrebné na beh kontajnerizovanej aplikácie sú
          predefinované v obraze kontajnera
        </p>
        <img
          src={dockerImg}
          alt=""
          className="images"
          style={{ height: '301px', width: '271px' }}
        />
      </div>
      <h3>Docker architektúra</h3>
      <p>
        Prácu s dockerom sprostredkovávajú dva základné objekty - kontajnere a
        obrazy. Docker obraz je vzor so sadou inštrukcií, podľa ktorých sa má
        vytvoriť docker kontajner. Kontajner je inštancia docker obrazu, s
        ktorou vieme pracovať, vieme ju zastaviť, vymazať, modifikovať. Docker
        využíva klient-server architektúru. Za fungovaním dockeru stoja tri
        komponenty: docker klient, docker daemon, docker registry. Docker klient
        je vrstva, pomocou ktorej používateľ interaguje s dockerom, môže to byť
        prostredníctvom terminálu, docker desktopu, čo je grafické rozhranie
        dockeru alebo iného externého rozhrania. Docker klient komunikuje s
        docker daemonom prostredníctvom REST API. Úlohou docker daemonu je
        príjmať signály od klienta a podľa nich vytvárať alebo modifikovať
        docker kontajnere, obrazy, siete. Aj klient, aj daemon môžu bežať na
        jednom hostiteľskom zariadení. Úlohou daemonu je spravovať register
        obrazov v hostiteľskom zariadení, ale takisto komunikuje s online docker
        registrom, nazývaným tiež dockerhub, kde môže nahrávať alebo sťahovať
        docker obrazy. Tento register slúži na nahrávanie docker obrazov, ktoré
        sú sprístupnené verejnosti alebo určitej skupine ľudí.
      </p>
      <img
        src={dockerArch}
        alt=""
        className="images"
        style={{ height: '291px', width: '589px' }}
      />
      <h3>Docker virtualizácia</h3>
      <p>
        Docker dosahuje virtualizáciu prostredia za pomoci cgroups a menných
        priestorov. Úlohou cgroups je limitovanie a kontrolovanie systémových
        prostriedkov pre skupiny procesov ako operačná pamäť, procesor. Majú
        stromovú štruktúru, kde koreňom štruktúry je samotný root a potomkovia
        sú skupiny procesov, ktoré zdieľajú rovnaké zdroje. Koreňová cgroup
        obsahuje všetky procesy systému. Existuje viacero typov cgroups a každý
        proces je reprezentovaný v každom type cgroups. Existujú napríklad
        pamäťové cgroups, ktoré alokujú a limitujú špecifickú časť pamäte pre
        skupinu procesov. Keď sa rozhodneme alokovať určité množstvo pamäte pre
        špecifickú skupinu procesov, táto informácia prechádza cez koreň cgroup
        štruktúry, ktorý zabezpečí, aby žiadna iná skupina nevyužila túto časť
        pamäte. Na druhú stranu menné priestory limitujú, čo môže skupina
        procesov vidieť. Menné priestory sú taktiež reprezentované stromovou
        štruktúrou. Opäť existuje viacero menných priestorov a každý proces sa
        nachádza v každom druhu menného priestoru. Poznáme pid menný priestor,
        ktorý zabezpečuje, že procesy v rámci jedného menného priestoru môžu
        vidieť iba ostatné procesy toho istého menného priestoru, čiže každý
        docker kontajner vidí len svoje vlastné procesy, akoby bol jediným
        zariadením v systéme. Sieťový menný priestor umožňuje každému kontajneru
        udeľovať a izolovať ich vlastné sieťové zdroje. Používateľské menné
        priestory slúžia na oddelenie právomocí rovnakých používateľov naprieč
        mennými priestormi. Čiže jeden používateľ systému je namapovaný na iné
        identifikačné číslo v mennom priestore hostiteľského zariadenia ako v
        prostredí kontajnera.
      </p>

      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Štart
      </Button>
    </div>
  );
}
