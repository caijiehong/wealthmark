"use client";
import React from "react";
import { List, FloatingBubble } from "antd-mobile";
import { Property } from "@/app/lib/db/property";
import { useRouter } from "next/navigation";
import { AddOutline } from "antd-mobile-icons";

const App = () => {
  const [properties, setProperties] = React.useState<Property[]>([]);
  React.useEffect(() => {
    fetch("/api/list?uid=test")
      .then((res) => res.json())
      .then((res: { data: Property[] }) => {
        setProperties(res.data);
      });
  }, []);

  const router = useRouter();

  return (
    <>
      <List header="资产列表">
        {properties.map((property: Property) => (
          <List.Item
            key={property.symbol}
            extra={property.name}
            onClick={() => {
              router.push(`/property?id=${property.id}`);
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
          router.push(`/property`);
        }}
      >
        <AddOutline fontSize={32} />
      </FloatingBubble>
    </>
  );
};

export default App;
