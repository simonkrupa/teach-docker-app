import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Menu, Layout } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  className?: string,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    className,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Home', '/home', <HomeOutlined />, undefined, undefined, 'home-item'),
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
  ),
  getItem('2. Default Bridge', '/second-diagram'),
  getItem('3. Host', '/third-diagram'),
  getItem('4. None', '/fourth-diagram'),
  getItem('5. Macvlan', '/sixth-diagram'),
  getItem('6. Ipvlan', '/seventh-diagram'),
  getItem('7. Overlay', '/fifth-diagram'),
];

export default function NavBar({ isCollapsed, toggleNavbar }) {
  const navigate = useNavigate();
  return (
    <Sider
      width={200}
      collapsedWidth={0}
      collapsible
      collapsed={isCollapsed}
      onCollapse={() => toggleNavbar()}
      trigger={null}
    >
      <Menu
        defaultSelectedKeys={['/settings']}
        theme="dark"
        style={{ overflow: 'auto', height: '100%' }}
        onClick={({ key }) => {
          navigate(key);
        }}
        mode="inline"
        inlineCollapsed={isCollapsed}
        items={items}
      />
    </Sider>
  );
}
