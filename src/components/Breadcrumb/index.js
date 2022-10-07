import { Breadcrumb } from 'antd';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbData = [
    {
        path: '/',
        name: 'Admin'
    },
    {
        path: '/unit',
        name: 'Đơn vị'
    },
    {
        path: '/product',
        name: 'Sản phẩm'
    },
    {
        path: '/product/add',
        name: 'Thêm sản phẩm'
    },
    {
        path: '/product/edit',
        name: 'Sứa sản phẩm'
    },
    {
        path: '/ingredient',
        name: 'Nguyên liệu'
    },
    {
        path: '/category',
        name: 'Danh mục sản phẩm'
    }
]

const AppBreadcrumb = () => {
    const location = useLocation();
    const pathName = location.pathname;
    const [breadcrumb, setBreadcrumb] = React.useState('')

    useEffect(() => {
        const getBreadcrumb = () => {
            breadcrumbData.forEach(item => {
                if(item.path === pathName) {
                    setBreadcrumb(item.name)
                }
            })
        }
        getBreadcrumb();
    }, [pathName])

    return (
        <Breadcrumb separator=">" className='tw-px-5 tw-pt-4'>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>
                {breadcrumb}
            </Breadcrumb.Item>
        </Breadcrumb>
    )
};

export default AppBreadcrumb; 