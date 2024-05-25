import { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logour from "../../assets/uropen2.jpg";

export default function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  const { auth } = useAuth();

  const isLoggedIn = auth?.roles?.find((role) => "5150"?.includes(role))
    ? true
    : false;

  console.log("Czy zalogowany: ", isLoggedIn);

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const signIn = async () => {
    navigate("/login");
  };

  const closeMenu = () => {
    setIsNavExpanded(false);
  };

  return (
    <nav className="navigation">
      <div className="logo-container">
        {isLoggedIn ? (
          <button onClick={signOut}>Wyloguj</button>
        ) : (
          <button onClick={signIn}>Zaloguj</button>
        )}
        <img src={logour} alt="Logo" className="logo-image" />
      </div>
      
      <button
        className="hamburger"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 18L20 18"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 12L20 12"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 6L20 6"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul>
          <li>
            <Link to="/contact" onClick={closeMenu}>Zawody</Link>
          </li>
          <li>
            <Link to="/blogs" onClick={closeMenu}>Zawodnicy</Link>
          </li>
          <li>
            <Link to="/sign-up" onClick={closeMenu}>Nowe zawody</Link>
          </li>
          <li>
            <Link to="/match" onClick={closeMenu}>Mecze</Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>Rankingi</Link>
          </li>
          <li>
            <Link to="/compare" onClick={closeMenu}>Porównaj</Link>
          </li>
          <li>
            <Link to="/cykl" onClick={closeMenu}>Cykl</Link>
          </li>
          <li>
            <Link to="/regulamin" onClick={closeMenu}>Regulamin</Link>
          </li>
        </ul>
      </div>
      <div className="logo"></div>
    </nav>
  );
}
