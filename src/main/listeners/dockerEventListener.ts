import { BrowserWindow } from 'electron';

const Docker = require('dockerode');
const { mapContainerData } = require('../mappers/mappers');

class DockerEventListener {
  docker: any;

  lastData: any;

  mainWindow: BrowserWindow;

  eventStream: NodeJS.ReadableStream | null;

  constructor(mainWindow: BrowserWindow) {
    this.docker = new Docker();
    this.lastData = {};
    this.mainWindow = mainWindow;
    this.eventStream = null;
  }

  connectionNetworkEvent(event, containersToListen) {
    // this.docker.getNetwork(network).inspect((err, networkData) => {
    //   if (err) {
    //     return console.error('Error:', err);
    //   }
    //   console.log('Network data:', networkData);
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
        }
      });
    // });
  }

  getContainerData(containerId: string, network: string) {
    this.docker.getContainer(containerId).inspect((err, container) => {
      if (err) {
        return console.error('Error:', err);
      }

      const result = mapContainerData(container, network);
      if (JSON.stringify(result) === JSON.stringify(this.lastData)) {
        // console.log('No changes');
      } else {
        // console.log('Changes detected: ', result);
        this.mainWindow.webContents.send(
          'container-data',
          JSON.stringify(result),
        );
      }
      this.lastData = result;
    });
  }

  sendCurrentContainers(containersMap) {
    containersMap.forEach((value, key) => {
      this.docker.getContainer(key).inspect((err, container) => {
        if (err) {
          return console.error('Error:', err);
        }
        const containerData = mapContainerData(container, value);
        console.log('Sending current containers:', containerData);
        this.mainWindow.webContents.send(
          'container-data',
          JSON.stringify(containerData),
        );
      });
    });
  }

  getCurrentStateOfContainers(containersToListen) {
    const containersMap = new Map<string, string>();
    this.docker.listContainers((err, containers) => {
      if (err) {
        return console.error('Error:', err);
      }
      containers.forEach((containerInfo) => {
        if (containersToListen.has(containerInfo.Names[0].substring(1))) {
          containersMap.set(
            containerInfo.Id,
            containersToListen.get(containerInfo.Names[0].substring(1)),
          );
          // containerIds.push(containerInfo.Id);
        }
      });
      this.sendCurrentContainers(containersMap);
    });
    // this.getNetworkData(containersToListen.values().next().value);
  }

  hasValue(map, value) {
    for (let [key, val] of map) {
      if (val === value) {
        return true;
      }
    }
    return false;
  }

  listenToEvents(containersToListen): void {
    this.docker.getEvents((err, stream) => {
      if (err) {
        return console.error('Error:', err);
      }

      this.eventStream = stream;

      stream.on('data', (chunk) => {
        const event = JSON.parse(chunk.toString('utf8'));
        if (
          event.Type === 'container' &&
          containersToListen.has(event.Actor.Attributes.name)
        ) {
          this.getContainerData(
            event.Actor.ID,
            containersToListen.get(event.Actor.Attributes.name),
          );
        } else if (
          event.Type === 'network' &&
          this.hasValue(containersToListen, event.Actor.Attributes.name)
        ) {
          //TODO: Implement network event handling case connect disconnect
          this.connectionNetworkEvent(event, containersToListen);
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
    }
  }
}

export default DockerEventListener;
