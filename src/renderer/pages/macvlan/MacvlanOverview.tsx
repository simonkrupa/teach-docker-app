import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import macvlanImage from 'assets/imgs/macvlan.png';

export default function MacvlanOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/macvlan/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - macvlan sieť</h1>
      <p>
        Pre macvlan sieť poskytuje docker ovládač s názvom macvlan. Pomocou
        tohto ovládača vieme vytvoriť docker macvlan sieť pomocou módu bridge a
        využívať ju v našich kontajneroch. Macvlan sieť umožňuje priraďovať
        každému kontajneru unikátnu MAC adresu, vďaka čomu sú na lokálnej sieti
        prezentované ako samostatné zariadenia. Kontajnere pripojené na macvlan
        sieť sa priamo pripájajú na fyzickú sieť. Pri macvlan sieti je potrebné
        zadefinovať takzvané rodičovské sieťové rozhranie, pomocou ktorého
        komunikuje lokálne zariadenie s vonkajším svetom. Rovnako je potrebné
        zadefinovať podsieť a bránu lokálnej siete. Macvlan sieť je vďaka týmto
        informáciám schopná priraďovať každému novému kontajneru ip adresu z
        lokálnej siete. Táto sieť je výhodná v prípade, že kontajner chceme
        pripojiť priamo na externú sieť bez využitia ďalších vrstiev ako je
        bridge, technológia NAT alebo VXLAN, ktoré sú využívané napríklad pri
        docker sieti bridge a overlay. Výhodou macvlan siete je zvýšená rýchlosť
        komunikácie vďaka eliminácii prostredných krokov pri prenášaní paketov a
        jedinečná identifikácia kontajnera pomocou unikátnej ip adresy a mac
        adresy na lokálnej sieti. Na rozdiel od siete host môžeme vytvárať
        viacero rovnakých kontajnerov na jednom hostiteľskom zariadení, ktoré
        využívajú rovnaký port a nestretneme sa s problémom obsadenosti portov.
        Na druhú stranu, sieť macvlan prináša aj svoje nevýhody. Keďže
        kontajnere využívajúce sieť macvlan sú napojené priamo na lokálnu sieť,
        sú vystavené bezpečnostným zraniteľnostiam. Preto je potrebné vytvárať
        špecifické bezpečnostné nastavenia pre každý kontajner v macvlan sieti.
      </p>
      <p>
        Kľúčovým nastavením pre správnu funkčnosť macvlan siete je povolenie
        promiskuitného módu pre rodičovské sieťové rozhranie. Tento mód povoľuje
        jednému fyzickému rozhraniu vlastniť viacero unikátnych mac adries. Toto
        nastavenie je potrebné, aby sme umožnili nášmu hostiteľskému zariadeniu
        príjmať pakety s inou cieľovou mac adresou, akú má naše hostiteľské
        zariadenie, týmto umožníme príjmanie paketov pre naše kontajnere
        pripojené na macvlan sieť.
      </p>
      <p>
        Na obrázku vidíme demonštráciu docker macvlan siete, kde docker macvlan
        sieť využíva rodičovské sieťové rozhranie hostiteľského zariadenia eth0.
        Kontajnerom priraďuje ip adresu zo subnetu lokálnej siete a každý
        kontajner dostáva unikátnu mac adresu.
      </p>
      <img
        src={macvlanImage}
        alt=""
        className="images"
        style={{ height: '450px' }}
      />
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Ďalej
      </Button>
    </div>
  );
}
