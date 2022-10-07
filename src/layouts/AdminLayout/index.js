import { Breadcrumb, Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Aside from '../../components/Aside';
import AppBreadcrumb from '../../components/Breadcrumb';
import FooterAdmin from '../../components/Footer';
import HeaderAdmin from '../../components/Header';
const { Content } = Layout;



const AdminLayout = () => {
  return (
    <Layout className='tw-min-h-screen' hasSider>
      <Aside className='tw-bg-white'/>
      
      <Layout className="site-layout">
        <HeaderAdmin />

        <AppBreadcrumb />

        <Content
          style={{
            margin: '0 16px',
            overflow: 'initial',
            minHeight: '400px'
          }}
          className="tw-mt-4"
        >

          <div className='tw-bg-white dark:tw-bg-[#1E2139] dark:tw-shadow-slate-700  tw-p-6 tw-min-h-full tw-shadow-md tw-mb-4'>
            {/* This is the content */}
              <Outlet />
            {/* This is the content */}
          </div>

        </Content>

        <FooterAdmin />

      </Layout>
    </Layout>
  );
};

export default AdminLayout;