import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './MessageBox.css';
import {
  AiFillCheckCircle,
  AiOutlineArrowRight,
  AiFillCloseCircle,
} from 'react-icons/ai';
import navigationMap from '../util/navigationMap';

export default function MessageBox({ type, message }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nextLocation = `${navigationMap.get(
    location.pathname.split('/')[1],
  )}/overview`;

  return (
    <div className={`message-box ${type}`}>
      <div className="text-container">
        {type === 'success' ? (
          <AiFillCheckCircle
            style={{ width: '50px', height: '50px', marginLeft: '5px' }}
          />
        ) : (
          <AiFillCloseCircle
            style={{ width: '50px', height: '50px', marginLeft: '5px' }}
          />
        )}
        <div className="message-container">
          <h4 className="message-header">Summary</h4>
          <p className="message-text">{message}</p>
        </div>
        {type === 'success' && (
          <Button
            type="default"
            shape="circle"
            onClick={() => {
              navigate(nextLocation);
            }}
            style={{
              // border: '1px solid black',
              zIndex: 100,
              paddingTop: '6px',
              width: '38px',
              height: '38px',
              marginTop: '6px',
              marginRight: '5px',
              minWidth: '38px',
            }}
            className="ant-buttons"
          >
            <AiOutlineArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
