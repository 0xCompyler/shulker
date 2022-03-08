import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import Axios from "axios";
import UserContext from "../context/UserContext";
import NODE_API_URL from "../config/url";
import { useNavigate } from "react-router-dom";
import Navbar from "./Home/Navbar";

const toastStyles = {
	display: "flex",
	alignItems: "center",
	fontSize: "1.25rem",
	fontWeight: "600",
	backgroundColor: "#181818",
	color: "#fff",
};

const toastOptions = {
	className: "toast-content",
};

const AddCategory = () => {
	const [category, setCategory] = useState("");

	const { token } = useContext(UserContext);

	const navigate = useNavigate();

	const handleCategoryChange = e => {
		setCategory(e.target.value);
	};

	const addCategory = e => {
		e.preventDefault();
		toast.loading("Adding...", {
			id: "add",
			style: toastStyles,
		});

		Axios.post(
			`${NODE_API_URL}/category/addCategory`,
			{
				name: category,
			},
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		)
			.then(res => {
				console.log(res.data.data);
				toast.remove("add");
				navigate("/categories");
			})
			.catch(err => {
				console.log(err.response.data.message);
				toast.remove("add");
				toast(err.response.data.message);
			});
	};

	return (
	<>
		<Navbar />
		<div className="add">
			<h2 className="add__heading" style={{marginTop:"30px"}}>Add a Category</h2>
			<form className="add__form">
				<label htmlFor="url" className="add__label">
					Please enter a category
				</label>
				<input
					type="name"
					placeholder="Add category name"
					className="add__input"
					id="url"
					name="url"
					required
					value={category}
					onChange={e => handleCategoryChange(e)}
				/>
			</form>

			<button className="add__btn" onClick={addCategory}>
				Add
			</button>
			<Toaster toastOptions={toastOptions} position="bottom-center" />
		</div>
	</>
	);
};

export default AddCategory;
