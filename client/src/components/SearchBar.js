import React, { useState } from "react";

const SearchBar = props => {
	const [term, setTerm] = useState("hello");

	const onInputChange = term => {
		setTerm(term);
		props.onSearchTermChange(term);
	};

	return (
		<div className="search-bar">
			<input value={term} onChange={e => onInputChange(e.target.value)} />
		</div>
	);
};

export default SearchBar;
