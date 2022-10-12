import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Spin, Table } from "antd";
import React from "react";
import { toast } from "react-toastify";
import {
  useGetAllCategoryQuery,
  useRemoveCategoryMutation,
} from "../../../app/api/categoryApiSlice";
import ModalFormCategory from "./components/ModalFormCategory";
const columns = [
  {
    title: "#",
    dataIndex: "index",
    width: "5%",
  },
  {
    title: "Tên",
    dataIndex: "name",
    width: "20%",
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    width: "50%",
  },
  {
    title: "Hành động",
    dataIndex: "action",
    width: "20%",
    render: (_, { action, id }) => (
      <>
        <button
          className="hover:tw-text-red-400 tw-transition-1 tw-mr-3"
          onClick={() => {
            action.modalRef.current.show("EDIT", action.item);
          }}
        >
          <EditOutlined />
        </button>
        <button
          className="hover:tw-text-red-400 tw-transition-1"
          onClick={() => {
            action.handleRemove(id);
          }}
        >
          <DeleteOutlined />
        </button>
      </>
    ),
  },
];

const CategoryAdmin = () => {
  const modalRef = React.useRef();

  const {
    data: categoryList,
    loading: categoryLoading,
    error: categoryError,
  } = useGetAllCategoryQuery();
  const [removeCategory] = useRemoveCategoryMutation();

  const handleRemove = (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (confirm) {
      removeCategory(id);
      toast.success("Xoa thanh cong");
    }
  };

  let data = [];

  if (categoryList) {
    data = categoryList.map((item, index) => {
      return {
        id: item.id,
        key: index,
        index: index + 1,
        name: item.name,
        description: item.description,
        action: { handleRemove, modalRef, item },
      };
    });
  }

  return (
    <>
      {categoryLoading && (
        <div className="tw-flex tw-justify-center tw-my-[150px]">
          <Spin tip="Loading..." />
        </div>
      )}
      {categoryError && (
        <div>
          <p>Có lỗi xảy ra</p>
        </div>
      )}
      {categoryList && (
        <>
          <div className="tw-border-b-2 tw-pb-3 tw-flex tw-justify-end">
            <Button
              onClick={() => modalRef.current.show("ADD")}
              className="tw-justify-end hover:tw-bg-blue-500 hover:tw-text-white"
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
              pageSizeOptions: ["5", "10", "15"],
              size: "small",
            }}
          />
        </>
      )}
      <ModalFormCategory ref={modalRef} />
    </>
  );
};
export default CategoryAdmin;
