import "./App.css";
import Navbar from "./components/Navbar/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import Cykl from "./pages/cykl";
import Blogs from "./pages/blogs";
import SignUp from "./pages/signup";
import Contact from "./pages/contact";
import Compare from "./pages/compare";
import Match from "./pages/match";
import Login from "./pages/login";
import Unauthorized from "./pages/unauthorized";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import Logo1 from './assets/logo1.png'
import Logo2 from './assets/logo2.jpg'
import Logo3 from './assets/logo3.jpg'

import ToastNotification from "./components/toast/toastNotification";

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};
function App() {
  return (
    
    <div className="App">
      <ToastNotification />

      <Navbar />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route exact path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="cykl" element={<Cykl />} />
        <Route path="compare" element={<Compare />} />
        <Route path="contact" element={<Contact />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="match" element={<Match />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="blogs" element={<Blogs />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="sign-up" element={<SignUp />} />
          </Route>
        </Route>
      </Routes>
      <div className="header-container">
      <img src={Logo1} alt="Logo1" className="logo1"/>
      <img src={Logo3} alt="Logo1" className="logo3"/>
      
        <div className="header-text">Zadanie finansowane ze środków <br / >Gminy Miasto Rzeszów</div>
        <img src={Logo2} alt="Logo2" className="logo2"/>
      </div>
    </div>
   
    
  );
}

export default App;
