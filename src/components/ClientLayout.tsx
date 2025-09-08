import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientHeader from './ClientHeader';
import Footer from './Footer';

const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ClientHeader />
      <main className="flex-1 bg-muted/30">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;










