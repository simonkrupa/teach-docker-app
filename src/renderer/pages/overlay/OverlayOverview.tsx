import { useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'antd';
import '../Pages.css';
import overlayImage1 from 'assets/imgs/overlay1.png';
import overlayImage2 from 'assets/imgs/overlay2.png';
import overlaySwarmImage from 'assets/imgs/swarm-overlay.png';
import DropdownWithHint from '../../components/Hint';

export default function OverlayOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/overlay/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - overlay sieť</h1>
      <p>
        Doposiaľ sme si predstavili len možnosti prepojenia kontajnerov v rámci
        jedného hostiteľského počítača. Nevyhnuteľnou potrebou v reálnom,
        produkčnom prostredí je taktiež komunikácia a prepájanie kontajnerov
        naprieč viacerými hostiteľskými strojmi, na ktorých beží Docker. Na
        tento účel nám slúži overlay sieť. Na realizáciu docker overlay siete
        musíme vytvoriť docker swarm na hlavnom hostiteľskom zariadení, ktoré
        bude zohrávať úlohu manažéra a pripojiť všetky ostatné hostiteľské
        zariadenia do tohto swarmu. Tieto zvyšné hostiteľské stroje sa budú
        nazývať pracovníci. Docker swarm nám slúži pri získavaní, zachovávaní a
        synchronizovaní údajov o jednotlivých hostiteľských zariadeniach a ich
        sieťových údajoch. Toto je dôležité pri komunikácii, pretože poskytuje
        sieti overlay informácie, kde sa nachádza cieľový docker kontajner, na
        ktorý chceme odoslať pakety. Demonštráciu overlay siete môžeme vidieť na
        obrázku 9. Avšak komunikácia vrámci overlay siete nie je až tak
        jednoduchá, pretože v skutočnosti dochádza ku viacvrstvovému zabaľovaniu
        dát, ktoré posielame cez túto sieť. Na realizáciu tejto komunikácie sa
        využíva technológia VXLAN. Segmenty dát posielané kontajnerom
        prostredníctvom overlay siete dostávajú ip hlavičku obsahujúcu ip adresu
        odosielateľa a príjmateľa. Ip paket je následne zaobalený ethernetovým
        rámcom. Aby sme dokázali presunúť paket cez fyzickú sieť, je rámec
        zaobalený VXLAN hlavičkou, ktorá obsahuje 24 bitové identifikačné číslo
        siete - VNI. Dáta sú zbalené do UDP datagramu a ďalej dostávajú ip
        hlavičku s ip adresou hostiteľského stroja, na ktorom sa docker
        kontajner nachádza a ip adresou príjmateľského hostiteľského stroja, na
        ktorom beží docker kontajner, ktorému dáta posielame. Paket je opäť
        zabalený do ethernetového rámcu s mac adresami odosielateľa a príjmateľa
        a takto sa dostáva cez fyzickú sieť do cieľového hostiteľského stroja,
        kde je rámec postupne odbalený a dostáva sa do príslušného docker
        kontajnera.
      </p>
      <img
        src={overlayImage1}
        alt=""
        className="images"
        style={{ height: '250px' }}
      />
      <p></p>
      <img
        src={overlayImage2}
        alt=""
        className="images"
        style={{ height: '450px' }}
      />
      <p>
        Po vytvorení docker overlay siete prostredníctvom docker swarmu docker
        engine automaticky vytvára vxlan tunel a linux bridge v mennom sieťovom
        priestore pod rovna- kým názvom ako je id overlay siete. Čiže tieto
        sieťové prvky sa nevytvárajú v mennom sieťovom priestore hostiteľského
        počítača, ale sú izolované do vlastného menného sieťo- vého priestoru.
        Tu sa taktiež nachádza virtuálny ethernetový pár, ktorý prepája sieťové
        rozhranie nachádzajúce sa v priestore docker kontajnera a linuxový
        bridge nachádzajúci sa v mennom sieťovom priestore siete. Z bridgu sú
        dáta presúvané do vxlan tunela.
      </p>
      <p>
        Docker swarm manažér po vytvorení overlay siete zabezpečuje vytvorenie
        úložiska, ktoré bude držať údaje o všetkých kontajneroch, ich VTEP a VNI
        nachádzajúcej sa v danej overlay sieti. Manažér je zodpovedný za
        synchronizáciu týchto údajov medzi všetkými pracovníkmi v swarme a v
        prípade, že do siete sa pripojí nové zariadenie, všetky zvyšné
        zariadenia sú touto udalosťou oboznámené a ich úložisko sa aktualizuje.
      </p>
      <p>
        V prípade využitia Docker swamu docker engine taktiež automaticky
        vytvorí docker bridge sieť pod názvom docker gwbridge v mennom priestore
        hostiteľského stroja, na ktorú sa napája ďalšie sieťové rozhranie
        nachádzajúce sa v docker kontajneri. Docker gwbridge plní funkciu
        egressu, výstupu dát z kontajnera do vonkajšieho sveta a komunikácia
        medzi kontajnermi je zakázaná.
      </p>
      <img
        src={overlaySwarmImage}
        alt=""
        className="images"
        style={{ height: '300px' }}
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
