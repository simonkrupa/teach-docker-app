import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space, Alert } from 'antd';
import './Pages.css';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const primaryIpEventListenerRef = useRef<() => void | null>(null);
  const secondaryIpEventListenerRef = useRef<() => void | null>(null);
  const [primaryIpValue, setPrimaryIpValue] = useState('');
  const [secondaryIpValue, setSecondaryIpValue] = useState('');
  const [loadingPrimaryTest, setLoadingPrimaryTest] = useState(false);
  const [loadingSecondaryTest, setLoadingSecondaryTest] = useState(false);
  const [primaryIpValid, setPrimaryIpValid] = useState(false);
  const [secondaryIpValid, setSecondaryIpValid] = useState(false);
  const [alertInfoPrimary, setAlertInfoPrimary] = useState({
    visible: false,
    type: '',
    message: '',
  });
  const [alertInfoSecondary, setAlertInfoSecondary] = useState({
    visible: false,
    type: '',
    message: '',
  });

  const handleStartApp = () => {
    //TODO temp
    // if (!primaryIpValid || !secondaryIpValid) {
    //   return;
    // }
    window.electron.ipcRenderer.sendMessage('set-docker-vms', [
      primaryIpValue,
      secondaryIpValue,
    ]);
    navigate('/home');
  };

  const handlePrimaryIpChange = (e) => {
    setPrimaryIpValid(false);
    setPrimaryIpValue(e.target.value);
  };

  const handleSecondaryIpChange = (e) => {
    setSecondaryIpValid(false);
    setSecondaryIpValue(e.target.value);
  };

  useEffect(() => {
    if (alertInfoPrimary.visible) {
      setLoadingPrimaryTest(false);
    }
  }, [alertInfoPrimary]);

  useEffect(() => {
    if (alertInfoSecondary.visible) {
      setLoadingSecondaryTest(false);
    }
  }, [alertInfoSecondary]);

  const handlePrimaryIpTest = () => {
    setLoadingPrimaryTest(true);
    setAlertInfoPrimary({ visible: false, type: '', message: '' });
    if (primaryIpValue === '') {
      setAlertInfoPrimary({
        visible: true,
        type: 'error',
        message: 'Primary IP address can not be empty.',
      });
      // setLoadingPrimaryTest(false);
      return;
    }
    if (primaryIpValue === secondaryIpValue) {
      setAlertInfoPrimary({
        visible: true,
        type: 'error',
        message: 'IPs can not be same for both VMs.',
      });
      // setLoadingPrimaryTest(false);
      return;
    }
    console.log('Primary IP:', primaryIpValue);
    window.electron.ipcRenderer.sendMessage('validate-primary-ip', [
      primaryIpValue,
    ]);
  };

  const handleSecondaryIpTest = () => {
    setLoadingSecondaryTest(true);
    setAlertInfoSecondary({ visible: false, type: '', message: '' });
    if (secondaryIpValue === '') {
      setAlertInfoSecondary({
        visible: true,
        type: 'error',
        message: 'Secondary IP address can not be empty.',
      });
      return;
    }
    if (primaryIpValue === secondaryIpValue) {
      setAlertInfoSecondary({
        visible: true,
        type: 'error',
        message: 'IPs can not be same for both VMs.',
      });
      return;
    }
    window.electron.ipcRenderer.sendMessage('validate-secondary-ip', [
      secondaryIpValue,
    ]);
  };

  useEffect(() => {
    const validatePrimaryHandler = (arg) => {
      // eslint-disable-next-line no-console
      if (arg[0]) {
        setAlertInfoPrimary({
          visible: true,
          type: 'success',
          message: 'Primary IP address is reachable!',
        });
        setPrimaryIpValid(true);
      } else {
        setAlertInfoPrimary({
          visible: true,
          type: 'error',
          message: 'Failed to reach the primary IP address.',
        });
        setPrimaryIpValid(false);
      }
    };

    const validateSecondaryHandler = (arg) => {
      // eslint-disable-next-line no-console
      if (arg[0]) {
        setAlertInfoSecondary({
          visible: true,
          type: 'success',
          message: 'Secondary IP address is reachable!',
        });
        setSecondaryIpValid(true);
      } else {
        setAlertInfoSecondary({
          visible: true,
          type: 'error',
          message: 'Failed to reach the secondary IP address.',
        });
        setSecondaryIpValid(false);
      }
    };

    primaryIpEventListenerRef.current = window.electron.ipcRenderer.on(
      'validate-primary-ip',
      validatePrimaryHandler,
    );
    secondaryIpEventListenerRef.current = window.electron.ipcRenderer.on(
      'validate-secondary-ip',
      validateSecondaryHandler,
    );

    return () => {
      if (primaryIpEventListenerRef.current) {
        primaryIpEventListenerRef.current();
      }
      if (secondaryIpEventListenerRef.current) {
        secondaryIpEventListenerRef.current();
      }
      // window.electron.ipcRenderer.removeListener(
      //   'validate-primary-ip',
      //   validatePrimaryHandler,
      // );
      // window.electron.ipcRenderer.removeListener(
      //   'validate-secondary-ip',
      //   validateSecondaryHandler,
      // );
    };
  }, []);

  return (
    <div className="settings-page">
      <h1 className="header-name">Settings</h1>

      <h2>Please provide IP Addresses for VMs with Docker</h2>
      <h3>Primary Virutal Machine's IP address</h3>
      <div>
        <Space.Compact>
          <Input
            className="input-component"
            value={primaryIpValue}
            onChange={handlePrimaryIpChange}
          />
          <Button
            className="generic-button"
            type="primary"
            onClick={handlePrimaryIpTest}
            loading={loadingPrimaryTest}
            style={{ width: '100px' }}
          >
            Test
          </Button>
        </Space.Compact>
        {alertInfoPrimary.visible && (
          <Alert
            className="alert"
            message={alertInfoPrimary.message}
            type={alertInfoPrimary.type}
            showIcon
            closable
            onClose={() =>
              setAlertInfoPrimary({ ...alertInfoPrimary, visible: false })
            }
          />
        )}
        {!alertInfoPrimary.visible && (
          <Alert
            className="alert"
            message={'placeholder'}
            showIcon
            style={{ visibility: 'hidden' }}
          />
        )}
      </div>

      <h3>
        Secondary Virtual Machine's IP address (used for Overlay network task)
      </h3>
      <div>
        <Space.Compact>
          <Input
            className="input-component"
            value={secondaryIpValue}
            onChange={handleSecondaryIpChange}
          />
          <Button
            className="generic-button"
            type="primary"
            onClick={handleSecondaryIpTest}
            loading={loadingSecondaryTest}
            style={{ width: '100px' }}
          >
            Test
          </Button>
        </Space.Compact>
        {alertInfoSecondary.visible && (
          <Alert
            className="alert"
            message={alertInfoSecondary.message}
            type={alertInfoSecondary.type}
            showIcon
            closable
            onClose={() =>
              setAlertInfoSecondary({
                ...alertInfoSecondary,
                visible: false,
              })
            }
          />
        )}
        {!alertInfoSecondary.visible && (
          <Alert
            className="alert"
            message={'placeholder'}
            showIcon
            style={{ visibility: 'hidden' }}
          />
        )}
      </div>
      <Button
        onClick={handleStartApp}
        className="generic-button"
        type="primary"
        style={{
          height: '50px',
          width: '100px',
          fontSize: '20px',
          marginTop: '5%',
        }}
      >
        Apply
      </Button>
    </div>
  );
}
