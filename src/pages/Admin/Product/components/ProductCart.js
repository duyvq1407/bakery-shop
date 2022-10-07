import React from 'react'
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Card, Tooltip } from 'antd';
import './style.css'
import { toast } from 'react-toastify';
import { useRemoveProductMutation } from '../../../../app/api/productApiSlice';
import { useNavigate } from 'react-router-dom';
import ModalFormProduct from './ModalFormProduct';

const ProductCart = ({data}) => {
    
    const [removeProduct, {isLoading: productLoading}] = useRemoveProductMutation()

    const handleRemove = (id) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa?")
        if (confirm) {
            removeProduct(id)
            toast.success("Xoa thanh cong")
        }
    }    

    const modalRef = React.useRef();

    return (
        <>
            <Card
                className={'product-card tw-my-4 md:tw-min-h-[370px]'}
                cover={
                    <img
                        alt="example"
                        src={`http://127.0.0.1:3001/public/img/${data.images?.split(";")[0]}`}
                    />
                }
                actions={[
                    <EditOutlined key="edit" onClick={() => {modalRef.current.show("EDIT", data)}} />,
                    <DeleteOutlined onClick={() => handleRemove(data.id)} key="delete" />,
                ]}
            >
                
                <h3 className='tw-w-full tw-cursor-pointer tw-font-bold tw-text-lg'>
                    <Tooltip title={data.name}>
                        {data.name}
                    </Tooltip>
                </h3>
                <h4>
                    {data.description || <span className='tw-opacity-0'>zaaaaaaaaaaaa</span>}
                </h4>
                <h4 className='tw-font-bold tw-text-base tw-text-red-600'>
                    {data.unitPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})} 
                    / {data.unit}
                </h4>
            </Card>
            
            <ModalFormProduct ref={modalRef} />
        </>
    )
}

export default ProductCart