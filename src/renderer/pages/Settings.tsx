import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from 'antd';
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
  const [primaryUserNameValue, setPrimaryUserNameValue] = useState('');
  const [primaryPasswordValue, setPrimaryPasswordValue] = useState('');
  const [secondaryUserNameValue, setSecondaryUserNameValue] = useState('');
  const [secondaryPasswordValue, setSecondaryPasswordValue] = useState('');

  const handleStartApp = () => {
    if (!primaryIpValid || !secondaryIpValid) {
      return;
    }
    window.electron.ipcRenderer.sendMessage('set-docker-vms', [
      primaryIpValue,
      secondaryIpValue,
    ]);
    navigate('/home');
  };

  const handlePrimaryUserNameChange = (e) => {
    setPrimaryUserNameValue(e.target.value);
  };

  const handlePrimaryPasswordChange = (e) => {
    setPrimaryPasswordValue(e.target.value);
  };

  const handleSecondaryUserNameChange = (e) => {
    setSecondaryUserNameValue(e.target.value);
  };

  const handleSecondaryPasswordChange = (e) => {
    setSecondaryPasswordValue(e.target.value);
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
        message: 'IP adresa primárneho virtuálneho stroja nemôže byť prázdna.',
      });
      // setLoadingPrimaryTest(false);
      return;
    }
    if (primaryIpValue === secondaryIpValue) {
      setAlertInfoPrimary({
        visible: true,
        type: 'error',
        message: 'IP adresy nemôžu byť rovnaké pre obe virtuálne stroje.',
      });
      // setLoadingPrimaryTest(false);
      return;
    }
    window.electron.ipcRenderer.sendMessage('validate-primary-ip', [
      primaryIpValue,
      primaryUserNameValue,
      primaryPasswordValue,
    ]);
  };

  const handleSecondaryIpTest = () => {
    setLoadingSecondaryTest(true);
    setAlertInfoSecondary({ visible: false, type: '', message: '' });
    if (secondaryIpValue === '') {
      setAlertInfoSecondary({
        visible: true,
        type: 'error',
        message:
          'IP adresa sekundárneho virtuálneho stroja nemôže byť prázdna.',
      });
      return;
    }
    if (primaryIpValue === secondaryIpValue) {
      setAlertInfoSecondary({
        visible: true,
        type: 'error',
        message: 'IP adresy nemôžu byť rovnaké pre obe virtuálne stroje.',
      });
      return;
    }
    window.electron.ipcRenderer.sendMessage('validate-secondary-ip', [
      secondaryIpValue,
      secondaryUserNameValue,
      secondaryPasswordValue,
    ]);
  };

  useEffect(() => {
    const validatePrimaryHandler = (arg) => {
      // eslint-disable-next-line no-console
      if (arg[0]) {
        setAlertInfoPrimary({
          visible: true,
          type: 'success',
          message: 'Spojenie s virtuálnym strojom prebehlo úspešne.',
        });
        setPrimaryIpValid(true);
      } else {
        setAlertInfoPrimary({
          visible: true,
          type: 'error',
          message: 'Spojenie s virtuálnym strojom zlyhalo.',
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
          message: 'Spojenie s virtuálnym strojom prebehlo úspešne.',
        });
        setSecondaryIpValid(true);
      } else {
        setAlertInfoSecondary({
          visible: true,
          type: 'error',
          message: 'Spojenie s virtuálnym strojom zlyhalo.',
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
    };
  }, []);

  return (
    <div className="settings-page">
      <h1 className="header-name" style={{ marginBottom: '0' }}>
        Nastavenia
      </h1>
      <h2 style={{ marginBottom: '3%' }}>
        Zadefinujte IP adresy a prihlasovacie údaje pre virtuálne stroje bežiace
        docker.
      </h2>
      <div style={{ display: 'flex' }}>
        <div className="primary-vm">
          <h3>IP adresa primárneho virtuálneho stroja</h3>

          <Input
            className="input-component"
            value={primaryIpValue}
            onChange={handlePrimaryIpChange}
            variant="filled"
          />
          <div className="vm-credentials">
            <h4 className="h4-credentials">Používateľské meno</h4>
            <Input
              className="input-component"
              variant="filled"
              value={primaryUserNameValue}
              onChange={handlePrimaryUserNameChange}
            />
            <h4 className="h4-credentials">Používateľské heslo</h4>
            <Input.Password
              className="input-component"
              variant="filled"
              value={primaryPasswordValue}
              onChange={handlePrimaryPasswordChange}
            />
          </div>
          <Button
            className="generic-button-settings"
            type="primary"
            onClick={handlePrimaryIpTest}
            loading={loadingPrimaryTest}
            style={{ width: '100%', marginTop: '2em', marginBottom: '1em' }}
          >
            Pripojenie
          </Button>
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

        <div className="primary-vm">
          <h3>IP adresa sekundárneho virtuálneho stroja</h3>

          <Input
            className="input-component"
            value={secondaryIpValue}
            onChange={handleSecondaryIpChange}
            variant="filled"
          />
          <div className="vm-credentials">
            <h4 className="h4-credentials">Používateľské meno</h4>
            <Input
              className="input-component"
              variant="filled"
              value={secondaryUserNameValue}
              onChange={handleSecondaryUserNameChange}
            />
            <h4 className="h4-credentials">Používateľské heslo</h4>
            <Input.Password
              className="input-component"
              variant="filled"
              value={secondaryPasswordValue}
              onChange={handleSecondaryPasswordChange}
            />
          </div>
          <Button
            className="generic-button-settings"
            type="primary"
            onClick={handleSecondaryIpTest}
            loading={loadingSecondaryTest}
            style={{ width: '100%', marginTop: '2em', marginBottom: '1em' }}
          >
            Pripojenie
          </Button>
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
      </div>
      <Button onClick={handleStartApp} className="submit-button" type="primary">
        Použiť
      </Button>
    </div>
  );
}
