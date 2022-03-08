import React,{useContext} from "react";
import UserContext from "../../context/UserContext";
import {useNavigate} from "react-router-dom"

const Navbar = () => {

	const {token,logout} = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<nav className="home__nav">
			<div className="home__nav--container">
				<div className="home__nav--wrapper">
					<div className="home__nav--mobile-btn-container">
						<button
							type="button"
							className="home__nav--mobile-btn"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							<svg
								className="home__nav--mobile-btn-svg-visible"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
							<svg
								className="home__nav--mobile-btn-svg-hidden"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					<div className="home__nav--logo">

						<div className="home__nav--links">
							<div className="home__nav--links-container">
								<a href="/" className="home__nav--links-link">
									Home
								</a>
								<a
									href="/categories"
									className="home__nav--links-link"
								>
									Categories
								</a>
								<a href="/feed" className="home__nav--links-link">
									Add Feed
								</a>

								<a href="/addCategory" className="home__nav--links-link">
									Add Category
								</a>
							</div>
						</div>
					</div>
					<div className="home__nav--right-container">
						{token ? (
							<a
								href="/"
								className="home__nav--right"
								aria-current="page"
								onClick={logout}
							>
								Logout
							</a>
						) : (
							<a
								href="/"
								className="home__nav--right"
								aria-current="page"
								onClick={() => {
									navigate("/login")
								}}
							>
								Login
							</a>
						)}
					</div>
				</div>
			</div>
			<div className="home__nav--mobile-container" id="mobile-menu">
				<div className="home__nav--mobile-container-wrapper">
					<a
						href="/"
						className="home__nav--mobile-container-page-active"
						aria-current="page"
					>
						Meet
					</a>
					<a href="/" className="home__nav--mobile-container-page">
						About
					</a>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
