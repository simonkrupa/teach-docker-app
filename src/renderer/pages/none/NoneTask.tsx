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
      <h1>None task</h1>
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
