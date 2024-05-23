import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
	return (
		<>
			<Nav>
				<NavMenu>
					
					<NavLink to="/contact">
						Zawody
					</NavLink>
					<NavLink to="/blogs">
						Zawodnicy
					</NavLink>
					<NavLink to="/sign-up">
						Nowe zawody
					</NavLink>
          <NavLink to="/about">
						Rankingi
					</NavLink>

					<NavLink to="/compare">
						Porównaj
					</NavLink>
					<NavLink to="/cykl">
						Cykl
					</NavLink>
				</NavMenu>
			</Nav>
		</>
	);
};

export default Navbar;
