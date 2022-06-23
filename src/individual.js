import React from "react";
import ReactDOM from "react-dom";
// import axios from "axios";
import PlanList from './PlanList';
// import "./ha.css";

// clean-up @ https://prettier.io/

class App extends React.Component {
	render() {
		return (
			<div><PlanList market="I" exchange="D" /></div>
		); // end return
	} // end render()
}

ReactDOM.render(<App />, document.getElementById("plans"));