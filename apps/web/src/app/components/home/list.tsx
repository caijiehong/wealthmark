"use client";
import React from "react";
import { List, FloatingBubble } from "antd-mobile";
import { PropertyAttributes } from "@/app/lib/db/property";
import { useRouter } from "next/navigation";
import { AddOutline } from "antd-mobile-icons";

const App: React.FC<{ properties: PropertyAttributes[] }> = ({
  properties,
}) => {
  const router = useRouter();

  return (
    <>
      <List header="资产列表">
        {properties.map((property: PropertyAttributes) => (
          <List.Item
            key={property.symbol}
            extra={property.symbol.toUpperCase()}
            onClick={() => {
              router.push(`/pages/property?id=${property.id}`);
            }}
          >
            {property.name}
          </List.Item>
        ))}
      </List>
      <FloatingBubble
        axis="lock"
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={() => {
          router.push(`/pages/property-edit`);
        }}
      >
        <AddOutline fontSize={32} />
      </FloatingBubble>
    </>
  );
};

export default App;
