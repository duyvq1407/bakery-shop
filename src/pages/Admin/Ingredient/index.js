import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import React from 'react';
import { toast } from 'react-toastify';
import { useGetAllIngredientQuery, useRemoveIngredientMutation } from '../../../app/api/ingredientApiSlice';
import ModalFormIngredient from './components/ModalFormIngredient';
const columns = [
  {
    title: '#',
    dataIndex: 'index',
    width: '5%'
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    width: '15%',
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    width: '10%',
    sorter: {
      compare: (a, b) => a.unit.localeCompare(b.unit),
    },

  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
    width: '30%'
  },
  {
    title: 'Số lượng tồn kho',
    dataIndex: 'quantity',
    key: 'quantity',
    width: '15%',
    sorter: {
      compare: (a, b) => a.quantity - b.quantity,
    },
  },
  {
    title: 'Ngưỡng cảnh báo',
    dataIndex: 'warningThreshold',
    key: 'warningThreshold',
    width: '15%',
    sorter: {
      compare: (a, b) => a.warningThreshold - b.warningThreshold,
    },
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: '10%',
    render: (_, {action, id}) => (
        <>
            <button 
                className='hover:tw-text-red-400 tw-transition-1 tw-mr-3'
                onClick={() => {action.modalRef.current.show("EDIT", action.item)}}
            >
                <EditOutlined />
            </button>
            <button 
                className='hover:tw-text-red-400 tw-transition-1'
                onClick={() => {action.handleRemove(id)}}
            >
                <DeleteOutlined />
            </button>
        </>
    )
  },
];


const IngredientAdmin = () => {  

    const modalRef = React.useRef();

    const {data: listIngredient, isLoading, error} = useGetAllIngredientQuery();
    const [removeIngredient] = useRemoveIngredientMutation()

    const handleRemove = (id) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa?")
        if (confirm) {
            removeIngredient(id)
            toast.success("Xoa thanh cong")
        }
    }

    let data = []

    if(listIngredient) {
        data = listIngredient.map((item, index) => {
            return {
                id: item.id,
                key: index,
                unit: item.unit,
                quantity: item.quantity,
                index: index + 1,
                warningThreshold: item.warningThreshold,
                name: item.name,
                description: item.description,
                action: {handleRemove, modalRef, item}
            }
        })
    }

    

    return (
        <>
            {isLoading && (
                <div className='tw-flex tw-justify-center tw-my-[150px]'>
                    <Spin tip="Loading..."/>
                </div>
            )}
            {error && (
                <div>
                    <p>Có lỗi xảy ra</p>
                </div>
            )}
            {listIngredient && (
                <>
                    <div className='tw-border-b-2 tw-pb-3 tw-flex tw-justify-end'>
                        <Button
                            onClick={() => modalRef.current.show('ADD')}
                            className='tw-justify-end hover:tw-bg-blue-500 hover:tw-text-white'
                        >
                            Tạo mới
                        </Button>
                    </div>
                    <Table 
                        scroll={{
                            y: 300,
                        }}
                        columns={columns} 
                        dataSource={data} 
                        pagination={{  
                            defaultPageSize: 5, 
                            showSizeChanger: true, 
                            pageSizeOptions: ['5', '10', '15'], 
                            size: 'small'
                        }}
                    />
                </>
            )}
            <ModalFormIngredient ref={modalRef} />
        </>
    )
}
export default IngredientAdmin;