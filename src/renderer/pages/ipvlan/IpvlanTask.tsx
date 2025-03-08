import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function IpvlanTask() {
  const navigate = useNavigate();
  const cmmd = `docker network create \\
  -d ipvlan \\
  --subnet=192.168.100.0/24 \\
  --gateway=192.168.100.1 \\
  -o parent=enp0s10 my-ipvlan`;

  const handleProceedNavigation = () => {
    navigate('/ipvlan/seventh-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Ipvlan task</h1>
      <SyntaxHighlighter
        language="bash"
        style={dracula}
        customStyle={{ whiteSpace: 'pre' }} // Ensures new lines are respected
      >
        {cmmd}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run --name my-nginx11 --network my-ipvlan -d nginx
      </SyntaxHighlighter>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run --name my-nginx12 --network my-ipvlan -d nginx
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
