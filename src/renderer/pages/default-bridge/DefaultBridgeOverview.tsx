import { useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'antd';
import '../Pages.css';
import bridgeImage from 'assets/imgs/transdefaultbridge.drawio.png';
import DropdownWithHint from '../../components/Hint';

export default function DefaultBridgeOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/default-bridge/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - predvolená sieť bridge</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 400px', maxWidth: '70%' }}>
          <p>
            Predvolená sieť bridge je predom vytvorená po nainštalovaní dockeru
            a je to izolovaná, interná sieť, ktorá umožňuje komunikáciu
            kontajnerov nachádzajúcich sa na tejto sieti v rámci jedného
            hostiteľského zariadenia. V rámci docker sietí má názov bridge a je
            vytvorená podľa ovládača bridge. Interne je docker bridge vlastne
            sieťový komponent bridge v rámci Linux ekosystému a jeho sieťovej
            haldy pod názvom docker0, čo si vieme overiť príkazom na
            vylistovanie sieťových rozhraní v hostiteľskom počítači, na ktorom
            beží Docker. Predvolená je z dôvodu, že po vytvorení akéhokoľvek
            docker kontajnera bez špecifikácie jeho siete, je tento kontajner
            pripojený práve na túto bridge sieť.
          </p>
          <p>
            Predvolená docker bridge sieť dostáva vlastnú podsieť a bránu. Z
            tohto ip rozmedzia následne všetky kontajnere vytvorené na tejto
            sieti dostávajú vlastnú ip adresu. Na 11 priraďovanie ip adries
            slúži zabudovaný service IPAM. Interná knižnica dockeru, ktorá je
            zodpovedná za vybratie voľného adresového rozmedzia pre predvolenú
            sieť bridge. Toto nastavenie je konfigurovateľné upravením
            konfiguračného súboru daemon.json. V prípade, že sme explicitne
            nezadefinovali aké rozmedzie chceme použiť, knižnica hľadá voľné
            rozmedzie v predvolených rozmedziach a to 172.x.x.x/16, následne
            192.168.x.x/16 alebo 10.x.x.x/8.
          </p>
          <p>
            Predvolená sieť bridge nepovoľuje používateľovi dynamicky
            modifikovať jej nastavenia, v prípade modifikácie je potrebný
            reštart služby Docker. Modifikovateľné nastavenia pre predvolenú
            sieť bridge sú obmedzené a v prípade, že potrebujeme prispôsobiť a
            upraviť nastavenia siete bridge, je lepšie vytvoriť používateľom
            definovanú sieť bridge. Docker bridge ovládač nastavuje pravidlá pre
            hostiteľský stroj, kde kontajnere pripojené na iné bridge siete
            nemajú prístup k vzájomnej komunikácii. Pri komunikácii je egress,
            výstup, predvolene zapnutý, čiže kontajner je schopný komunikovať s
            vonkajším svetom, sme schopní dotázať sa na stránku na internete.
            Avšak ingress, vstup, respektíve komunikácia vonkajšieho sveta s
            kontajnerom je vypnutá. Docker umožňuje komunikáciu kontajnera s
            vonkajšou sieťou odhalením portu. Je potrebné namapovať port
            kontajnera s voľným portom hostiteľského stroja, čím umožníme
            ingress komunikáciu, takéto mapovanie môžeme zadefinovať pri
            vytváraní kontajnera. Predvolená sieť bridge nezahŕňa DNS
            mechanizmus pre kontajnere, ktoré sú naňu 12 pripojené, na
            kontajnere sa vieme dotazovať len pomocou ip adresy.
          </p>
          <p>
            Akonáhle je kontajner pripojený na sieť bridge, dostáva sieťové
            rozhranie. Toto sieťové rozhranie kontajnera je pripojené na
            virtuálny ethernetový pár nachádzajúci sa v priestore hostiteľského
            stroja, a na druhú stranu virtuálneho ethernetového páru sa pripája
            linuxový bridge, z ktorého je následne sieť pomocou technológie NAT
            presmerovaná na vonkajší svet.
          </p>
        </div>
        <img
          src={bridgeImage}
          alt=""
          className="images"
          style={{
            height: '481px',
            width: '491px',
            marginTop: '20px',
            marginLeft: '20px',
            // flexShrink: 0,
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
