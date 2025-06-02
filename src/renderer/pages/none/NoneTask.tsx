import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import noneImage from 'assets/imgs/nonetask.jpg';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function NoneTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/none/fourth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>{t('none_task_title')}</h1>
      <ol>
        <li>{t('none_task_step_create_container')}</li>
        <li>{t('none_task_step_validate_access')}</li>
      </ol>
      <p>{t('none_task_description')}</p>
      <img
        src={noneImage}
        alt=""
        style={{
          width: '500px',
          height: '505px',
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
