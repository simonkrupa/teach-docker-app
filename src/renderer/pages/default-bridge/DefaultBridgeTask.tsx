import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function DefaultBridgeTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/default-bridge/second-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - predvolená bridge sieť</h1>
      <ol>
        <li>
          Vytvorenie nginx kontajnera s názvom my-nginx3 pripojeného na
          predvolenú sieť bridge
        </li>
        <li>
          Vytvorenie alpine kontajnera s názvom my-alpine pripojeného na
          predvolenú sieť bridge
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>

      {/* <SyntaxHighlighter language="bash" style={dracula}>
        docker network ls
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx3 nginx
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
