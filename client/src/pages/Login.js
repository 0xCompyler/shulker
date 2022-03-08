import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NODE_API_URL from "../config/url";
import UserContext from "../context/UserContext";
import { auth } from "../services/firebase";
import { googleProvider } from "../services/firebase";
import { animated, useSpring } from "@react-spring/web";
import Navbar from "../pages/Home/Navbar";

export default function Login() {
	const { login } = useContext(UserContext);

	const [isHovered, setIsHovered] = React.useState(false);

	const springConfig = {
		mass: 0.5,
		tension: 180,
		friction: 12,
		precision: 0.001,
		velocity: 0.024,
	};

	const style = useSpring({
		transform: isHovered
			? `translateY(-5px) scale(1.05)`
			: `translateY(0px) scale(1)`,
		config: springConfig,
	});

	const navigate = useNavigate();

	const { token } = useContext(UserContext);

	useEffect(() => {
		if (token) {
			navigate("/categories");
		}
	}, []);

	const signInWithGoogle = () => {
		auth.signInWithPopup(googleProvider)
			.then(res => {
				Axios.post(`${NODE_API_URL}/auth/signup`, {
					_id: res.user.uid,
					name: res.user.displayName,
					email: res.user.email,
					photo: res.user.photoURL,
				})
					.then(res => {
						console.log(res.data);
						localStorage.setItem(
							"user",
							JSON.stringify(res.data.data.user)
						);
						localStorage.setItem("token", res.data.data.token);

						const { token, user } = res.data.data;

						login({
							token,
							user,
						});

						navigate("/categories");
					})
					.catch(err => {
						//Todo instead add Toast
						// if (Array.isArray(err.response.data.error)) {
						//     setErrors(err.response.data.error);
						// } else {
						//     setErrors([{ msg: err.response.data.error }]);
						// }
						console.log(err);
					});
			})
			.catch(error => {
				console.log(error.message);
			});
	};
	return (
		<>
			<Navbar />
			<div className="grid min-h-screen place-items-center">
				<animated.button
					onMouseEnter={() => {
						setIsHovered(true);
					}}
					onMouseLeave={() => {
						setIsHovered(false);
					}}
					style={style}
					className="border-1 flex items-center space-x-5 divide-x-2 rounded-md border-gray-400 bg-white px-6 text-gray-600 shadow-md hover:shadow-lg"
					onClick={signInWithGoogle}
				>
					<svg
						className="inline-block h-8 w-8"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
					</svg>
					<span className="py-6 pl-6 text-2xl font-medium leading-4">
						{" "}
						Continue with Google
					</span>
				</animated.button>
			</div>
		</>
	);
}
