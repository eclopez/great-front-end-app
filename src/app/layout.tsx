import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Erik Lopez&apos;s GreatFrontEnd Application Site</title>
      </head>
      <body>
        <Theme appearance="dark" accentColor="violet" asChild>
          <main>{children}</main>
        </Theme>
      </body>
    </html>
  );
}

export default RootLayout;
