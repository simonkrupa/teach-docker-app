import { Select, Collapse } from 'antd';
import { useState } from 'react';

import './FrameBar.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { Panel } = Collapse;

export default function DropdownWithHint() {
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation();

  const commands = {
    start:
      'docker run [-d] --name <container name> [--ip=<IP address>] <image name>',
    stop: 'docker stop <container name>',
    restart: 'docker restart <container name>',
    remove: 'docker rm <container name>',
    network_create:
      'docker network create --driver <driver> [--subnet <subnet>] [--gateway <gateway>] [-o parent=<network interface>] <network name>',
    network_remove: 'docker network rm <network name>',
    list: 'docker ps [-a]',
    list_networks: 'docker network ls',
    inspect: 'docker inspect <container name>',
    net_inspect: 'docker network inspect <network name>',
    swarm: 'docker swarm init [--advertise-addr <IP address>]',
    swarm_join: 'docker swarm join --token <token> <IP address>:<port>',
    swarm_leave: 'docker swarm leave [--force]',
    swarm_list: 'docker node ls',
    exec: 'docker exec -it <container name> <shell>',
    ipaddr: 'ip link show [type <network interface type>]',
    bridge: 'brctl show',
    edit_docker_service: 'sudo nano /lib/systemd/system/docker.service',
    restart_daemon: 'sudo systemctl daemon-reload',
    restart_docker: 'sudo systemctl restart docker',
    docker_events: 'docker system events',
    namespace_command: 'nsenter -t pid -n <command>',
    net_namespace_cmd:
      'nsenter --net=/var/run/docker/netns/<network id> <command>',
    promisc_mode: 'ip link set <network interface> promisc on',
  };

  return (
    <div className="dropdown-hint">
      <Select
        placeholder={t('dropdown_placeholder')}
        style={{ width: '60%', marginLeft: '20%', marginRight: '20%' }}
        onChange={(value) => setSelected(value)}
      >
        <Option value="start">{t('dropdown_start')}</Option>
        <Option value="stop">{t('dropdown_stop')}</Option>
        <Option value="restart">{t('dropdown_restart')}</Option>
        <Option value="remove">{t('dropdown_remove')}</Option>
        <Option value="network_create">{t('dropdown_network_create')}</Option>
        <Option value="network_remove">{t('dropdown_network_remove')}</Option>
        <Option value="list">{t('dropdown_list')}</Option>
        <Option value="list_networks">{t('dropdown_list_networks')}</Option>
        <Option value="inspect">{t('dropdown_inspect')}</Option>
        <Option value="net_inspect">{t('dropdown_net_inspect')}</Option>
        <Option value="swarm">{t('dropdown_swarm')}</Option>
        <Option value="swarm_join">{t('dropdown_swarm_join')}</Option>
        <Option value="swarm_leave">{t('dropdown_swarm_leave')}</Option>
        <Option value="swarm_list">{t('dropdown_swarm_list')}</Option>
        <Option value="exec">{t('dropdown_exec')}</Option>
        <Option value="ipaddr">{t('dropdown_ipaddr')}</Option>
        <Option value="bridge">{t('dropdown_bridge')}</Option>
        <Option value="edit_docker_service">
          {t('dropdown_edit_docker_service')}
        </Option>
        <Option value="restart_daemon">{t('dropdown_restart_daemon')}</Option>
        <Option value="restart_docker">{t('dropdown_restart_docker')}</Option>
        <Option value="docker_events">{t('dropdown_docker_events')}</Option>
        <Option value="namespace_command">
          {t('dropdown_namespace_command')}
        </Option>
        <Option value="net_namespace_cmd">
          {t('dropdown_net_namespace_cmd')}
        </Option>
        <Option value="promisc_mode">{t('dropdown_promisc_mode')}</Option>
      </Select>

      {selected && (
        <Collapse style={{ marginTop: 12 }}>
          <Panel header={t('dropdown_hint_header')} key="1">
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
