import Head from "next/head";
import type { ReactNode } from "react";

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => (
  <div className="min-h-screen">
    <Head>
      <title>{title ? `${title} - Campaign Scheduler` : "Campaign Scheduler"}</title>
    </Head>
    <main className="mx-auto max-w-4xl px-4 py-12">{children}</main>
  </div>
);

export default Layout;
