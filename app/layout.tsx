import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Spotify.fm',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
