import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MacvlanTask() {
  const navigate = useNavigate();
  const cmmd = `docker network create \\
        -d macvlan \\
        --subnet=192.168.100.0/24 \\
        --gateway=192.168.100.1 \\
        -o parent=enp0s10 my-macvlan`;

  const handleProceedNavigation = () => {
    navigate('/macvlan/sixth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Úloha - macvlan sieť</h1>
      <ol>
        <li>Vytvorenie docker macvlan siete s názvom my-macvlan.</li>
        <li>
          Vytvorenie 2 nginx docker kontajnerov pripojených na docker macvlan
          sieť s názvami my-nginx8 a my-nginx10.
        </li>
        <li>
          Vytvorenie nginx kontajnera pripojeného na docker host sieť s názvom
          my-nginx9.
        </li>
        <li>Validácia prístupu ku kontajnerom a ich komunikácia.</li>
      </ol>
      {/* <p>Bridged adapter in vbox. </p> */}
      {/* <SyntaxHighlighter
        language="bash"
        style={dracula}
        customStyle={{ whiteSpace: 'pre' }} // Ensures new lines are respected
      >
        {cmmd}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run --name my-nginx8 --network my-macvlan -d nginx
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run --name my-nginx10 --network my-macvlan -d nginx
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run --name my-nginx9 --network host -d nginx
      </SyntaxHighlighter>
      <p>Visible on: </p>
      <p>http://192.168.100.35/</p>
      <p>http://192.168.100.3/</p>
      <p>http://192.168.100.2/</p> */}
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
