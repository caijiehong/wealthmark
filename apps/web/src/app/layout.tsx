import type { Metadata } from "next";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
