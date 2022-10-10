
import { Button, Col, Row, Spin } from 'antd';
import React from 'react';
import { useGetAllProductQuery } from '../../../app/api/productApiSlice';
import ModalFormProduct from './components/ModalFormProduct';
import ProductCart from './components/ProductCart';

const ProductAdmin = () => {  

    const modalRef = React.useRef();

    const {data: listProduct, isLoading, error} = useGetAllProductQuery();

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
            
            {listProduct && (
                <>
                    <div className='tw-border-b-2 tw-pb-3 tw-flex tw-justify-end'>
                        <Button
                            onClick={() => modalRef.current.show("ADD")}
                            className='tw-justify-end hover:tw-bg-blue-500 hover:tw-text-white'
                        >
                            Tạo mới
                        </Button>
                    </div>
                    <div className="site-card-wrapper">
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            {listProduct && listProduct.map((item, index) => (                        
                                <Col key={item.id} className="gutter-row" span={6}>
                                    <ProductCart data={item}/>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </>
            )}
            
            <ModalFormProduct ref={modalRef} />
        </>
    )
}
export default ProductAdmin;