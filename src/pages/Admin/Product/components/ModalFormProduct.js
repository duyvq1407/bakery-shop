import { Form, Input, InputNumber, Modal, Space, Button, Select, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetAllCategoryQuery } from '../../../../app/api/categoryApiSlice';
import { useGetAllIngredientQuery } from '../../../../app/api/ingredientApiSlice';
import { useAddProductMutation, useUpdateProductMutation } from '../../../../app/api/productApiSlice';
import { useGetAllUnitQuery } from '../../../../app/api/unitApiSlice';
const { Option } = Select;

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
const MODE = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

const ModalFormProduct = (props, ref) => {
  const [visibale, setVisibale] = useState(false);
  const [productForm] = Form.useForm();
  const [title, setTitle] = useState("Thêm sản phẩm")
  const [error, setError] = useState(null)
  const [mode, setMode] = React.useState(MODE.ADD);
  const [fileList, setFileList] = useState([]);
  const [imageObjArr, setImageObjArr] = useState([]);
  const [typeObjArr, setTypeObjArr] = useState([])

  const {data: listUnit} = useGetAllUnitQuery();
  const {data: listIngredient} = useGetAllIngredientQuery();
  const {data: listCategory} = useGetAllCategoryQuery();
  const [AddProduct, {isLoading: addLoading}] = useAddProductMutation();
  const [UpdateProduct, {isLoading: updateLoading}] = useUpdateProductMutation()

  useImperativeHandle(ref, () => ({
    show: (caseForm, data) => {
        setVisibale(true);
        if (caseForm === MODE.ADD) {
            setTitle('Thêm sản phẩm');
            setMode(MODE.ADD);
        } else {
            setTitle("Sửa sản phẩm");
            let fielsData = {
                id: data.id,
                name: data.name,
                idUnit: data.idUnit,
                unitPrice: data.unitPrice,
                description: data.description,
                types: data.idTypes?.split(";")?.map(item => +item),
                amount: +data.ingredients?.split(";")[0].split("-")[1],
                ingredient: +data.ingredients?.split(";")[0].split("-")[0]
            }
            let arrTypes = data.idTypes?.split(";").map(item => +item) || []
            setTypeObjArr(arrTypes)
            setFileList(data.images.split(";")?.map((item, index) => {
                return {
                    uid: index + 1,
                    name: item,
                    url: `http://127.0.0.1:3001/public/img/${item}`
                }
            }))
            productForm.setFieldsValue(fielsData)
            setMode(MODE.EDIT);
        }
    }
  }))

  const handleCancel = () => {
    setTypeObjArr([])
    setImageObjArr([])
    setFileList([])
    setVisibale(false);
    setError(null);
    productForm.resetFields();
  };

  const onChangeImg = ({fileList: newFileList, file}) => {
    newFileList.forEach(function(item) {
      if (item.originFileObj) {
        let reader = new FileReader();
        reader.onload = (e) => {
            item.base64 =  e.target.result;
        };
        reader.readAsDataURL(item.originFileObj);          
      }
    });

    if (file.status === 'removed' && !file.type) {
      setImageObjArr([...imageObjArr, {name: file.name, isDeleted: true}])
    }

    setFileList(newFileList);
  };

  const onFinish = (values) => {
    let newImgs = [];
    let oldImgs = [];
    let arrTypes = [];
    typeObjArr.forEach(item => {
      if (!values.types.includes(item)) {
        arrTypes.push({id: item, isDeleted: 1, isCreated: 0})
      } else {
        arrTypes.push({id: item, isDeleted: 0, isCreated: 0})
      }
    })

    values.types?.forEach(item => {
      if (!arrTypes.map((item => item.id)).includes(item)) {
        arrTypes.push({id:item, isDeleted: 0, isCreated: 1})
      }
    })

    fileList.forEach(item => {
      if (item.type) {
        newImgs.push({base64: item.base64})
      } else {
        oldImgs.push({name: item.name, isDeleted: false})
      }
    })

    const ingredientObjArr = [
      {
        idIngredient: values.ingredient,
        amount: values.amount,
        isCreated: true,
        isDeleted: false,
        isModified: false,
      }
    ];    
    const info = {...values, fileBase64ObjArr: newImgs, ingredientObjArr}
    
    switch (mode){
        case MODE.ADD:
            AddProduct(info)
                .unwrap()
                .then(res => {
                    toast.success("Thêm thành công")
                    setFileList([])
                    setVisibale(false)
                    setError(null)
                })
                .catch(error => {
                    console.log(error)
                    setError(error)
                })
            break;
        case MODE.EDIT:
            console.log({...info, typeObjArr: arrTypes, imageObjArr: [...imageObjArr, ...oldImgs], ingredientObjArr: []});
            UpdateProduct({...info, typeObjArr: arrTypes, imageObjArr: [...imageObjArr, ...oldImgs], ingredientObjArr: []})
                .unwrap()
                .then(res => {
                    toast.success("Sửa thành công")
                    setFileList([])
                    setImageObjArr([])
                    setVisibale(false)
                    setTypeObjArr([])
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
        width={'60%'}
        title={title}
        open={visibale}
        okType='default'
        okText="Lưu"
        onOk={() => {
            productForm.submit();
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
            form={productForm}
            preserve={false}
            onFinish={onFinish}
            layout="vertical"
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

            <div className='tw-flex tw-items-center'>
              <Form.Item
                className='tw-w-full tw-mx-6'
                label="Tên sản phẩm"
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
                className='tw-w-full tw-mx-6'
                label="Mô tả"
                name="description"
                >
                  <Input />
              </Form.Item>
            </div>
            
            <div className='tw-flex tw-items-center tw-justify-between'>
              <Form.Item
                className='tw-w-full tw-mx-6'
                name="idUnit"
                label="Đơn vị tính"
                rules={[
                  {
                  required: true,
                  message: 'Vui lòng chọn đơn vị!',
                  },
                ]}
              >
                  <Select
                    placeholder="Chọn đơn vị"
                  >
                    {listUnit && listUnit?.map(item => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    })}
                  </Select>
              </Form.Item>
              
              <Form.Item
                className='tw-w-full tw-mx-6'
                name="unitPrice"
                rules={[
                  {
                  required: true,
                  message: 'Vui lòng nhập đơn giá!',
                  },
                ]}

                label="Đơn giá"
              >
                <InputNumber className='tw-w-full' />
              </Form.Item>
            </div>

            <Form.Item
              className='tw-mx-6'
              name="types"
              label="Thể loại sản phẩm"
              rules={[
                {
                required: true,
                message: 'Vui lòng chọn thể loại!',
                },
              ]}
            >
                <Select
                  placeholder="Thể loại sản phẩm"
                  mode="multiple"
                  tokenSeparators={[';']}
                >
                  {listCategory && listCategory?.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })}
                </Select>
            </Form.Item>
            
            <div className='tw-mx-6'>
              <h3>Hình ảnh</h3>
              <ImgCrop rotate aspect={3/2}>
                <Upload
                  showUploadList={{ showPreviewIcon: false }}
                  customRequest={dummyRequest}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChangeImg}
                >
                  {fileList.length < 5 && '+ Upload'}
                </Upload>
              </ImgCrop>
            </div>

            <div className='tw-mx-6 tw-mt-3'>

              <h3 className='tw-border-b-2 tw-pb-2 tw-mb-4'>Danh sách nguyên liệu</h3>
              {/* <div className='tw-flex tw-items-center'>

                <Form.Item
                  className='tw-w-1/3 tw-mr-12'
                  name="ingredient"
                  label="Nguyên liệu"
                  rules={[
                    {
                    required: true,
                    message: 'Vui lòng chọn thể loại!',
                    },
                  ]}
                  >
                    <Select
                      placeholder="Chọn nguyên liệu"
                    >
                      {listIngredient && listIngredient?.map(item => {
                        return <Option key={item.id} value={item.id}>{item.name} - {item.unit}</Option>
                      })}
                    </Select>
                </Form.Item>

                <Form.Item
                  className='tw-w-1/3'
                  name="amount"
                  rules={[
                    {
                    required: true,
                    message: 'Vui lòng nhập số lượng nguyên liệu!',
                    },
                  ]}

                  label="Số lượng"
                >
                  <InputNumber className='tw-w-full' />
                </Form.Item>

              </div> */}
            </div>            

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

export default forwardRef(ModalFormProduct);