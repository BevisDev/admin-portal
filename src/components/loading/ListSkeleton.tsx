import { Skeleton } from "antd";

const ListSkeleton = () => {
  return (
    <div style={{ padding: 24 }}>
      <Skeleton active avatar paragraph={{ rows: 3 }} />
      <Skeleton active avatar paragraph={{ rows: 3 }} />
      <Skeleton active avatar paragraph={{ rows: 3 }} />
    </div>
  );
};

export default ListSkeleton;
