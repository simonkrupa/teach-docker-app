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

  getContainerData(containerId: string) {
    this.docker.getContainer(containerId).inspect((err, container) => {
      if (err) {
        return console.error('Error:', err);
      }

      const result = mapContainerData(container);
      if (JSON.stringify(result) === JSON.stringify(this.lastData)) {
        console.log('No changes');
      } else {
        console.log('Changes detected: ', result);
        this.mainWindow.webContents.send(
          'container-data',
          JSON.stringify(result),
        );
      }
      this.lastData = result;
    });
  }

  sendCurrentContainers(containerIds: string[]) {
    containerIds.forEach((id) => {
      this.docker.getContainer(id).inspect((err, container) => {
        if (err) {
          return console.error('Error:', err);
        }
        const containerData = mapContainerData(container);
        console.log('Sending current containers:', containerData);
        this.mainWindow.webContents.send(
          'container-data',
          JSON.stringify(containerData),
        );
      });
    });
  }

  // async sendCurrentContainers(containerIds: string[]) {
  //   const result = [];

  //   // Promisify the inspect function
  //   const inspectContainer = (id) => {
  //     return new Promise((resolve, reject) => {
  //       this.docker.getContainer(id).inspect((err, container) => {
  //         if (err) {
  //           return reject('Error:', err);
  //         }
  //         const containerData = mapContainerData(container);
  //         resolve(containerData);
  //       });
  //     });
  //   };

  //   // Use Promise.all to wait for all containers to be inspected
  //   try {
  //     const promises = containerIds.map((id) => inspectContainer(id));
  //     const containerDataList = await Promise.all(promises);

  //     result.push(...containerDataList);

  //     console.log('Sending current containers:', result);
  //     this.mainWindow.webContents.send(
  //       'container-data',
  //       JSON.stringify(result),
  //     );
  //   } catch (error) {
  //     console.error('Failed to inspect some containers:', error);
  //   }
  // }

  getCurrentStateOfContainers(containersToListen) {
    const containerIds: string[] = [];
    this.docker.listContainers((err, containers) => {
      if (err) {
        return console.error('Error:', err);
      }
      containers.forEach((containerInfo) => {
        if (containersToListen.has(containerInfo.Names[0].substring(1))) {
          containerIds.push(containerInfo.Id);
        }
      });
      this.sendCurrentContainers(containerIds);
    });
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
          this.getContainerData(event.Actor.ID);
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
