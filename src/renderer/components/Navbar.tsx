import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../UserContext';
import './Navbar.css';

export default function NavBar({ isCollapsed, toggleNavbar }) {
  const { t, i18n } = useTranslation();
  const { Sider } = Layout;
  const task = t('task');
  const overview = t('overview');
  const diagram = t('diagram');

  type MenuItem = Required<MenuProps>['items'][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
    className?: string,
    disabled?: boolean,
    id?: Number,
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
      className,
      disabled,
      id,
    } as MenuItem;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const { progress } = useProgress();
  const [itemsState, setItemsState] = useState([]);

  const generateMenuItems = () => {
    return [
      getItem(
        t('introduction'),
        '/home',
        <HomeOutlined />,
        undefined,
        undefined,
        'home-item',
        false,
        0,
      ),
      getItem(
        t('1task'),
        '/default-bridge',
        undefined,
        [
          getItem(overview, '/default-bridge/overview'),
          getItem(task, '/default-bridge/task'),
          getItem(diagram, '/default-bridge/second-diagram'),
        ],
        undefined,
        'default-bridge-item',
        true,
        1,
      ),
      getItem(
        t('2task'),
        '/bridge',
        undefined,
        [
          getItem(overview, '/bridge/overview'),
          getItem(task, '/bridge/task'),
          getItem(diagram, '/bridge/first-diagram'),
        ],
        undefined,
        'bridge-item',
        true,
        2,
      ),
      getItem(
        t('3task'),
        '/host',
        undefined,
        [
          getItem(overview, '/host/overview'),
          getItem(task, '/host/task'),
          getItem(diagram, '/host/third-diagram'),
        ],
        undefined,
        'host-item',
        true,
        3,
      ),
      getItem(
        t('4task'),
        '/none',
        undefined,
        [
          getItem(overview, '/none/overview'),
          getItem(task, '/none/task'),
          getItem(diagram, '/none/fourth-diagram'),
        ],
        undefined,
        'none-item',
        true,
        4,
      ),
      getItem(
        t('5task'),
        '/macvlan',
        undefined,
        [
          getItem(overview, '/macvlan/overview'),
          getItem(task, '/macvlan/task'),
          getItem(diagram, '/macvlan/sixth-diagram'),
        ],
        undefined,
        'macvlan-item',
        true,
        5,
      ),
      getItem(
        t('6task'),
        '/ipvlan',
        undefined,
        [
          getItem(overview, '/ipvlan/overview'),
          getItem(task, '/ipvlan/task'),
          getItem(diagram, '/ipvlan/seventh-diagram'),
        ],
        undefined,
        'ipvlan-item',
        true,
        6,
      ),
      getItem(
        t('7task'),
        '/overlay',
        undefined,
        [
          getItem(overview, '/overlay/overview'),
          getItem(task, '/overlay/task'),
          getItem(diagram, '/overlay/fifth-diagram'),
        ],
        undefined,
        'overlay-item',
        true,
        7,
      ),
    ];
  };

  useEffect(() => {
    let updatedItems = generateMenuItems();
    if (progress !== undefined) {
      updatedItems = updatedItems.map((item) => {
        if (item?.id < progress && item?.id !== 0) {
          return { ...item, disabled: false };
        }
        return item;
      });

      setItemsState(updatedItems);
    }
  }, [progress, i18n.language]);

  const parentMenuKeys = [
    '/bridge',
    '/default-bridge',
    '/host',
    '/none',
    '/macvlan',
    '/ipvlan',
    '/overlay',
  ];

  const handleOpenChange = (keys) => {
    setOpenKeys([...keys]);
  };

  useEffect(() => {
    const path = `/${location.pathname.split('/').at(1)}`;
    if (parentMenuKeys.includes(path)) {
      if (!openKeys.includes(path)) {
        openKeys.push(path);
        handleOpenChange(openKeys);
      }
    }
  }, [location]);

  return (
    <Sider
      width={230}
      collapsedWidth={0}
      collapsible
      collapsed={isCollapsed}
      onCollapse={() => toggleNavbar()}
      trigger={null}
      className="scrollable-sidebar"
    >
      <Menu
        theme="dark"
        style={{ overflow: 'auto', height: '100%' }}
        onClick={({ key }) => {
          navigate(key);
        }}
        mode="inline"
        items={itemsState}
        className="scrollable-sidebar"
        selectedKeys={[location.pathname]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      />
    </Sider>
  );
}
