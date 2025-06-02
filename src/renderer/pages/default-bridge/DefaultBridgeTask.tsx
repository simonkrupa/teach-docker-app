import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import bridgeImage from 'assets/imgs/defaultbridgetask.jpg';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function DefaultBridgeTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/default-bridge/second-diagram');
  };
  return (
    <div className="all-pages">
      <h1>{t('defaultBridge_task_title')}</h1>
      <ol>
        <li>{t('defaultBridge_task_step1')}</li>
        <li>{t('defaultBridge_task_step2')}</li>
        <li>{t('defaultBridge_task_step3')}</li>
      </ol>

      <p>{t('defaultBridge_task_instruction')}</p>
      <img
        src={bridgeImage}
        alt=""
        style={{
          width: '500px',
          height: '500px',
          display: 'block',
          margin: '0 auto',
        }}
      />
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        {t('next')}
      </Button>
      <DropdownWithHint />
    </div>
  );
}
