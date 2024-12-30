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

type TabKey = "home" | "chart";
const Tabs: React.FC<{
  activeKey: TabKey;
  children: React.ReactNode;
}> = ({ activeKey, children }) => {
  const router = useRouter();
  const onClick = (key: TabKey) => {
    if (key === activeKey) {
      return;
    }
    if (key === "home") {
      router.push(`/pages/home`);
    } else if (key === "chart") {
      router.push(`/pages/chart`);
    }
  };
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
          <TabBar.Item
            key="home"
            icon={<UnorderedListOutline />}
            onClick={() => onClick("home")}
          />
          <TabBar.Item
            key="chart"
            icon={<PieOutline />}
            onClick={() => onClick("chart")}
          />
        </TabBar>
      </div>
    </div>
  );
};

export default Tabs;
