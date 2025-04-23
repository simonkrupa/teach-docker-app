import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function HostTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/host/third-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - host sieť</h1>
      <ol>
        <li>
          Vytvorenie docker kontajnera pripojeného na docker host sieť s názvom
          my-nginx4.
        </li>
        <li>Validácia prístupu ku kontajneru a jeho komunikácia.</li>
      </ol>
      {/* <SyntaxHighlighter language="bash" style={dracula}>
        netstat -tulnp
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx4 --network=host nginx
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
