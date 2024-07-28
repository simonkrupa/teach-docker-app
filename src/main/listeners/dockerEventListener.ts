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

  listenToEvents(): void {
    this.docker.getEvents((err, stream) => {
      if (err) {
        return console.error('Error:', err);
      }

      this.eventStream = stream;

      stream.on('data', (chunk) => {
        const event = JSON.parse(chunk.toString('utf8'));
        if (
          event.Type === 'container' &&
          event.Actor.Attributes.name === 'my-nginx'
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
