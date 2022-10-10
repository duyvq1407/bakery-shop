import { Form, Input, InputNumber, Modal, Button, Select, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetAllCategoryQuery } from '../../../../app/api/categoryApiSlice';
import { useGetAllIngredientQuery } from '../../../../app/api/ingredientApiSlice';
import { useAddProductMutation, useUpdateProductMutation } from '../../../../app/api/productApiSlice';
import { useGetAllUnitQuery } from '../../../../app/api/unitApiSlice';
import { v4 } from 'uuid'

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
  const [oldImages, setOldImages] = useState([]);
  const [oldTypeObjArr, setOldTypeObjArr] = useState([])
  const [arrIngredient, setArrIngredient] = useState([])

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
            const ingredientObjArr = data.ingredients.split(';').map(item => {
              return {
                idIngredient: +item.split("-")[0],
                amount: item.split("-")[1]
              }
            })

            const types = data.idTypes?.split(";").map(item => +item) || []

            const fielsData = {
                id: data.id,
                name: data.name,
                idUnit: data.idUnit,
                unitPrice: data.unitPrice,
                description: data.description,
                types,
                ingredientObjArr
            }

            productForm.setFieldsValue(fielsData)

            setFileList(data.images.split(";")?.map((item, index) => {
              return {
                  uid: v4(),
                  name: item,
                  url: `http://127.0.0.1:3001/public/img/${item}`
              }
            }))
            setOldTypeObjArr(types)
            setTitle("Sửa sản phẩm");
            setArrIngredient(ingredientObjArr)
            setMode(MODE.EDIT);
        }
    }
  }))

  const handleCancel = () => {
    setOldTypeObjArr([])
    setOldImages([])
    setFileList([])
    setVisibale(false);
    setError(null);
    productForm.resetFields();
  };

  const onChangeImg = ({fileList: newFileList, file}) => {
    newFileList.forEach(function(item) {
      if (item.originFileObj && !item.base64) {
        let reader = new FileReader();
        reader.onload = (e) => {
            item.base64 =  e.target.result;
        };
        reader.readAsDataURL(item.originFileObj);          
      }
    });

    if (file.status === 'removed' && !file.type) {
      setOldImages(prev => [...prev, {name: file.name, isDeleted: true}])
    }

    setFileList(newFileList);
  };

  const onFinish = (values) => {
    let fileBase64ObjArr = [];
    let imageObjArr = oldImages;

    fileList.forEach(item => {
      if (item.type) {
        fileBase64ObjArr.push({base64: item.base64})
      } else {
        imageObjArr.push({name: item.name, isDeleted: false})
      }
    })

    
    let typeObjArr = [];
    
    oldTypeObjArr.forEach(item => {
      if (!values.types.includes(item)) {
        typeObjArr.push({id: item, isDeleted: true, isCreated: false})
      } else {
        typeObjArr.push({id: item, isDeleted: false, isCreated: false})
      }
    })

    values.types?.forEach(item => {
      if (!typeObjArr.map((item => item.id)).includes(item)) {
        typeObjArr.push({id:item, isDeleted: false, isCreated: true})
      }
    })

    const ingredientObjArr = values.ingredientObjArr.map(item => {
      return {
        idIngredient: item.idIngredient,
        amount: item.amount,
        isCreated: true,
        isDeleted: false,
        isModified: false,
      }
    }) 

    const info = {...values, fileBase64ObjArr, ingredientObjArr}
    
    switch (mode){
        case MODE.ADD:
          AddProduct(info)
              .unwrap()
              .then(() => {
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
          UpdateProduct({...info, typeObjArr, imageObjArr, ingredientObjArr: []})
              .unwrap()
              .then(() => {
                  toast.success("Sửa thành công")
                  setFileList([])
                  setOldImages([])
                  setVisibale(false)
                  setOldTypeObjArr([])
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
            scrollToFirstError={true}
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
                  {listCategory && listCategory?.map((item, idx) => {
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

              <div className='tw-flex tw-items-center'>
                <Form.List name="ingredientObjArr">
                  {(fields, { add, remove }) => (
                    <div className='tw-block'>
                      {fields.map((field, idx) => (
                        <div className='tw-flex tw-items-center' key={field.key} align="baseline">
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) => prevValues.ingredientObjArr !== curValues.ingredientObjArr
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                className='tw-mr-6'
                                label="Nguyên liệu"
                                name={[field.name, 'idIngredient']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn nguyên liệu.',
                                  },
                                ]}
                                >
                                <Select className='tw-w-[350px]' placeholder="Chọn nguyên liệu">
                                  {listIngredient?.map((item)=> {
                                    return (
                                      <Option key={item.id} value={item.id}>
                                        {item.name}
                                      </Option>
                                    )
                                  })}
                                </Select>
                              </Form.Item>
                            )}
                          </Form.Item>
                          
                          <Form.Item
                            {...field}
                            className='tw-mr-6'
                            label="Số lượng"
                            name={[field.name, 'amount']}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng nhập số lượng.',
                              },
                            ]}
                          >
                            <InputNumber placeholder="Nhập số lượng nguyên liệu" className='tw-w-[200px]' min={1}/>
                          </Form.Item> 

                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </div>
                      ))}

                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm nguyên liệu
                        </Button>
                      </Form.Item>
                    </div>
                  )}
                </Form.List>

              </div>
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