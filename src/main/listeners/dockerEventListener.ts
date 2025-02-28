import { BrowserWindow, net } from 'electron';
import SshConnector from './sshConnector';
import {
  parseIpLinkOutput,
  getVethIdFromName,
  parseHostNetworkInterface,
} from '../utils/converters';

import Docker from 'dockerode';
import {
  mapContainerData,
  mapNetworkData,
  mapVMHostData,
  mapVethData,
  mapHostData,
  mapDockerGWBridgeData,
  mapVxlanId,
} from '../mappers/mappers';

const VETH_NETWORKS = ['bridge', 'my-bridge'];
const NO_ETH_NETWORKS = ['none', 'host'];
const OVERLAY_VETH = ['my-overlay'];

class DockerEventListener {
  docker: any;

  lastData: any;

  mainWindow: BrowserWindow;

  eventStream: NodeJS.ReadableStream | null;

  sshConnector: SshConnector;

  constructor(
    mainWindow: BrowserWindow,
    ipAddress: string,
    sshConnector: SshConnector,
  ) {
    this.docker = new Docker({
      host: ipAddress,
      port: 2375,
    });
    this.lastData = {};
    this.mainWindow = mainWindow;
    this.eventStream = null;
    this.sshConnector = sshConnector;
  }

  connectionNetworkEvent(event, containersToListen) {
    this.docker
      .getContainer(event.Actor.Attributes.container)
      .inspect((err, container) => {
        if (err) {
          return console.error('Error:', err);
        }
        if (
          containersToListen.get(container.Name.substring(1)) ===
          event.Actor.Attributes.name
        ) {
          const result = mapContainerData(
            container,
            event.Actor.Attributes.name,
          );
          this.mainWindow.webContents.send(
            'container-data',
            JSON.stringify(result),
          );
          this.getContainerEth(result, event.Actor.Attributes.name);
        }
      });
  }

  getContainerData(containerId: string, network: string) {
    this.docker.getContainer(containerId).inspect(async (err, container) => {
      if (err) {
        return console.error('Error:', err);
      }

      const result = mapContainerData(container, network);
      if (JSON.stringify(result) === JSON.stringify(this.lastData)) {
        // console.log('No changes');
      } else {
        this.getContainerEth(result, network);
        this.mainWindow.webContents.send(
          'container-data',
          JSON.stringify(result),
        );
      }
      this.lastData = result;
    });
  }

  async getHostNetworkInterface(requestedIpAddr: string) {
    try {
      const command = `ip addr | grep ${requestedIpAddr}`;
      const hostInterface = await this.sshConnector.executeSshCommand(command);
      const result = parseHostNetworkInterface(hostInterface);
      this.mainWindow.webContents.send(
        'host-ip-address',
        mapHostData(requestedIpAddr, result),
      );
    } catch (err) {
      console.error('Error getting host network interface:', err);
      this.mainWindow.webContents.send(
        'host-ip-address',
        mapHostData(requestedIpAddr, ''),
      );
    }
  }

  async getDockerGWBridgeInfo(
    containerId: string,
    parsedInterfaces,
    containerName: string,
  ) {
    try {
      this.docker
        .getNetwork('docker_gwbridge')
        .inspect(async (err, networkData) => {
          if (err) {
            return console.error('Error:', err);
          }
          const result = mapDockerGWBridgeData(networkData, containerId);
          const containerEth2 = parsedInterfaces.find((netInterface) => {
            return netInterface.details.mac === result.mac;
          });
          if (!containerEth2) {
            console.error('Could not find eth interface');
            return null;
          }
          this.mainWindow.webContents.send(
            'container-data',
            JSON.stringify({
              label: containerName,
              eth2: containerEth2.name,
              ip2: result.ip,
              mac2: result.mac,
              status: 'running',
              network: 'docker_gwbridge1',
            }),
          );
          // send data to container with ip and mac for new eth
          // this.mainWindow.webContents.send(
          //   'network-data',
          //   JSON.stringify(result),
          // );
          const vethCommand = `ip link show type veth`;
          const veth = await this.sshConnector.executeSshCommand(vethCommand);
          const parsedVeth = parseIpLinkOutput(veth);
          const vethId = getVethIdFromName(containerEth2.name);
          const containerVeth = parsedVeth.find((vethInterface) => {
            return vethInterface.id === vethId;
          });
          if (!containerVeth) {
            console.error('Could not find veth interface');
          }
          const vethData = mapVethData(containerVeth.name, containerName);
          this.mainWindow.webContents.send(
            'veth-data',
            JSON.stringify(vethData),
          );
          return { eth2: containerEth2.name, ip2: result.ip, mac2: result.mac };
        });
    } catch (err) {
      console.error('Error getting docker_gwbridge:', err);
    }
  }

