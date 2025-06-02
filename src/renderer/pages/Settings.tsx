import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, Alert } from 'antd';
import './Pages.css';
import './Settings.css';

export default function Settings() {
  const { t } = useTranslation();
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
        message: t('settings_error_empty'),
      });
      // setLoadingPrimaryTest(false);
      return;
    }
    if (primaryIpValue === secondaryIpValue) {
      setAlertInfoPrimary({
        visible: true,
        type: 'error',
        message: t('settings_error_same'),
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
        message: t('settings_error_empty2'),
      });
      return;
    }
    if (primaryIpValue === secondaryIpValue) {
      setAlertInfoSecondary({
        visible: true,
        type: 'error',
        message: t('settings_error_same'),
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
          message: t('settings_conn_success'),
        });
        setPrimaryIpValid(true);
      } else {
        setAlertInfoPrimary({
          visible: true,
          type: 'error',
          message: t('settings_conn_failure'),
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
          message: t('settings_conn_success'),
        });
        setSecondaryIpValid(true);
      } else {
        setAlertInfoSecondary({
          visible: true,
          type: 'error',
          message: t('settings_conn_failure'),
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
        {t('settings')}
      </h1>
      <h2 style={{ marginBottom: '3%' }}>{t('settings_define_vms')}</h2>
      <div style={{ display: 'flex' }}>
        <div className="primary-vm">
          <h3>{t('settings_ip_primary')}</h3>

          <Input
            className="input-component"
            value={primaryIpValue}
            onChange={handlePrimaryIpChange}
            variant="filled"
          />
          <div className="vm-credentials">
            <h4 className="h4-credentials">{t('placeholder_username')}</h4>
            <Input
              className="input-component"
              variant="filled"
              value={primaryUserNameValue}
              onChange={handlePrimaryUserNameChange}
            />
            <h4 className="h4-credentials">{t('username_password')}</h4>
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
            {t('connection')}
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
          <h3>{t('settings_ip_sec')}</h3>

          <Input
            className="input-component"
            value={secondaryIpValue}
            onChange={handleSecondaryIpChange}
            variant="filled"
          />
          <div className="vm-credentials">
            <h4 className="h4-credentials">{t('placeholder_username')}</h4>
            <Input
              className="input-component"
              variant="filled"
              value={secondaryUserNameValue}
              onChange={handleSecondaryUserNameChange}
            />
            <h4 className="h4-credentials">{t('username_password')}</h4>
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
            {t('connection')}
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
        {t('apply')}
      </Button>
    </div>
  );
}
