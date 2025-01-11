import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';

export default function OverlayTask() {
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/overlay/fifth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>Overlay task</h1>
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Next
      </Button>
      <p>TODO overlay with service</p>
      <p>MANAGER: docker swarm init --advertise-addr 192.168.56.106</p>
      <p>
        WORKER: docker swarm join --token
        SWMTKN-1-0y90fidy9evmszwvr9ootmu7vgrfphd6o802o9w4dyvd3iq8q9-e33afoo05tdqyoy04yk5ihzjq
        192.168.56.106:2377
      </p>
      <p>MANAGER: docker network create -d overlay --attachable my-overlay</p>
      <p>WORKER: docker run --name my-nginx7 --network my-overlay nginx</p>
      <p>MANAGER: docker run --name my-nginx6 --network my-overlay nginx</p>
    </div>
  );
}