  async getContainerEth(containerData: any, desiredNetwork: string) {
    try {
      if (NO_ETH_NETWORKS.includes(containerData.network)) {
        return;
      }
      const { mac, pid } = containerData;
      const command = `nsenter -t ${pid} -n ip link`;
      const interfaces = await this.sshConnector.executeSshCommand(command);
      const parsedInterfaces = parseIpLinkOutput(interfaces);
      if (OVERLAY_VETH.includes(containerData.network)) {
        this.getDockerGWBridgeInfo(
          containerData.id,
          parsedInterfaces,
          containerData.label,
        );
      }
      const containerEth = parsedInterfaces.find((netInterface) => {
        return netInterface.details.mac === mac;
      });
      if (!containerEth) {
        console.error('Could not find eth interface');
        this.mainWindow.webContents.send(
          'veth-data',
          JSON.stringify(mapVethData(undefined, containerData.label)),
        );
        if (OVERLAY_VETH.includes(containerData.network)) {
          const newObj = {
            containerName: containerData.label,
            namespace: '1-' + containerData.netId,
            veth: '',
            bridge: '',
            vxlan: '',
            nodeType: 'overlayNetworkNode',
          };
          this.mainWindow.webContents.send(
            'overlay-network-prop',
            JSON.stringify(newObj),
          );
        }
        return;
      }
      containerData.eth = containerEth.name;
      this.mainWindow.webContents.send(
        'container-data',
        JSON.stringify(containerData),
      );
      if (VETH_NETWORKS.includes(containerData.network)) {
        if (containerData.network !== desiredNetwork) {
          return;
        }
        const vethCommand = `ip link show type veth`;
        const veth = await this.sshConnector.executeSshCommand(vethCommand);
        const parsedVeth = parseIpLinkOutput(veth);
        const vethId = getVethIdFromName(containerEth.name);
        const containerVeth = parsedVeth.find((vethInterface) => {
          return vethInterface.id === vethId;
        });
        if (!containerVeth) {
          console.error('Could not find veth interface');
          this.mainWindow.webContents.send(
            'veth-data',
            JSON.stringify(mapVethData(undefined, containerData.label)),
          );
          return;
        }
        const vethData = mapVethData(containerVeth.name, containerData.label);
        this.mainWindow.webContents.send('veth-data', JSON.stringify(vethData));
      } else if (OVERLAY_VETH.includes(containerData.network)) {
        if (containerData.network !== desiredNetwork) {
          return;
        }
        // const vxlanId = await this.docker
        //   .getNetwork(containerData.network)
        //   .inspect((err, networkData) => {
        //     if (err) {
        //       console.error('Error:', err);
        //       return null;
        //     }
        //     return mapVxlanId(networkData).vxlanId;
        //   });
        // console.log('vxlan', vxlanId);

        // if (vxlanId === null) {
        //   return;
        // }
        const newObj = {
          containerName: containerData.label,
          namespace: '1-' + containerData.netId,
          veth: '',
          bridge: '',
          vxlan: '',
          nodeType: 'overlayNetworkNode',
        };
        const otherEths = parsedInterfaces.find((netInterface) => {
          if (netInterface.details.mac === mac) {
            return { id: netInterface.id, name: netInterface.name };
          }
        });
        if (otherEths.length === 0) {
          this.mainWindow.webContents.send(
            'overlay-network-prop',
            JSON.stringify(newObj),
          );
          return;
        }
        const networkNamespaceCmd = `nsenter --net=/var/run/docker/netns/1-${containerData.netId} ip link`;
        const networkInterfaces =
          await this.sshConnector.executeSshCommand(networkNamespaceCmd);
        const parsedINterfaces = parseIpLinkOutput(networkInterfaces);
        //TODO verify by vxlan id
        const filteredVeths = parsedINterfaces.map((vethInterface) => {
          return { id: vethInterface.id, name: vethInterface.name };
        });
        filteredVeths.filter((veth) => {
          if (veth.name.includes('vxlan')) {
            newObj.vxlan = veth.name;
          }
          if (veth.name === 'br0') {
            newObj.bridge = veth.name;
          }
          const tempId = veth.name.toString().split('if')[1];
          if (tempId && tempId.toString() === otherEths.id.toString()) {
            newObj.veth = veth.name;
          }
        });
        this.mainWindow.webContents.send(
          'overlay-network-prop',
          JSON.stringify(newObj),
        );
      }
    } catch (err) {
      console.error('Error getting eth:', err);
    }
  }

