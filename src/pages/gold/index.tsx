import { useGoldPriceQuery } from "@/api/gold";
import { Button, Card, Flex, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { GoldPriceItem } from "@/services/gold-price";

const { Title, Text } = Typography;

const columns: ColumnsType<GoldPriceItem> = [
  {
    title: "Loai vang",
    dataIndex: "label",
  },
  {
    title: "Mua vao (VND/luong)",
    dataIndex: "buy",
    render: (value: number) => value.toLocaleString("vi-VN"),
  },
  {
    title: "Ban ra (VND/luong)",
    dataIndex: "sell",
    render: (value: number) => value.toLocaleString("vi-VN"),
  },
];

const GoldPage = () => {
  const { data, isLoading, isFetching, error, refetch } = useGoldPriceQuery();

  return (
    <Flex vertical gap={16} style={{ width: "100%" }}>
      <Title level={3} style={{ margin: 0 }}>
        Vietnam Gold Price Today
      </Title>

      <Card>
        <Flex vertical gap={8} style={{ width: "100%" }}>
          <Table<GoldPriceItem>
            rowKey="typeCode"
            loading={isLoading}
            columns={columns}
            dataSource={data?.items ?? []}
            pagination={false}
            scroll={{ x: 640 }}
          />

          <Space size={8} wrap>
            <Text type="secondary">
              Updated:{" "}
              {data?.updatedAt ? dayjs(data.updatedAt).format("YYYY-MM-DD HH:mm:ss") : "--"}
            </Text>
            {data?.source && (
              <Tag color={data.source === "vang-today" ? "gold" : "default"}>
                Source: {data.source}
              </Tag>
            )}
          </Space>

          {error ? (
            <Text type="danger">
              Unable to load gold price data at the moment. Please try again later.
            </Text>
          ) : null}

          <div>
            <Button loading={isFetching} onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </Flex>
      </Card>
    </Flex>
  );
};

export default GoldPage;
