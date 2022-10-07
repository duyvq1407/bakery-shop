import {
  TagsOutlined,
  FileOutlined,
  PieChartOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  TeamOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { Menu, Select } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import "./style.css"

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Sản phẩm', '/product', <PieChartOutlined />),
  getItem('Danh mục sản phẩm', '/category', <TagsOutlined />),
  getItem('Nguyên liệu', '/ingredient', <FileOutlined />),
  getItem('Đơn vị', '/unit', <ExperimentOutlined />),
  // getItem('Tài khoản', 'sub1', <TeamOutlined />, [getItem('User 1', '5'), getItem('User 2', '7')]),
];

const Aside = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider 
      breakpoint='lg'
      width={240}
      trigger={null}
      collapsible 
      collapsedWidth={65}
      collapsed={collapsed} 
      className="tw-h-screen tw-bg-white admin-aside tw-shadow-lg tw-sticky
                    tw-drop-shadow-xl tw-top-0 tw-bottom-0 tw-z-50 tw-left-0"
      onCollapse={(value) => setCollapsed(value)}
    >
      <div 
        className=''
      >

        <div className="tw-min-h-[60px] tw-flex tw-items-center tw-justify-around">
          {!collapsed && <Logo />}
          <button
            className="hover:tw-text-blue-400 tw-text-blue-300"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <DoubleRightOutlined className='tw-text-xl' />
            ) : (
              <DoubleLeftOutlined className='tw-text-xl' />
            )}
          </button>
        </div>

        <Menu 
          onClick={(e) => {
            navigate(e.key)
          }}
          selectedKeys={[pathName]}
          theme="light" 
          mode="inline"
          defaultSelectedKeys={['1']} 
          items={items} 
        />

      </div>

    </Sider>
  )
}

export default Aside 