  disconnectSsh() {
    this.sshConnector.disconnect();
  }

  async sendCurrentContainers(containersMap) {
    containersMap.forEach((network, key) => {
      this.docker.getContainer(key).inspect((err, container) => {
        if (err) {
          return console.error('Error:', err);
        }
        const containerData = mapContainerData(container, network);
        this.getContainerEth(containerData, network);
        this.mainWindow.webContents.send(
          'container-data',
          JSON.stringify(containerData),
        );
      });
    });
  }

  getCurrentStateOfContainers(containersToListen, uniqueNetworks) {
    const containersMap = new Map<string, string>();

    if (uniqueNetworks.size > 0) {
      uniqueNetworks.forEach((net) => {
        let netId = net;
        if (net === 'docker_gwbridge1' || net === 'docker_gwbridge2') {
          netId = net.slice(0, -1);
        }
        this.docker.getNetwork(netId).inspect((err, networkData) => {
          if (err) {
            return console.error('Error NET:', err);
          }
          const result = mapNetworkData(networkData, net);
          this.mainWindow.webContents.send(
            'network-data',
            JSON.stringify(result),
          );
        });
      });
    }
    this.docker.listContainers({ all: true }, (err, containers) => {
      if (err) {
        return console.error('Error 3:', err);
      }
      containers.forEach((containerInfo) => {
        if (containersToListen.has(containerInfo.Names[0].substring(1))) {
          containersMap.set(
            containerInfo.Id,
            containersToListen.get(containerInfo.Names[0].substring(1)),
          );
        }
      });
      this.sendCurrentContainers(containersMap);
    });
  }

  hasValue(map, value) {
    for (let [key, val] of map) {
      if (val === value) {
        return true;
      }
    }
    return false;
  }

  hasUnallowedValues(map, allowedValues) {
    return [...map.values()].some((value) => !allowedValues.includes(value));
  }

  wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async createNetwork(event) {
    try {
      const getNetworkData = async (networkId: string) => {
        return new Promise((resolve, reject) => {
          this.docker.getNetwork(networkId).inspect((err, networkData) => {
            if (err) {
              reject(err);
            } else {
              resolve(networkData);
            }
          });
        });
      };

      let networkDataFromEvent: any = await getNetworkData(event.Actor.ID);

      // If not proper data returned on the first try
      if (networkDataFromEvent.Driver === '') {
        console.log('Retrying network data after 2 seconds...');
        await this.wait(1000);
        networkDataFromEvent = await getNetworkData(event.Actor.ID);
      }

      const result = mapNetworkData(networkDataFromEvent, event.Actor.ID);
      this.mainWindow.webContents.send('network-data', JSON.stringify(result));
    } catch (err) {
      console.error('Error retrieving network data:', err);
    }
  }

  destoryContainer(event, network: string) {
    const destroyedContainer = {
      label: '/' + event.Actor.Attributes.name,
      status: undefined,
      ip: undefined,
      network: undefined,
    };
    this.mainWindow.webContents.send(
      'container-data',
      JSON.stringify(destroyedContainer),
    );

    if (VETH_NETWORKS.includes(network)) {
      this.mainWindow.webContents.send(
        'veth-data',
        JSON.stringify(
          mapVethData(undefined, '/' + event.Actor.Attributes.name),
        ),
      );
    }
  }

  destroyNetwork(event) {
    const destroyedNetwork = {
      name: event.Actor.Attributes.name,
      subnet: undefined,
      driver: undefined,
      gateway: undefined,
    };
    this.mainWindow.webContents.send(
      'network-data',
      JSON.stringify(destroyedNetwork),
    );
  }

