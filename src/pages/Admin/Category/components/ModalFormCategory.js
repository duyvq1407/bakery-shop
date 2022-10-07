import { Form, Input, Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';
import { useAddCategoryMutation, useUpdateCategoryMutation } from '../../../../app/api/categoryApiSlice';

const ModalFormCategory = (props, ref) => {
  const [visibale, setVisibale] = useState(false);
  const [categoryForm] = Form.useForm();
  const [title, setTitle] = useState("Thêm đơn vị")
  const [error, setError] = useState(null)
  const MODE = {
    ADD: 'ADD',
    EDIT: 'EDIT',
  };
  const [mode, setMode] = React.useState(MODE.ADD);
  const [AddCategory, {isLoading: addLoading}] = useAddCategoryMutation();
  const [UpdateCategory, {isLoading: updateLoading}] = useUpdateCategoryMutation();

  useImperativeHandle(ref, () => ({
    show: (caseForm, data) => {
        setVisibale(true);
        if (caseForm === MODE.ADD) {
            setTitle('Thêm danh mục sản phẩm');
            setMode(MODE.ADD);
        } else {
            setTitle("Sửa danh mục sản phẩm");
            setMode(MODE.EDIT);
            categoryForm.setFieldsValue(data)
        }
    }
  }))

  const handleCancel = () => {
    setVisibale(false);
    setError(null);
    categoryForm.resetFields();
  };

  const onFinish = (values) => {

    switch (mode){
        case MODE.ADD:
            AddCategory(values)
                .unwrap()
                .then(res => {
                    toast.success("Thêm thành công")
                    setVisibale(false)
                    setError(null)
                })
                .catch(error => {
                    setError(error)
                })
            break;
        case MODE.EDIT:
            UpdateCategory(values)
                .unwrap()
                .then(res => {
                    setTimeout(() => {
                        toast.success("Sửa thành công")
                        setVisibale(false)
                        setError(null)
                    }, 1000)
                })
                .catch(error => {
                    setError(error)
                })
            break;

        default:
    }
  };

  return (
    <>
      <Modal
        title={title}
        open={visibale}
        okType='default'
        okText="Lưu"
        onOk={() => {
            categoryForm.submit();
        }}
        confirmLoading={addLoading || updateLoading}
        onCancel={handleCancel}
        getContainer={false}
      >
            <Form
                form={categoryForm}
                preserve={false}
                labelCol={{span: 4}}
                wrapperCol={{span: 18}}
                onFinish={onFinish}
                layout="horizontal"
            >
                <Form.Item
                    className='tw-hidden'
                    name="id"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input />
                </Form.Item>

            </Form>
            
            <div>
                {error && (
                    <div className='tw-text-red-500'>
                    {error?.message || error?.data?.message}
                    </div>
                )}  
            </div>
        </Modal>
    </>
  );
};

export default forwardRef(ModalFormCategory);