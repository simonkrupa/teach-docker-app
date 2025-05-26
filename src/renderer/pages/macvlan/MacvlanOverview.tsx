import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import macvlanImage from 'assets/imgs/transpmacvlan.png';
import DropdownWithHint from '../../components/Hint';

export default function MacvlanOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/macvlan/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - MACVLAN sieť</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 400px', maxWidth: '100%' }}>
          <p>
            Pre MACVLAN sieť poskytuje Docker ovládač s názvom MACVLAN. Pomocou
            tohto ovládača vieme vytvoriť Docker MACVLAN sieť pomocou módu
            bridge a využívať ju v našich kontajneroch. MACVLAN sieť umožňuje
            priraďovať každému kontajneru unikátnu MAC adresu, vďaka čomu sú na
            lokálnej sieti prezentované ako samostatné zariadenia. Kontajnere
            pripojené na MACVLAN sieť sa priamo pripájajú na fyzickú sieť. Pri
            MACVLAN sieti je potrebné zadefinovať takzvané rodičovské sieťové
            rozhranie, pomocou ktorého komunikuje lokálne zariadenie s vonkajším
            svetom. Rovnako je potrebné zadefinovať podsieť a bránu lokálnej
            siete. MACVLAN sieť je vďaka týmto informáciám schopná priraďovať
            každému novému kontajneru IP adresu z lokálnej siete. Táto sieť je
            výhodná v prípade, že kontajner chceme pripojiť priamo na externú
            sieť bez využitia ďalších vrstiev ako je bridge, technológia NAT
            alebo VXLAN, ktoré sú využívané napríklad pri Docker sieti bridge a
            overlay. Výhodou MACVLAN siete je zvýšená rýchlosť komunikácie vďaka
            eliminácii prostredných krokov pri prenášaní paketov a jedinečná
            identifikácia kontajnera pomocou unikátnej IP adresy a MAC adresy na
            lokálnej sieti. Na rozdiel od siete host môžeme vytvárať viacero
            rovnakých kontajnerov na jednom hostiteľskom zariadení, ktoré
            využívajú rovnaký port a nestretneme sa s problémom obsadenosti
            portov. Na druhú stranu, sieť MACVLAN prináša aj svoje nevýhody.
            Keďže kontajnere využívajúce sieť MACVLAN sú napojené priamo na
            lokálnu sieť, sú vystavené bezpečnostným zraniteľnostiam. Preto je
            potrebné vytvárať špecifické bezpečnostné nastavenia pre každý
            kontajner v MACVLAN sieti.
          </p>
          <p>
            Kľúčovým nastavením pre správnu funkčnosť MACVLAN siete je povolenie
            promiskuitného módu pre rodičovské sieťové rozhranie. Tento mód
            povoľuje jednému fyzickému rozhraniu vlastniť viacero unikátnych MAC
            adries. Toto nastavenie je potrebné, aby sme umožnili nášmu
            hostiteľskému zariadeniu príjmať pakety s inou cieľovou MAC adresou,
            akú má naše hostiteľské zariadenie, týmto umožníme príjmanie paketov
            pre naše kontajnere pripojené na MACVLAN sieť.
          </p>
          <p>
            Na obrázku vidíme demonštráciu Docker MACVLAN siete, kde Docker
            MACVLAN sieť využíva rodičovské sieťové rozhranie hostiteľského
            zariadenia eth0. Kontajnerom priraďuje IP adresu zo subnetu lokálnej
            siete a každý kontajner dostáva unikátnu MAC adresu.
          </p>
        </div>
        <img
          src={macvlanImage}
          alt=""
          className="images"
          style={{
            height: '476px',
            width: '441px',
            marginTop: '20px',
            marginLeft: '20px',
          }}
        />
      </div>
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