  async listenToEvents(containersToListen): Promise<void> {
    // if (
    //   this.hasUnallowedValues(containersToListen, NO_ETH_NETWORKS) &&
    //   !this.sshConnector.isConnected
    // ) {
    //   await this.connectSsh();
    // }
    this.docker.getEvents((err, stream) => {
      if (err) {
        this.mainWindow.webContents.send('error', undefined);
        return console.error('Error:', err);
      }
      console.log('Listening to events');
      this.eventStream = stream;

      stream.on('data', (chunk) => {
        const event = JSON.parse(chunk.toString('utf8'));
        if (
          event.Type === 'container' &&
          containersToListen.has(event.Actor.Attributes.name)
        ) {
          switch (event.Action) {
            case 'destroy': {
              this.destoryContainer(
                event,
                containersToListen.get(event.Actor.Attributes.name),
              );
              break;
            }
            default:
              this.getContainerData(
                event.Actor.ID,
                containersToListen.get(event.Actor.Attributes.name),
              );
              break;
          }
        } else if (
          event.Type === 'network' &&
          this.hasValue(containersToListen, event.Actor.Attributes.name)
        ) {
          switch (event.Action) {
            case 'create': {
              this.createNetwork(event);
              break;
            }
            case 'destroy': {
              this.destroyNetwork(event);
              break;
            }
            // for swarm removing network
            case 'remove': {
              this.destroyNetwork(event);
              break;
            }
            case 'connect':
            case 'disconnect': {
              this.connectionNetworkEvent(event, containersToListen);
              break;
            }
            default:
              break;
          }
        } else if (event.Type === 'node') {
          switch (event.Action) {
            case 'update': {
              this.getVMNodeData(event.Actor.ID);
              break;
            }
            default:
              break;
          }
        }
      });

      stream.on('error', (error) => {
        console.log('Stream error:', error);
      });

      stream.on('end', () => {
        console.log('Stream ended');
        this.eventStream = null;
      });
      return 0;
    });
  }

  async listenToEventsSecondary(containersToListen): Promise<void> {
    // if (
    //   this.hasUnallowedValues(containersToListen, NO_ETH_NETWORKS) &&
    //   !this.sshConnector.isConnected
    // ) {
    //   await this.connectSsh();
    // }
    this.docker.getEvents((err, stream) => {
      if (err) {
        return console.error('Error:', err);
      }
      console.log('Listening to events');
      this.eventStream = stream;

      stream.on('data', (chunk) => {
        const event = JSON.parse(chunk.toString('utf8'));
        if (
          event.Type === 'container' &&
          containersToListen.has(event.Actor.Attributes.name)
        ) {
          switch (event.Action) {
            case 'destroy': {
              this.destoryContainer(
                event,
                containersToListen.get(event.Actor.Attributes.name),
              );
              break;
            }
            default:
              this.getContainerData(
                event.Actor.ID,
                containersToListen.get(event.Actor.Attributes.name),
              );
              break;
          }
        } else if (
          event.Type === 'network' &&
          this.hasValue(containersToListen, event.Actor.Attributes.name)
        ) {
          switch (event.Action) {
            case 'create': {
              this.createNetwork(event);
              break;
            }
            case 'destroy': {
              this.destroyNetwork(event);
              break;
            }
            case 'connect':
            case 'disconnect': {
              this.connectionNetworkEvent(event, containersToListen);
              break;
            }
            default:
              break;
          }
        } else if (event.Type === 'node') {
          switch (event.Action) {
            case 'update': {
              this.getVMNodeData(event.Actor.ID);
              break;
            }
            default:
              break;
          }
        }
      });

      stream.on('error', (error) => {
        console.log('Stream error:', error);
      });

      stream.on('end', () => {
        console.log('Stream ended');
        this.eventStream = null;
      });
      return 0;
    });
  }

  stopListeningToEvents(): void {
    if (this.eventStream) {
      this.eventStream.destroy(); // Destroy the stream to end listening
      this.eventStream = null;
      console.log('Stopped listening to events');
    }
  }

  getVMNodes(): void {
    this.docker.listNodes((err, nodes) => {
      if (err) {
        return console.error('Error:', err);
      }
      const filteredNodes = nodes.reduce((uniqueNodes, node) => {
        const nodeIPAddr = node.Status.Addr;
        const existingNode = uniqueNodes.get(nodeIPAddr);

        if (
          !existingNode ||
          (existingNode.Status.State === 'down' && node.Status.State !== 'down')
        ) {
          uniqueNodes.set(nodeIPAddr, node);
        }

        return uniqueNodes;
      }, new Map());

      const result = Array.from(filteredNodes.values());
      //TODO add validation for nodes
      result.forEach((nodeInfo) => {
        this.mainWindow.webContents.send(
          'node-vm-data',
          JSON.stringify(mapVMHostData(nodeInfo)),
        );
      });
    });
  }

  getVMNodeData(nodeId: string): void {
    this.docker.getNode(nodeId).inspect((err, nodeInfo) => {
      if (err) {
        return console.error('Error:', err);
      }
      this.mainWindow.webContents.send(
        'node-vm-data',
        JSON.stringify(mapVMHostData(nodeInfo)),
      );
    });
  }
}

export default DockerEventListener;
