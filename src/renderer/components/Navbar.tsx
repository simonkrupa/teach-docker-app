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
  getItem('Home', '/', <HomeOutlined />, undefined, undefined, 'home-item'),
  getItem('Bridge', '/first-diagram'),
  getItem('Default Bridge', '/second-diagram'),
  getItem('Host', '/third-diagram'),
  getItem('None', '/fourth-diagram'),
  // getItem('2. Docker networks', '/second'),
  // getItem('3. Exposing ports', '/third'),
  // getItem('4. Test page', '/fourth'),
  // getItem('5. Smth', '/fifth'),
  // getItem('6. Smth2', '/sixth'),
  // getItem('7. smth3', '/seventh'),
];

export default function NavBar({ isCollapsed, toggleNavbar }) {
  const navigate = useNavigate();
  return (
    <Sider
      width={150}
      collapsedWidth={0}
      collapsible
      collapsed={isCollapsed}
      onCollapse={() => toggleNavbar()}
      trigger={null}
    >
      <Menu
        defaultSelectedKeys={['/']}
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
