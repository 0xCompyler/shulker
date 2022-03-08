import React from "react";
import Navbar from "./Navbar";
import HomeBackground from "./HomeBackground";
import "./Home.scss";
import Login from "../Login";

const Home = () => {
	return (
		<div>
			<Navbar />
			<HomeBackground />
			<div className="home">
				<div className="home__container">
					<h1 className="home__header">Shulker</h1>
					<h3 className="home__subtitle">
						Making your youtube feed more productive
					</h3>
					<div className="home__info">

					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
