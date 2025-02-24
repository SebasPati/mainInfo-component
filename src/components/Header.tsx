import React from "react";
import "../styles/Header.scss";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="header">
      <h1 className="header-title">CineYa</h1>
      <div className="header-content">{children}</div>
    </header>
  );
};

export default Header;