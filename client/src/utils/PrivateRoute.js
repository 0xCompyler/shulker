import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const PrivateRoute = ({ children }) => {
	const { token } = useContext(UserContext);
	return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
