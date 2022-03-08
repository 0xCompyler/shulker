import React from "react";
import VideoListItem from "./video_list_item";
import data from "../seedData";

const VideoList = props => {
	// const data = JSON.parse(see)
	const videoItems = data.items.map(video => {
		return <VideoListItem key={video.etag} video={video} />;
	});

	return <ul className="col-md-4 list-group">{videoItems}</ul>;
};

export default VideoList;
