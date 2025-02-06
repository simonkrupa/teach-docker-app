import { Client } from 'ssh2';
import { SshConfig } from '../../renderer/types/types';

class SshConnector {
  config: SshConfig;

  client: Client;

  isConnected: boolean;

  isExecuting: boolean;

  constructor(config: SshConfig) {
    this.config = config;
    this.client = new Client();
    this.isConnected = false;
    this.isExecuting = false;
  }

  connect() {
    if (this.isConnected) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.client
        .on('ready', () => {
          console.log('SSH connection established.');
          this.isConnected = true;
          resolve();
        })
        .on('error', (err) => {
          console.error('SSH Connection Error:', err);
          this.isConnected = false;
          reject(err);
        })
        .connect(this.config);
    });
  }

  disconnect() {
    if (this.isConnected) {
      this.client.end();
      this.isConnected = false;
    }
  }

  isConnectionOpen(): boolean {
    return this.isConnected;
  }

  executeCommand(command: string) {
    return new Promise((resolve, reject) => {
      const fullCommand = `echo ${this.config.password} | sudo -S ${command}`;

      this.client.exec(fullCommand, (err, stream) => {
        // if (err) return reject(err); //if (err) throw err;

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
}
export default SshConnector;
