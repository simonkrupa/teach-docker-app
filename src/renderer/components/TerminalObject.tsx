import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import '../App.css';

export default function TerminalObject() {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const terminal = new Terminal({
      cols: 80,
      rows: 30,
      theme: {
        background: '#001520',
      },
      fontSize: 14,
      fontFamily: 'Ubuntu Mono, courier-new, courier, monospace',
      cursorBlink: true,
    });
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current!);

    const handleIncomingData = (data: string) => {
      terminal.write(data);
    };

    const handleResize = () => {
      fitAddon.fit();
    };

    window.electron.ipcRenderer.on('window-resize', handleResize);

    const handleKeystroke = (e: string) => {
      window.electron.ipcRenderer.sendMessage('terminal.keystroke', [e]);
    };

    window.electron.ipcRenderer.on('terminal.incomingData', handleIncomingData);
    terminal.onData(handleKeystroke);

    const handleRender = () => {
      console.log('rendering');
      fitAddon.fit();
    };

    terminal.onRender(handleRender);

    fitAddon.fit();

    return () => {
      terminal.dispose();
    };
  }, []);

  return <div className="terminal-container" ref={terminalRef} />;
}
