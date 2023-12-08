import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export const metadata: Metadata = {
  title: "Erik Lopez&apos;s GreatFrontEnd Application - Crypto Converter",
  description: "Erik Lopez&apos;s GreatFrontEnd Application - Crypto Converter",
};
interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Theme appearance="dark" accentColor="violet" asChild>
          <main>{children}</main>
        </Theme>
      </body>
    </html>
  );
}

export default RootLayout;
