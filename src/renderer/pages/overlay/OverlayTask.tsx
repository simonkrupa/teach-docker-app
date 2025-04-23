import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function OverlayTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/overlay/fifth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - overlay sieť</h1>
      <ol>
        <li>
          Vytvorenie docker swarmu a pripojenie druhého virtuálneho stroja do
          swarmu.
        </li>
        <li>Vytvorenie docker overlay siete s názvom my-overlay.</li>
        <li>
          Vytvorenie nginx kontajnera na manažérskom stroji s názvom my-nginx6 a
          vytvore- nie nginx kontajnera na pracovníkovi s názvom my-nginx7.
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>
      {/* <p>Manager:</p>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker swarm init --advertise-addr 192.168.56.106
      </SyntaxHighlighter>
      <p>Worker:</p>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker swarm join --token
        SWMTKN-1-0y90fidy9evmszwvr9ootmu7vgrfphd6o802o9w4dyvd3iq8q9-e33afoo05tdqyoy04yk5ihzjq
        192.168.56.106:2377
      </SyntaxHighlighter>
      <p>Manager:</p>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker network create -d overlay --attachable my-overlay
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run --name my-nginx6 --network my-overlay nginx
      </SyntaxHighlighter>
      <p>Worker:</p>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run --name my-nginx7 --network my-overlay nginx
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
