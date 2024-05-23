import { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logour from "../../assets/uropen2.jpg"

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
            <Link to="/contact">Zawody</Link>
          </li>
          <li>
            <Link to="/blogs">Zawodnicy</Link>
          </li>
          <li>
            <Link to="/sign-up">Nowe zawody</Link>
          </li>
          <li>
            <Link to="/match">Mecze</Link>
          </li>

          <li>
            <Link to="/about">Rankingi</Link>
          </li>
          <li>
            <Link to="/compare">Porównaj</Link>
          </li>
          <li>
            <Link to="/cykl">Cykl</Link>
          </li>
        </ul>
      </div>
      <div className="logo"></div>
    </nav>
  );
}
