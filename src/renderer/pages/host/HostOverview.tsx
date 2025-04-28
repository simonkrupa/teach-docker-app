import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import hostImage from 'assets/imgs/host.png';
import DropdownWithHint from '../../components/Hint';

export default function HostOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/host/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - host sieť</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <p style={{ maxWidth: '50%' }}>
          Hostiteľská sieť odstraňuje akúkoľvek izoláciu medzi hostiteľom a
          kontajnermi, čiže kontajnere majú priamy prístup k sieťovému
          prostrediu hostiteľa a využívajú jeho sieťové parametre. Tým pádom má
          kontajner využívajúci sieť host rovnakú ip adresu akou je ip adresa
          hostiteľského zariadenia. Výhodou využitia siete host je zrýchlenie
          výkonu aplikácie bežiacej v kontajneri, to znamená, odovzdávanie a
          príjmanie paketov prebieha rýchlejšie, keďže kontajner je pripojený
          priamo na sieťové rozhranie hosťovského stroja, bez prítomnosti
          ďalších sieťových technológií v medziprostredí ako napríklad NAT,
          bridge, VXLAN tunel. Nevýhodou je, že kontajner je priamo odhalený pre
          vonkajší svet, čím aplikáciu vystavujeme väčšiemu bezpečnostnému
          riziku. Ktokoľvek má prístup k hosťovskému stroju, má takisto prístup
          ku kontajneru, to znamená, ingress je povolený na rozdiel od siete
          bridge, kde je potrebné špecificky nastaviť port, ktorý bude odhalený.
          Ďalšou nevýhodou je, že port, ktorý používa kontajner na hosťovskej
          sieti, už nie sme schopní použiť pre inú aplikáciu, čo spôsobuje
          značné obmedzenie pri používaní viacerých docker kontajnerov. Na
          obrázku 7 môžeme vidieť hostiteľský počítač, na ktorom beží služba SSH
          na porte 22 a nginx docker kontajner pripojený na docker sieť host na
          port 80.
        </p>
        <img
          src={hostImage}
          alt=""
          className="images"
          style={{ height: '321px', width: '361px', marginTop: '20px' }}
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
