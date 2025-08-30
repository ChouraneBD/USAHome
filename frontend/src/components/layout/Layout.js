import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className="layout">
      {showHeader && <Header />}
      <main className={`main-content ${showHeader ? 'with-header' : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
