import { Form, Input, InputNumber, Modal, Select } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';
import { useAddIngredientMutation, useUpdateIngredientMutation } from '../../../../app/api/ingredientApiSlice';
import { useGetAllUnitQuery } from '../../../../app/api/unitApiSlice';
const { Option } = Select;

const ModalFormUnit = (props, ref) => {
  const [visibale, setVisibale] = useState(false);
  const [ingredientForm] = Form.useForm();
  const [title, setTitle] = useState("Thêm đơn vị")
  const [error, setError] = useState(null)
  const MODE = {
    ADD: 'ADD',
    EDIT: 'EDIT',
  };
  const [mode, setMode] = React.useState(MODE.ADD);
  const [AddIngredient, {isLoading: addLoading}] = useAddIngredientMutation();
  const [UpdateIngredient, {isLoading: updateLoading}] = useUpdateIngredientMutation();
  const {data: listUnit} = useGetAllUnitQuery();

  useImperativeHandle(ref, () => ({
    show: (caseForm, data) => {
        setVisibale(true);
        if (caseForm === MODE.ADD) {
            setTitle('Thêm nguyên liệu');
            setMode(MODE.ADD);
        } else {
            setTitle("Sửa nguyên liệu");
            ingredientForm.setFieldsValue(data)
            setMode(MODE.EDIT);
        }
    }
  }))

  const handleCancel = () => {
    setVisibale(false);
    setError(null);
    ingredientForm.resetFields();
  };

  const handleSetIdUnit = (value, e) => {
    ingredientForm.setFieldsValue({idUnit: value, unit: e.children})
  }

  const onFinish = (values) => {

    switch (mode){
        case MODE.ADD:
            AddIngredient(values)
                .unwrap()
                .then(res => {
                    toast.success("Thêm thành công")
                    setVisibale(false)
                    setError(null)
                })
                .catch(error => {
                    console.log(error)
                    setError(error)
                })
            break;
        case MODE.EDIT:
            UpdateIngredient(values)
                .unwrap()
                .then(res => {
                    toast.success("Sửa thành công")
                    setVisibale(false)
                    setError(null)
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
            ingredientForm.submit();
        }}
        confirmLoading={addLoading || updateLoading}
        onCancel={handleCancel}
        okButtonProps={{
          className:
            'tw-bg-sky-500 tw-text-slate-100 hover:tw-bg-sky-600 tw-border-none',
        }}
        cancelButtonProps={{ className: 'hover:tw-bg-transparent' }}
        getContainer={false}
      >
            <Form
                form={ingredientForm}
                preserve={false}
                labelCol={{span: 7}}
                wrapperCol={{span: 16}}
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
                    className='tw-hidden'
                    name="idUnit"
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
                    name="unit"
                    label="Đơn vị"
                    rules={[
                        {
                        required: true,
                        message: 'Vui lòng chọn đơn vị!',
                        },
                    ]}
                >
                    <Select
                        onChange={handleSetIdUnit}
                        placeholder="Chọn đơn vị"
                    >
                        {listUnit && listUnit?.map(item => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>
                        })}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    className={`${mode === MODE.ADD ? 'tw-hidden' : ''}`}
                    label="Số lượng tồn kho"
                    name="quantity"
                >
                    <InputNumber className='tw-w-full'/>
                </Form.Item>
                
                <Form.Item
                    label="Ngưỡng cảnh báo"
                    name="warningThreshold"
                >
                    <InputNumber className='tw-w-full'/>
                </Form.Item>



            </Form>
            
            <div>
                {error && (
                    <div className='tw-text-red-500'>
                    {error?.msg || error?.data?.msg}
                    </div>
                )}  
            </div>
        </Modal>
    </>
  );
};

export default forwardRef(ModalFormUnit);