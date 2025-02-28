export type ContainerNodeProps = {
  data: {
    state: string;
    label: string;
    ip: string;
    network: string;
    port: string;
    hostPort: string;
    mac: string;
    eth: string;
  };
};

export type VethNodeProps = {
  data: {
    label: string;
  };
};

export type SshConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
};

export interface TerminalProps {
  id: number;
  active: boolean;
}
