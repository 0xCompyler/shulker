import Axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import parse from "rss-to-json";
import { Link, useParams } from "react-router-dom";
import NODE_API_URL from "../config/url";
import UserContext from "../context/UserContext";
import { Scrollbars } from "react-custom-scrollbars";
import {useNavigate} from "react-router-dom"
import Navbar from "../pages/Home/Navbar";

const FeedList = () => {
	const [feeds, setFeeds] = useState([]);
	const [channelName, setChannelName] = useState("");
	const { categoryFeed, feedId } = useParams();

	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		Axios.post(`${NODE_API_URL}/auth/getUser`, {
			_id: user._id,
		}).then(res => {
			const indexCategory = res.data.data.categories.findIndex(
				category => {
					return category.name === categoryFeed;
				}
			);

			const channelCategory = res.data.data.categories[
				indexCategory
			].channels.findIndex(channel => {
				return channel._id === feedId;
			});

			setChannelName(
				res.data.data.categories[indexCategory].channels[
					channelCategory
				].name
			);

			const videoUrl =
				res.data.data.categories[indexCategory].channels[
					channelCategory
				].url;

			parse(
				`https://cors-anywhere.herokuapp.com/https://www.youtube.com/feeds/videos.xml?channel_id=${res.data.data.categories[indexCategory].channels[channelCategory].channelId}`
			)
				.then(feed => {
					setFeeds(
						JSON.parse(JSON.stringify(feed.items.splice(0, 10)))
					);
				})
				.catch(err => {
					console.log(err);
				});
		});
	}, []);

	console.log(feeds,feeds.length,"feed");

	return (
		<>
			{/* <Navbar /> */}
			<div class="feed-row">
				<h1 className="title">
					<span>Feed for </span>
					<Link to={`/feed/${categoryFeed}`}>{categoryFeed} </Link>
					{channelName.length !== 0 && `/ ${channelName}`}
				</h1>
				{feeds.map((feed, i) => {
					console.log(i,"i");
					return (
						<div class="sub-container-feed">
							<img src={feed.enclosures[0]} onClick={() => {
								navigate("/youtube/"+
								feed.link.substring(32, feed.link.length));							
							}}/>

							<div class="feed-card-yt">
								<Scrollbars autoHide>
									<h1 class="feed-yt-title">
										{feed ? feed.title : ""}
									</h1>
									<p class="feed-yt-desc">
										{feed ? feed.description : ""}
									</p>
								</Scrollbars>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};
export default FeedList;
