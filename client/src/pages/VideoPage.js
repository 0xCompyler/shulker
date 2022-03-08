import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";
import { useRef } from "react";
import "../styles/plyr.css";
import { Scrollbars } from "react-custom-scrollbars";
import Graph from "../components/Graph";
import  Axios  from "axios";
import AI_URL from "../config/aiurl";


const Para = ({ children, ...props }) => {
	const highlight = props.highlight || null;
	
	if (!highlight) {
		return (
			<p className="mb-4 text-xl text-gray-300" {...props}>
				{children}
			</p>
		);
	}

	const [start, ...end] = children.split(highlight);

	return (
		<p className="mb-4 text-xl text-gray-300" {...props}>
			{start}
			<span className="rounded-md bg-green-800 box-decoration-clone p-1 text-green-100 outline outline-2 outline-green-300">
				{highlight.trim()}
			</span>
			{end.join(highlight)}
		</p>
	);
};

const Comments = () => {

	const [keywords,setKeywords] = useState(["great video","informative","loved it","fast"]);

	// useEffect(() => {

	// 	Axios.post(`${}`,{
	// 		"commentsurl": "lol"
	// 	})
	// 	.then((res) => {
	// 		setKeywords();
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	})		
	// },[])
	
	return (
		<Scrollbars>
			<div>
				<div className="flex py-4">
					<div className="flex h-fit flex-wrap gap-2 ">
						{keywords.map(item => (
							<span
								className="rounded-md border-2 border-yellow-600 bg-yellow-800 bg-opacity-25 box-decoration-clone p-1 px-2 font-bold text-yellow-50"
								key={item}
								>
								{item}
							</span>
						))}
					</div>
				</div>
			</div>
		</Scrollbars>
	);
};

const QuizSection = () => {
	
	// useEffect(() => {
	// 	//get quiz ques and ans
	// 	Axios.post(`${AI_URL}/`,{
	// 		"transcript": "lol"
	// 	})
	// 	.then((res) => {
	// 		setQuestionnaire();
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	})		
	// },[])

	const [questionnaire,setQuestionnaire] = useState([{
		"question":"what is bash"
	}]);
	
	return (
		<div className="mt-2 space-y-4">
			{questionnaire.map((item, index) => (
				<div
				key={item.question + item.answer}
					className="space-y-1 rounded-lg border-2 border-slate-600 bg-slate-600 bg-opacity-20 p-4 shadow-md"
				>
					<h3 className="text-2xl text-slate-200">{item.question}</h3>
					{/* <p className="w-fit cursor-pointer rounded-md bg-slate-600 px-3 pb-1 pt-[0.5rem] text-lg text-slate-100 hover:shadow-md">
						{item.answer}
					</p> */}
				</div>
			))}
		</div>
	);
};

const VideoPage = () => {

	const { youtubeLink } = useParams();
	
	const videoSrc = useMemo(
		() => ({
			type: "video",
			sources: [
				{
					src: youtubeLink,
					provider: "youtube",
				},
			],
		}),
		[]
	);

	useEffect(() => {
		//get transcript
		Axios.post(`${AI_URL}/transcribe/word_level`,{
			"youtube_url": `https://www.youtube.com/watch?v=${youtubeLink}`
		})
		.then((res) => {
			console.log(res);
			setText(res.data.turns[0].sentences);
		})
		.catch((err) => {
			console.log(err);
		})		
	},[])


	const [text,setText] = useState("");
	const [highlight, setHighlight] = useState("");
	const ref = useRef();

	// utility function for sampling random chunks of text at an interval
	const highlightRandomChunk = () => {
		const textArray = [...new Set(text.split(/[.!?;,] /g))];
		const chunk = textArray[Math.floor(Math.random() * textArray.length)];
		setHighlight(chunk);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			highlightRandomChunk();
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="mx-auto flex h-screen w-3/4 flex-col">
			<h1 className="p-4 pb-[0.25rem] pt-[1.75rem] text-4xl font-bold">
			</h1>
			<div className="grid h-[95%] w-full grid-flow-col-dense grid-cols-3 grid-rows-6 gap-4 p-4">
				<div className="col-span-2 row-span-4 overflow-hidden rounded-md">
					<Plyr ref={ref} source={videoSrc} />
				</div>
				<div className="col-span-1 row-span-2 flex flex-col rounded-md bg-zinc-800 p-6 pt-7">
					<h1 className="text-3xl font-bold">Keywords</h1>
					<Comments />
				</div>
				<div className="col-span-1 row-span-2 flex flex-col rounded-md bg-zinc-800 p-6 pt-7">
					<h1 className="text-3xl font-bold">Sentiment Analysis</h1>
					<Graph />
				</div>
				<div className="col-span-1 row-span-3 flex flex-col rounded-md bg-zinc-800 p-6 pt-7">
					<h1 className="mb-4 text-3xl font-bold">Transcript</h1>
					<Scrollbars autoHide>
						<Para>{text ? text : "Loading"}</Para>
					</Scrollbars>
				</div>
				<div className="col-span-1 row-span-3 flex flex-col rounded-md bg-zinc-800 p-6 pt-7">
					<h1 className="mb-4 text-3xl font-bold">Quiz</h1>
					<Scrollbars autoHide>
						<QuizSection />
					</Scrollbars>
				</div>
			</div>
		</section>
	);
};

export default VideoPage;
