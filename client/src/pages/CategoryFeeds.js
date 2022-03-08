import React, { useState, useEffect, useContext } from "react";

import toast, { Toaster } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import NODE_API_URL from "../config/url";
import UserContext from "../context/UserContext";
import Navbar from "./Home/Navbar";

const toastStyles = {
	fontSize: "2rem",
	fontWeight: "600",
	backgroundColor: "#181818",
	color: "#fff",
};

function CategoryFeeds() {
	const { categoryFeed } = useParams();

	const isActive = true;
	const [feed, setFeed] = useState([]);

	const { user } = useContext(UserContext);

	useEffect(() => {
		Axios.post(`${NODE_API_URL}/auth/getUser`, {
			_id: user._id,
		})
			.then(res => {
				const index = res.data.data.categories.findIndex(category => {
					return category.name === categoryFeed;
				});
				setFeed(res.data.data.categories[index].channels);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	return (
	<>
		<Navbar />
		<div className="category-feed">
			{feed.length ? (
				<div>
					<h1 className="title" style={{marginTop:"30px"}}>
						<span>Feed for </span>
						{categoryFeed}
					</h1>
					<div className="category-feed-yt">
						{feed.map((item, i) => (
							<Link to={`/feed/${categoryFeed}/${item._id}`}>
								<div class="category-card-yt">
									{item.favicon ? (
										<img
											src={item.favicon}
											alt="feed-logo"
											className="category-feed__image"
											width="30"
											height="30"
										/>
									) : (
										<span className="add__feed-image category__default-img">
											{item.name.split("")[0]}
										</span>
									)}
									<h1 class="category-yt-title">
										{item.name}
									</h1>
								</div>
							</Link>
						))}
						<Toaster position="bottom-center" />
					</div>
				</div>
			) : (
				<div className="category__empty">
					<p className="category__empty-heading" style={{marginTop:"30px"}}>No Feeds Yet</p>
					<Link to="/feed">
						<a className="category__empty-link">
							{/* <Plus size={28} /> */}
							<span className="u-ml1">Add a feed</span>
						</a>
					</Link>
				</div>
			)}
		</div>
	</>
	);
}

export default CategoryFeeds;
