import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useProgress } from '../UserContext';
import './Navbar.css';

const { Sider } = Layout;

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

const items: MenuItem[] = [
  getItem(
    'Home',
    '/home',
    <HomeOutlined />,
    undefined,
    undefined,
    'home-item',
    false,
    0,
  ),
  getItem(
    '1. Bridge',
    '/bridge',
    undefined,
    [
      getItem('Bridge Overview', '/bridge/overview'),
      getItem('Bridge Task', '/bridge/task'),
      getItem('Bridge Diagram', '/bridge/first-diagram'),
    ],
    undefined,
    'bridge-item',
    true,
    1,
  ),
  getItem(
    '2. Default Bridge',
    '/default-bridge',
    undefined,
    [
      getItem('Default Bridge Overview', '/default-bridge/overview'),
      getItem('Default Bridge Task', '/default-bridge/task'),
      getItem('Default Bridge Diagram', '/default-bridge/second-diagram'),
    ],
    undefined,
    'default-bridge-item',
    true,
    2,
  ),
  getItem(
    '3. Host',
    '/host',
    undefined,
    [
      getItem('Host Overview', '/host/overview'),
      getItem('Host Task', '/host/task'),
      getItem('Host Diagram', '/host/third-diagram'),
    ],
    undefined,
    'host-item',
    true,
    3,
  ),
  getItem(
    '4. None',
    '/none',
    undefined,
    [
      getItem('None Overview', '/none/overview'),
      getItem('None Task', '/none/task'),
      getItem('None Diagram', '/none/fourth-diagram'),
    ],
    undefined,
    'none-item',
    true,
    4,
  ),
  getItem(
    '5. Macvlan',
    '/macvlan',
    undefined,
    [
      getItem('Macvlan Overview', '/macvlan/overview'),
      getItem('Macvlan Task', '/macvlan/task'),
      getItem('Macvlan Diagram', '/macvlan/sixth-diagram'),
    ],
    undefined,
    'macvlan-item',
    true,
    5,
  ),
  getItem(
    '6. Ipvlan',
    '/ipvlan',
    undefined,
    [
      getItem('Ipvlan Overview', '/ipvlan/overview'),
      getItem('Ipvlan Task', '/ipvlan/task'),
      getItem('Ipvlan Diagram', '/ipvlan/seventh-diagram'),
    ],
    undefined,
    'ipvlan-item',
    true,
    6,
  ),
  getItem(
    '7. Overlay',
    '/overlay',
    undefined,
    [
      getItem('Overlay Overview', '/overlay/overview'),
      getItem('Overlay Task', '/overlay/task'),
      getItem('Overlay Diagram', '/overlay/fifth-diagram'),
    ],
    undefined,
    'overlay-item',
    true,
    7,
  ),
];

export default function NavBar({ isCollapsed, toggleNavbar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const { progress } = useProgress();
  const [itemsState, setItemsState] = useState(items);

  useEffect(() => {
    if (progress !== undefined) {
      const returnedItems = itemsState.map((item) => {
        if (item?.id < progress && item?.id !== 0) {
          return { ...item, disabled: false };
        }
        return item;
      });

      setItemsState(returnedItems);
    }
  }, [progress]);

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
      width={200}
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
        inlineCollapsed={isCollapsed}
        items={itemsState}
        className="scrollable-sidebar"
        selectedKeys={[location.pathname]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      />
    </Sider>
  );
}
