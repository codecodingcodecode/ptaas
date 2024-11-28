import React from "react";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="content-wrapper">{children}</main>
      <Footer /> {/* Footer hier einmal einfügen */}
    </div>
  );
};

export default Layout;
