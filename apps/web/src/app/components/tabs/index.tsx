"use client";
import { TabBar, FloatingBubble } from "antd-mobile";
import {
  AddOutline,
  PieOutline,
  UnorderedListOutline,
} from "antd-mobile-icons";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./index.module.css";

const Tabs: React.FC<{
  activeKey: "home" | "chart";
  children: React.ReactNode;
}> = ({ activeKey, children }) => {
  const router = useRouter();
  return (
    <div className={styles.app}>
      <div className={styles.body}>{children}</div>
      <div className={styles.bottom}>
        <FloatingBubble
          axis="lock"
          style={{
            "--initial-position-bottom": "54px",
            "--initial-position-right": "24px",
            "--edge-distance": "24px",
          }}
          onClick={() => {
            router.push(`/pages/property-edit`);
          }}
        >
          <AddOutline fontSize={32} />
        </FloatingBubble>
        <TabBar activeKey={activeKey} safeArea={true}>
          <TabBar.Item key="home" icon={<UnorderedListOutline />} />
          <TabBar.Item key="chart" icon={<PieOutline />} />
        </TabBar>
      </div>
    </div>
  );
};

export default Tabs;
