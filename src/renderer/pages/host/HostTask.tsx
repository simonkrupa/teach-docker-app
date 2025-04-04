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
      <h1>Úloha sieť host</h1>
      <p>
        Vašou úlohou je vytvoriť a spustiť docker kontajner s webovým serverom
        nginx, ktorý bude mať prístup k sieťovým rozhraniam hostiteľského
        systému.
      </p>
      <p>
        Pre overenie správnosti riešenia by ste mali byť schopný otvoriť vo
        webovom prehliadač v hostiteľskom systéme kde beží docker, localhost a
        ten by mal zobraziť predvolenú stránku nginx.
      </p>
      <p>
        Mali vidieť, že port 80, ktorý je predvolený pre nginx, na hostiteľskom
        systéme je obsadený. Toto vieme overiť príkazom:{' '}
      </p>
      <SyntaxHighlighter language="bash" style={dracula}>
        netstat -tulnp
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx4 --network=host nginx
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
