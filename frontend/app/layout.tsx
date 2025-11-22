import Header from './components/Header';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Header />
        <main>{children}</main>
        <footer className="gradient-banner text-white mt-auto py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© 2025 cEd Platform - ALM + SCM</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
