import { Link } from "react-router-dom";

function Navbar(){
	return(
		<nav style={ {paddin:"10px", borderBottom:"1px solid #ccc"}}>
			<Link to="/">Home</Link> |{" "}
			<Link to="login">Login</Link>|{" "}
			<Link to="/register">Register</Link>
			<Link to="/dashboard">Profile</Link>
		</nav>

	)
}

export default Navbar;
