"use client";
import React from "react";
import { PropertyAttributes } from "@/app/lib/db";

import { AutoCenter, Button, Space } from "antd-mobile";
import { useRouter } from "next/navigation";

const Action = ({ property }: { property: PropertyAttributes }) => {
  const router = useRouter();

  const onDeleteProperty = async () => {
    await fetch(`/api/property?id=${property.id}`, {
      method: "DELETE",
      body: JSON.stringify({ id: property.id, symbol: property.symbol }),
    });
    router.push("/pages/home");
  };

  return (
    <AutoCenter>
      <Space>
        <Button
          block
          type="button"
          color="danger"
          size="large"
          onClick={onDeleteProperty}
        >
          删除
        </Button>
        <Button
          block
          type="button"
          color="primary"
          size="large"
          onClick={() => {
            router.push(`/pages/property-edit?id=${property.id}`);
          }}
        >
          编辑
        </Button>
      </Space>
    </AutoCenter>
  );
};

export default Action;
