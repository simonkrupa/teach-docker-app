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
      <h1>Úloha - none sieť</h1>
      <ol>
        <li>
          Vytvorenie docker kontajnera pripojeného na docker none sieť s názvom
          my-nginx5.
        </li>
        <li>Validácia prístupu ku kontajneru a jeho komunikácia.</li>
      </ol>
      {/* <p>
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
      </SyntaxHighlighter> */}
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
