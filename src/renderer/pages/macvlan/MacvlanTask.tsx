import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import macvlanImage from 'assets/imgs/macvlantask.jpg';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function MacvlanTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/macvlan/sixth-diagram');
  };
  return (
    <div className="all-pages">
      <h1>{t('macvlan_task_title')}</h1>
      <ol>
        <li>{t('macvlan_task_step_1')}</li>
        <li>{t('macvlan_task_step_2')}</li>
        <li>{t('macvlan_task_step_3')}</li>
        <li>{t('macvlan_task_step_4')}</li>
      </ol>
      <p>{t('macvlan_task_description')}</p>
      <img
        src={macvlanImage}
        alt=""
        style={{
          width: '500px',
          height: '602px',
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
