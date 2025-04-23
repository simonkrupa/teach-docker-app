import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BridgeTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/bridge/first-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - bridge sieť</h1>
      <p>Úloha pre realizáciu docker bridge siete:</p>
      <ol>
        <li>
          Vytvorenie novej docker siete bridge s názvom my-bridge s podsieťou
          172.19.0.0
        </li>
        <li>
          Vytvorenie 2 nginx kontajnerov s názvami my-nginx a my-nginx2
          pripojených na my-bridge sieť.
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>
      {/* <SyntaxHighlighter language="bash" style={dracula}>
        docker network create --driver bridge --subnet=172.19.0.0/16 my-bridge
      </SyntaxHighlighter> */}

      {/* <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx --network=my-bridge --ip=172.19.0.12 nginx
      </SyntaxHighlighter>

      <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx2 --network=my-bridge --ip=172.19.0.13
        nginx
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
