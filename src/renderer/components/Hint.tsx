import { Select, Collapse } from 'antd';
import { useState } from 'react';

import './FrameBar.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Option } = Select;
const { Panel } = Collapse;

export default function DropdownWithHint() {
  const [selected, setSelected] = useState(null);

  const commands = {
    start:
      'docker run [-d] --name <názov kontajnera> [--ip=<ip adresa>] <názov obrazu>',
    stop: 'docker stop <názov_kontajnera>',
    restart: 'docker restart <názov_kontajnera>',
    remove: 'docker rm <názov_kontajnera>',
    network_create:
      'docker network create --driver <ovládač> [--subnet <podsieť>] [--gateway <brána>] [-o parent=<sieťové rozhranie>] <názov siete>',
    network_remove: 'docker network rm <názov siete>',
    list: 'docker ps [-a]',
    list_networks: 'docker network ls',
    inspect: 'docker inspect <názov_kontajnera>',
    net_inspect: 'docker network inspect <názov_siete>',
    swarm: 'docker swarm init [--advertise-addr <ip_adresa>]',
    swarm_join: 'docker swarm join --token <token> <ip_adresa>:<port>',
    swarm_leave: 'docker swarm leave [--force]',
    swarm_list: 'docker node ls',
    exec: 'docker exec -it <názov_kontajnera> <shell>',
    ipaddr: 'ip link show [type <typ>]',
    bridge: 'brctl show',
    edit_docker_service: 'sudo nano /lib/systemd/system/docker.service',
    restart_daemon: 'sudo systemctl daemon-reload',
    restart_docker: 'sudo systemctl restart docker',
    docker_events: 'docker system events',
    namespace_command: 'nsenter -t pid -n <príkaz>',
    net_namespace_cmd:
      'nsenter --net=/var/run/docker/netns/<identifikátor siete> <príkaz>',
    promisc_mode: 'ip link set <sieťové rozhranie> promisc on',
  };

  return (
    <div className="dropdown-hint">
      <Select
        placeholder="Vyberte príkaz"
        style={{ width: '60%', marginLeft: '20%', marginRight: '20%' }}
        onChange={(value) => setSelected(value)}
      >
        <Option value="start">Vytvorenie kontajnera</Option>
        <Option value="stop">Pozastavenie kontajnera</Option>
        <Option value="restart">Reštartovanie kontajnera</Option>
        <Option value="remove">Odstránenie kontajnera</Option>
        <Option value="network_create">Vytvorenie siete</Option>
        <Option value="network_remove">Odstránenie siete</Option>
        <Option value="list">Zoznam kontajnerov</Option>
        <Option value="list_networks">Zoznam sietí</Option>
        <Option value="inspect">Zobrazenie informácií o kontajneri</Option>
        <Option value="net_inspect">Zobrazenie informácií o sieti</Option>
        <Option value="swarm">Vytvorenie swarmu</Option>
        <Option value="swarm_join">Pripojenie do swarmu</Option>
        <Option value="swarm_leave">Opustenie swarmu</Option>
        <Option value="swarm_list">Zoznam uzlov v swarm</Option>
        <Option value="exec">Spustenie príkazu v kontajneri</Option>
        <Option value="ipaddr">Zobrazenie sieťových rozhraní</Option>
        <Option value="bridge">Zobrazenie linuxových bridgov</Option>
        <Option value="edit_docker_service">Úprava docker služby</Option>
        <Option value="restart_daemon">Reštartovanie daemona</Option>
        <Option value="restart_docker">Reštartovanie dockeru</Option>
        <Option value="docker_events">Zobrazenie udalostí dockeru</Option>
        <Option value="namespace_command">Príkaz v mennom priestore</Option>
        <Option value="net_namespace_cmd">
          Príkaz v sieťovom mennom priestore
        </Option>
        <Option value="promisc_mode">Nastavenie promiskuitného režimu</Option>
      </Select>

      {selected && (
        <Collapse style={{ marginTop: 12 }}>
          <Panel header="Ukázať nápovedu" key="1">
            {/* <code>{commands[selected]}</code> */}
            <SyntaxHighlighter
              language="bash"
              style={dracula}
              className="code-scrollable-sidebar"
            >
              {commands[selected]}
            </SyntaxHighlighter>
          </Panel>
        </Collapse>
      )}
    </div>
  );
}
