import React from "react";
import "../styles/Footer.scss";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <h3>CineYa</h3>
          <p>Tu plataforma favorita de cine y entretenimiento.</p>
          <p>📍 Calle Falsa 123, Ciudad Cine</p>
          <p>📧 contacto@cineya.com</p>
        </div>
        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="#" className="social-link"><FaFacebookF /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 CineYa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
