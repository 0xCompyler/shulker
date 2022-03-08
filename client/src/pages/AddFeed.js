import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import Axios from "axios";
import NODE_API_URL from "../config/url";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Home/Navbar";

const toastStyles = {
	display: "flex",
	alignItems: "center",
	fontSize: "1.125rem",
	fontWeight: "600",
	backgroundColor: "#181818",
	color: "#fff",
};

const toastOptions = {
	className: "toast-content",
};
const AddFeed = () => {
	const [url, setUrl] = useState("");

	const [category, setCategory] = useState("");

	const [feedData, setFeedData] = useState({});

	const [isLoading, setIsLoading] = useState(false);

	const [userData, setUserData] = useState("");

	const isObjectEmpty = Object.keys(feedData).length === 0;

	const { user, token } = useContext(UserContext);

	const navigate = useNavigate();

	useEffect(() => {
		Axios.post(`${NODE_API_URL}/auth/getUser`, {
			_id: user._id,
		})
			.then(res => {
				console.log(res.data.data, "Data");
				setUserData(res.data.data);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	const handleCategoryChange = e => {
		console.log(e.target.value, "target");
		setFeedData({});
		setCategory(e.target.value);
	};

	const handleUrlChange = e => {
		console.log(e.target.value, "url");
		setFeedData({});
		setUrl(e.target.value);
	};

	const handleSubmit = e => {
		setIsLoading(true);
		e.preventDefault();

		Axios.post(`${NODE_API_URL}/category/findFeed`, {
			url,
		})
			.then(res => {
				const resData = res.data.data;
				console.log(resData, "find feed data");
				setFeedData(resData);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
				toast.error(err.message, {
					style: toastStyles,
				});
			});
	};

	const addFeed = e => {
		e.preventDefault();
		toast.loading("Adding...", {
			id: "add",
			style: toastStyles,
		});

		console.log({
			categoryName: category,
			name: feedData.title,
			url: feedData.url,
			channelId: feedData.channelId,
		});

		Axios.post(
			`${NODE_API_URL}/category/addChannels`,
			{
				categoryName: category,
				name: feedData.title,
				url: feedData.url,
				channelId: feedData.channelId,
			},
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		)
			.then(res => {
				console.log(res.data.data.categories, " lol", feedData.name);

				const sameFeedExists = res.data.data.categories.some(
					feed => feed.name === feedData.name
				);
				console.log(sameFeedExists, "same");

				if (sameFeedExists) {
					toast.remove("add");
					toast("Feed Already Exists", {
						style: toastStyles,
					});
				} else {
					toast.remove("add");
				}
				navigate(`/feed/${category}`);
			})
			.catch(err => {
				console.log(err.response);
				toast.remove("add");
				toast.error("Something went wrong", {
					style: toastStyles,
				});
			});
	};

	return (
		<>
		<Navbar />
		<div className="add">
			<h2 className="add__heading" style={{marginTop:"30px"}}>Add a Feed</h2>
			<form className="add__form" onSubmit={handleSubmit}>
				<label htmlFor="url" className="add__label">
					Please enter a URL
				</label>
				<input
					type="url"
					placeholder="https://example.com"
					className="add__input"
					id="url"
					name="url"
					required
					value={url}
					onChange={e => handleUrlChange(e)}
				/>
				<label htmlFor="categories" className="add__label">
					Select a category
				</label>

				<select
					name="category"
					id="categories"
					className="add__select"
					value={category.name}
					onChange={e => handleCategoryChange(e)}
				>
					{userData
						? userData.categories.map(category => {
								return (
									<option value={category.name}>
										{category.name}
									</option>
								);
						  })
						: ""}
				</select>
				{isObjectEmpty && (
					<button className="add__btn">
						{isLoading ? (
							<div className="spinner"></div>
						) : (
							"Continue"
						)}
					</button>
				)}
			</form>

			{!isObjectEmpty && (
				<div tabindex="0" className="add__feed">
					<div className="add__feed--title-container">
						{feedData.favicon ? (
							<img
							src={feedData.favicon}
							width="25"
								height="25"
								alt="icon"
								className="add__feed-icon"
							/>
						) : (
							<div className="add__feed-image add__default-img">
								{feedData.title.split("")[0]}
							</div>
						)}

						<h2 className="add__feed-title">{feedData.title}</h2>
					</div>
					<a
						href={feedData.url || url}
						target="_blank"
						rel="noreferrer noopener"
						className="add__feed-url"
					>
						{feedData.url || url}
					</a>

					<button className="add__btn" onClick={addFeed}>
						Add
					</button>
				</div>
			)}
			<Toaster toastOptions={toastOptions} position="bottom-center" />
		</div>
	</>
	);
};

export default AddFeed;
