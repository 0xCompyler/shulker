import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import NODE_API_URL from "../config/url";
import { Link } from "react-router-dom";
import Navbar from "./Home/Navbar";

const Categories = () => {
	const [categories, setCategories] = useState([]);

	const { token, user } = useContext(UserContext);

	useEffect(() => {
		Axios.post(`${NODE_API_URL}/auth/getUser`, {
			_id: user._id,
		})
			.then(res => {
				console.log(res.data, "Data");
				setCategories(res.data.data.categories);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	return (
		<>
			<Navbar />
			<div className="category-wrapper">
				<h1 className="title" style={{marginTop:"30px"}}>Categories</h1>
				<div className="category-container">
					{categories.map(category => (
						<Link to={`/feed/${category.name}`}>
							<figure className="snip1527">
								<div className="image">
									<img
										src={`https://source.unsplash.com/random/600x800?sig=${Math.random()
										.toString()
											.replace(".", "")}`}
										alt="pr-sample23"
									/>
								</div>
								<figcaption>
									<h3>{category.name}</h3>
								</figcaption>
							</figure>
						</Link>
					))}
				</div>
			</div>
		</>
	);
};

export default Categories;
