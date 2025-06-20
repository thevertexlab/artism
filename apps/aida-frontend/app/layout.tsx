import 'leaflet/dist/leaflet.css';
import './globals.css';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Providers from '../components/layout/Providers';
import { SidebarProvider } from '../components/layout/SidebarContext';
import StagewiseToolbarProvider from '../components/layout/StagewiseToolbarProvider';

export const metadata = {
  title: 'AIDA - Artificial Intelligence Artist Database',
  // You can add more metadata here, like description, icons, etc.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <div className="bg-gray-50 dark:bg-[#0D0D0D] text-gray-900 dark:text-white min-h-screen antialiased theme-transition">
          <Providers>
            <SidebarProvider>
              <div className="flex min-h-screen theme-transition">
                <Sidebar />
                <div className="flex-1 flex flex-col lg:ml-0 theme-transition">
                  <TopBar />
                  <main className="flex-1 overflow-y-auto pt-16 theme-transition">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <StagewiseToolbarProvider />
          </Providers>
        </div>
      </body>
    </html>
  )
}
