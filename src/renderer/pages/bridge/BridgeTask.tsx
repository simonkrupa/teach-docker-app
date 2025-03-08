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
      <h1>Bridge task</h1>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker network create --driver bridge --subnet=172.19.0.0/16 my-bridge
      </SyntaxHighlighter>

      <p>
        To create docker container running on our newly created custom bridge
        network
      </p>
      <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx --network=my-bridge --ip=172.19.0.12 nginx
      </SyntaxHighlighter>

      <SyntaxHighlighter language="bash" style={dracula}>
        docker run -d --name=my-nginx2 --network=my-bridge --ip=172.19.0.13
        nginx
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
