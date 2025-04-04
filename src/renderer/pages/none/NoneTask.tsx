import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function NoneTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/none/fourth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha: Žiadna sieť</h1>
      <p>
        Vašou úlohou je vytvoriť a spustiť docker kontajner bez akéhokoľvek
        sieťového pripojenia. Výsledkom by mal byť kontajner, ktorý nedokáže
        komunikovať s hostiteľským systémom, ani s inými kontajnermi, ani s
        Internatom.
      </p>
      <p>
        Pre overenie úspešnosti úlohy je potrebné vykonať príkaz
        <SyntaxHighlighter language="bash" style={dracula}>
          ip link show
        </SyntaxHighlighter>
        alebo
        <SyntaxHighlighter language="bash" style={dracula}>
          ls /sys/class/net
        </SyntaxHighlighter>
        a skontrolovať, či kontajner nemá žiadne sieťové pripojenie a vidíme len
        loopback interface.
      </p>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx5 --network=none nginx
      </SyntaxHighlighter>
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Next
      </Button>
    </div>
  );
}
