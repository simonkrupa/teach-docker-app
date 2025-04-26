import { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import '../../App.css';
import TerminalObjectTemp from './TerminalObjectTemp';

export default function TerminalContainer() {
  const [terminals, setTerminals] = useState<number[]>([]);
  const [activeTerminal, setActiveTerminal] = useState<number | null>(null);

  const addTerminal = () => {
    if (terminals.length >= 3) {
      console.log('max terminals reached');
      return;
    }
    console.log('adding terminal');
    const newTerminalId = terminals.length;
    setTerminals((prev) => [...prev, newTerminalId]);
    setActiveTerminal(newTerminalId);
    window.electron.ipcRenderer.sendMessage('create-terminal', []);
  };

  useEffect(() => {
    if (terminals.length === 0) {
      addTerminal();
    }
  }, []);

  return (
    <div>
      <div className="terminal-header">
        <div className="terminal-choice">
          {terminals.map((terminalId) => (
            <Button
              key={terminalId}
              onClick={() => {
                setActiveTerminal(terminalId);
              }}
              className="term-button-choice"
            >
              {terminalId + 1}
            </Button>
          ))}

          <Button
            onClick={addTerminal}
            className="term-button-add"
            type="primary"
          >
            +
          </Button>
          <Tooltip
            placement="top"
            title={
              <>
                Copy: Ctrl + Insert
                <br />
                Paste: Shift + Insert
              </>
            }
          >
            <QuestionCircleOutlined className="tooltip-copying" />
          </Tooltip>
        </div>
      </div>
      <div>
        {terminals.map(
          (terminalId) =>
            terminalId === activeTerminal && (
              <TerminalObjectTemp key={terminalId} id={terminalId} active />
            ),
        )}
      </div>
      {/* <div>{activeTerminal !== null && terminals[activeTerminal]}</div> */}
    </div>
  );
}
