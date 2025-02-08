import { Client } from 'ssh2';
import { SshConfig } from '../../renderer/types/types';

class SshConnector {
  config: SshConfig;

  client: Client;

  isConnected: boolean;

  constructor(config: SshConfig) {
    this.config = config;
    this.client = new Client();
    this.isConnected = false;

    this.client.on('ready', () => {
      console.log('SSH connection established.');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      console.error('SSH connection error:', err);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      console.log('SSH connection closed.');
      this.isConnected = false;
    });
    this.connect();
  }

  connect() {
    if (this.isConnected) return;
    this.client.connect(this.config);
  }

  disconnect() {
    if (this.isConnected) {
      this.client.end();
      this.isConnected = false;
    }
  }

  executeCommand(command: string) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        this.connect();
      }

      const fullCommand = `echo ${this.config.password} | sudo -S ${command}`;

      this.client.exec(fullCommand, (err, stream) => {
        let stdout = '';
        let stderr = '';
        let isPasswordPrompt = false;
        stream
          .on('close', (code, signal) => {
            // If there's anything in stderr that isn't related to the password prompt, reject the promise
            if (stderr && !isPasswordPrompt) {
              reject(new Error(stderr));
            } else {
              resolve(stdout.trim());
            }
          })
          .on('data', (data) => {
            stdout += data.toString();
          })
          .stderr.on('data', (data) => {
            stderr += data.toString();

            // Check if the stderr data contains the password prompt message
            if (data.toString().includes('[sudo] password for')) {
              isPasswordPrompt = true; // Mark that we've handled the password prompt
            }
          });
      });
    });
  }

  async executeSshCommand(command) {
    const output = await this.executeCommand(command);
    return output;
  }

  async waitForConnection(timeout = 5000) {
    const startTime = Date.now();
    while (!this.isConnected) {
      if (Date.now() - startTime > timeout) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
    }
  }

  isConnectedStatus() {
    return this.isConnected;
  }
}
export default SshConnector;
