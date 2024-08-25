export type ContainerNodeProps = {
  data: {
    state: string;
    label: string;
    ip: string;
    network: string;
    port: string;
    hostPort: string;
  };
};

export type DockerEventContainerData = {
  label: string;
  status: string;
  ip: string;
  network: string;
  port: string;
  hostPort: string;
};

export type DockerEventNetworkData = {
  name: string;
  subnet: string;
  driver: string;
  gateway: string;
};
