import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import bridgeImage from 'assets/imgs/userbridge.png';

export default function BridgeOverview() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/bridge/task');
  };
  return (
    <div className="all-pages">
      <h1>Prehľad - bridge sieť</h1>
      <p>
        Používateľom definovaná bridge sieť je vytváraná samotným používateľom a
        rovnako ako predvolená sieť bridge, je vytvorená podľa ovládača bridge.
        V linux ekosystéme ide opäť o linuxový bridge, ktorý dostáva názov podľa
        identifikačného čísla docker bridge siete a prefixu br-.
      </p>
      <p>
        Umožňuje prístupnejšiu modifikáciu siete bez potreby reštartovania
        Dockeru. Pri vytváraní siete vieme zadefinovať vlastnú podsieť, z ktorej
        následne všetky pripojené kontajnere dostávajú vlastnú ip adresu.
      </p>
      <p>
        Narozdiel od predvolenej siete bridge, je súčasťou používateľom
        definovanej bridge siete aj DNS mechanizmus, ktorý umožňuje mapovanie ip
        adries kontajnerov podľa ich názvu, čiže pri komunikácii medzi viacerými
        kontajnermi pripojenými na jednu bridge sieť môžeme používať na vzájomnú
        komunikáciu aj názvy kontajnerov.
      </p>
      <p>
        Na obrázku vidíme demonštráciu používateľom definovanú sieť bridge s
        názvom my-bridge a rovnako tak aj predvolenú docker bridge sieť. Vrámci
        týchto sietí vidíme v druhom riadku názov linuxového bridgu. V prípade
        potreby je možné jeden kontajner pripojiť na viacero sietí naraz,
        kontajner dostane nové sieťové rozhranie.
      </p>
      <img src={bridgeImage} alt="" className="images" />

      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
        style={{ marginTop: '3%' }}
      >
        Ďalej
      </Button>
    </div>
  );
}
