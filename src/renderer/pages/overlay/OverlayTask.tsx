import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import overlayImage from 'assets/imgs/overlaytask.jpg';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function OverlayTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/overlay/fifth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>{t('overlay_task_title')}</h1>
      <ol>
        <li>{t('overlay_task_step_1')}</li>
        <li>{t('overlay_task_step_2')}</li>
        <li>{t('overlay_task_step_3')}</li>
        <li>{t('overlay_task_step_4')}</li>
      </ol>
      <img
        src={overlayImage}
        alt=""
        style={{
          width: '700px',
          height: '794px',
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
