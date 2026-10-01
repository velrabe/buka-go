import type { ReactNode } from "react";
import { localeFor, resolvePath } from "@/lib/content";
import { DesignWorkspace } from "@/components/DesignWorkspace";
import "@/styles/fonts.css";
import "@/styles/design-fonts.css";
import "@/styles/site.scss";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  return (
    <html lang={localeFor(resolvePath("/" + slug.join("/")))} id="top">
      <body><DesignWorkspace>{children}</DesignWorkspace></body>
    </html>
  );
}
