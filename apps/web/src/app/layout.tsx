import type { Metadata } from "next";
// import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "财记",
  description: "财记 -- 记录投资",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
