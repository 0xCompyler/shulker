import _ from "lodash";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import YTSearch from "youtube-api-search";
import SearchBar from "./components/SearchBar";
import VideoList from "./components/video_list";
import VideoPlayer from "./components/VideoPlayer";
import "./styles/index.css";
import "./styles/styles.css";
import API_KEY from "./config/creds";
import AddFeed from "./pages/AddFeed";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryFeeds from "./pages/CategoryFeeds";
import FeedList from "./pages/FeedList";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import UserProvider from "./context/UserProvider";
import Home from "./pages/Home/Home.jsx";
import PrivateRoute from "./utils/PrivateRoute";
import AddCategory from "./pages/AddCategory";
import VideoPage from "./pages/VideoPage";
import TranscriptTest from "./pages/TranscriptTest";

const App = () => {
	const [videos, setVideos] = useState([]);

	const videoSearch = term => {
		YTSearch({ key: API_KEY, term: term }, videos => {
			setVideos(videos);
			console.log(videos);
		});
	};

	const videoSearchDebounce = _.debounce(term => {
		videoSearch(term);
	}, 300);

	return (
		<UserProvider>
			<Router>
				<Routes>
					<Route
						path="/feed/:categoryFeed"
						exact
						element={
							<PrivateRoute>
								<CategoryFeeds />
							</PrivateRoute>
						}
					/>

					<Route
						path="/categories"
						exact
						element={
							<PrivateRoute>
								<Categories />
							</PrivateRoute>
						}
					/>

					<Route
						path="/feed"
						exact
						element={
							<PrivateRoute>
								<AddFeed />
							</PrivateRoute>
						}
					/>

					<Route
						path="/feed/:categoryFeed/:feedId"
						exact
						element={
							<PrivateRoute>
								<FeedList />
							</PrivateRoute>
						}
					/>

					<Route
						path="/addCategory"
						exact
						element={
							<PrivateRoute>
								<AddCategory />
							</PrivateRoute>
						}
					/>

					<Route
						path="/youtube/:youtubeLink"
						exact
						element={
							<PrivateRoute>
								<VideoPage />
							</PrivateRoute>
						}
					/>

					<Route
						path="/transcripttest"
						exact
						element={
							<TranscriptTest />
						}
					/>
					

					<Route path="/login" exact element={<Login />} />

					<Route path="/" exact element={<Home />} />
				</Routes>
			</Router>
		</UserProvider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
