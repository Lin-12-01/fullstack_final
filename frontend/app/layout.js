import './globals.css';
import Navbar from '../components/Navbar';
import Providers from '../components/Providers';

export const metadata = {
  title: 'TeamPM - Team Project Management',
  description: 'Platform for managing team projects, tasks, and collaboration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
