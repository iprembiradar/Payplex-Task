import "../styles/Navbar.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © This Web Application Developed By Prem.{" "}
        <a 
          href="https://prembiradar.netlify.app/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          My Portfolio
        </a>
      </p>
    </footer>
  );
};

export default Footer;