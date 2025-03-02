import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import '../../App.css';
import { TerminalProps } from '../../types/types';

export default function TerminalObjectTemp({ id, active }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const terminalIncDataListenerRef = useRef<() => void | null>(null);
  const windwoResizeListenerRef = useRef<() => void | null>(null);

  useEffect(() => {
    if (!terminalInstanceRef.current) {
      console.log('creating terminal', id);
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

      const handleIncomingData = (data: string[]) => {
        if (Number(data[0]) === id) {
          terminal.write(data[1]);
        }
      };

      const handleResize = () => {
        fitAddon.fit();
      };

      windwoResizeListenerRef.current = window.electron.ipcRenderer.on(
        'window-resize',
        handleResize,
      );

      const handleKeystroke = (e: string) => {
        window.electron.ipcRenderer.sendMessage('terminal.keystroke', [id, e]);
      };

      terminalIncDataListenerRef.current = window.electron.ipcRenderer.on(
        'terminal.incomingData',
        handleIncomingData,
      );
      terminal.onData(handleKeystroke);

      const handleRender = () => {
        fitAddon.fit();
      };

      terminal.onRender(handleRender);
      terminalInstanceRef.current = terminal;
      fitAddon.fit();
    }

    if (active && terminalRef.current) {
      console.log('opening terminal', id);
      terminalInstanceRef.current.open(terminalRef.current);
      terminalInstanceRef.current.focus();
    }

    return () => {
      if (terminalInstanceRef.current) {
        console.log('disposing terminal', id);
        terminalInstanceRef.current.dispose();
      }
      if (terminalIncDataListenerRef.current) {
        terminalIncDataListenerRef.current();
      }
      if (windwoResizeListenerRef.current) {
        windwoResizeListenerRef.current();
      }
    };
  }, []);

  useEffect(() => {
    if (active && terminalInstanceRef.current) {
      window.electron.ipcRenderer.sendMessage('terminal-restore-data', [id]);
    }
  }, [active, id]);

  return <div className="terminal-container" ref={terminalRef} />;
}
