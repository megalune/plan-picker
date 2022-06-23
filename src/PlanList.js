import React from "react";
// import ReactDOM from "react-dom";
import axios from "axios";

class PlanList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			serviceIds: localStorage.getItem('serviceareaids'),
			//year: localStorage.getItem('serviceyear'),
			year: 2022,
			metal: "",
			market: this.props.market,
			exchange: this.props.exchange,
			planType: "",
			pageNumber: 1,
			pageSize: 250,
			error: false,
			isLoaded: false,
			items: [],
			itemCount: null
		};


		// determine the environment
		if (window.location.href.indexOf("//dev") > -1) {
		  this.state.api_domain = "dev-api";
		} else if (window.location.href.indexOf("//qa") > -1 || window.location.href.indexOf("localhost") > -1) {
		  this.state.api_domain = "qa-api";
		} else if (window.location.href.indexOf("//uat") > -1) {
		  this.state.api_domain = "uat-api";
		} else {
		  this.state.api_domain = "prod-api";
		}
		// this.state.api_domain = "prod-api";

	} // end constructor(props)


	componentDidMount() {
		console.log("componentDidMount");
		this.getPlansData();
		// window.addEventListener("location_set", this.updateLocation);
		// catch on document...
		// document.addEventListener("location_set", function(event) {
		//     console.log("event location_set planlist.js");
		//     this.updateLocation();
		// });
		// alert(timvar);
		document.addEventListener("location_set", this.updateLocation);
	}

	updateLocation = () => {
		console.log("updateLocation called");
		
		this.setState({
			serviceIds: localStorage.getItem('serviceareaids'),
			isLoaded: false,
			items: [],
			error: false,
			itemCount: null
		});

		this.getPlansData();
	}

	// componentDidUpdate() {
	// 	console.log('componentDidUpdate'); // returns previous value for some reason
	// 	// this.getPlansData();
	// }

	getPlansData() {

		// WAS002 hack
		if(this.state.year == 2021 && this.state.market == "S" && this.state.serviceIds == "WAS002"){
			this.state.serviceIds = "WAS001";
		} else if (this.state.year == 2022 && this.state.market == "S" && this.state.serviceIds == "WAS001"){
			this.state.serviceIds = "WAS002";
		}
		console.log(this.state);
		// end WAS002 hack


		let apiurl =
			"https://"+this.state.api_domain+".healthalliance.org/plans/search/byserviceid?serviceIds=" +
			this.state.serviceIds +
			"&year=" +
			this.state.year;
		if (this.state.metal !== "") {
			apiurl += "&metal=" + this.state.metal;
		}
		if (this.state.market !== "") {
			apiurl += "&market=" + this.state.market;
		}
		if (this.state.exchange !== "") {
			apiurl += "&exchange=" + this.state.exchange;
		}
		if (this.state.planType !== "") {
			apiurl += "&planType=" + this.state.planType;
		}
		if (this.state.pageNumber !== "") {
			apiurl += "&pageNumber=" + this.state.pageNumber;
		}
		if (this.state.pageSize !== "") {
			apiurl += "&pageSize=" + this.state.pageSize;
		}
		
		console.log(apiurl);
		// console.log(this.props.history);
		// browserHistory.push('/search/{this.state.metal}/some-action')
		
		axios.get(apiurl).then(
			res => {
				const result = res.data;
				// console.log(result);
				this.setState({
					isLoaded: true,
					error: false,
					items: result.results,
					itemCount: result.results.length
				});
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			error => {
				this.setState({
					isLoaded: true,
					items: [],
					error: true,
					itemCount: null
				});
			}
		);
		// this.forceUpdate();
	} // end componentDidMount()

	updatePlanFilter = event => {
		this.setState({isLoaded: false, items: [], error: false});
		let nam = event.target.name;
		let val = event.target.value;
		this.setState({[nam]: val}, this.getPlansData);
	}; // end updatePlanFilter






	getEnrollLink(m, e, s) {
		let link = null;
		if (m === "Small Group") {
			link = (
				<button
					title="Get a Quote"
					data-open="wufoo-q1uh28gp0dg3brn"
					aria-controls="wufoo-q1uh28gp0dg3brn"
					aria-haspopup="true"
					className="button expanded small hide">
					Request a Quote
				</button>
			);
		} else if (m === "Individual") {
			if (e === "Direct") {
				if (s === "IL") {
					link = (
						<a
							href="https://haportal.tuoadvantage.com/Individual/Quoting/QuotingEntry/QuotingEntry"
							className="button expanded small">
							Shop or Enroll
						</a>
					);
				} else if (s === "WA") {
					link = (
						<a href="/individual/enroll" className="button expanded small">
							Shop or Enroll
						</a>
					);
				}
			} else if (e === "Public") {
				link = (
					<a
						href="https://www.healthcare.gov/see-plans/"
						className="button expanded small">
						Shop or Enroll
					</a>
				);
			}
		}
		return link;
	} // end getEnrollLink



	render() {
		const {error, isLoaded, items} = this.state;

		// is individual?
		let isIndividual;
		if (this.state.market === "I") {
			isIndividual = true;
		} else {
			isIndividual = false;
		}

		return (
			<div className="grid-x grid-margin-x">
				<div className="small-12 medium-3 cell">
					<p className="text-size-l text-weight-demi">Filter</p>

					<form id="docFilter">

						{/* only show during OEP */}
						<p>
							<label htmlFor="year">Plan Year</label>
							<select
								value={this.state.year}
								id="year"
								name="year"
								onChange={this.updatePlanFilter}>
								<option value="2022">2022</option>
								<option value="2021">2021</option>
							</select>
						</p>
						

						{/* dev testing
						<p>
							<label htmlFor="serviceIds">serviceIds</label>
							<select
								value={this.state.serviceIds}
								id="serviceIds"
								name="serviceIds"
								onChange={this.updatePlanFilter}>
								<option value="ILS001" className="ha-show-for-ILS001">ILS001</option>
								<option value="ILS002" className="ha-show-for-ILS002">ILS002</option>
								<option value="ILS003" className="ha-show-for-ILS003">ILS003</option>
							</select>
						</p>
						<p>
							<input
								value={this.state.year}
								id="year"
								name="year"
								onChange={this.updatePlanFilter}>
							</input>
							<input
								value={this.state.serviceIds}
								id="serviceIds"
								name="serviceIds"
								onChange={this.updatePlanFilter}>
							</input>
						</p>
						*/}
						

						<p>
							<label htmlFor="planType">Plan Type</label>
							<select
								value={this.state.planType}
								id="planType"
								name="planType"
								onChange={this.updatePlanFilter}>
								<option value="">All Plan Types</option>
								<option value="C">HMO</option>
								<option value="B">POS</option>
								<option value="0">POSC</option>
								<option value="P">PPO</option>
							</select>
						</p>

						<p>
							<label htmlFor="metal">Cost Level</label>
							<select
								value={this.state.metal}
								id="metal"
								name="metal"
								onChange={this.updatePlanFilter}>
								<option value="">All Metal Levels</option>
								<option value="P">Platinum (90% of costs covered)</option>
								<option value="G">Gold (80% of costs covered)</option>
								<option value="S">Silver (70% of costs covered)</option>
								<option value="B">Bronze (60% of costs covered)</option>
								<option value="C">Catastrophic</option>
							</select>
						</p>
					</form>

					{/*
					<p className="text-size-l text-weight-demi">Learn More</p>
					<ul>
						<li>
							<a href="/plan-types">How Do I Choose a Plan?</a>
						</li>
						{isIndividual ? <li>
							<a href="/individual/enroll">How and When Can I Enroll?</a>
						</li> : null}
						<li>
							<a href="/documents/1293">
								Glossary of Health Coverage and Medical Terms
							</a>
						</li>
					</ul>
					*/}

					<p className="text-size-l text-weight-demi">Documents</p>
					<p>
						<a href="/plan-support-materials">Plan Support Materials</a>
					</p>
					<p>
						<a href="/plan-policies">Plan Policies</a>
					</p>
				</div>

				<div className="small-12 medium-9 cell">

					{this.state.isLoaded === false ? <><p className="text-center"><img src="/images/loading.gif" alt="" /><br /><strong>Loading Plans...</strong></p></> : null}

					{this.state.error === true ? <><p>{this.state.error}</p></> : null}

					{/* {this.state.itemCount != null ? <><p>{this.state.itemCount} plans available. These plans are effective January 1, {this.state.year} - December 31, {this.state.year}.</p></> : null} */}

					{items.map((item, index) => (
						<div
							className={
								item.METAL +
								" plan-card callout border-top shadow triple-" +
								item.TRIPLE
							}
							key={index}>
									<h4 className="plan-name">
										{item.NAME}{" "}
										{/*<small>
											({item.MARKET}, Direct from Us)
										</small>*/}
									</h4>
							<div className="grid-x grid-margin-x">
								<div className="small-12 medium-3 cell">
									<table>
										<thead>
											<tr>
												<th>Documents</th>
											</tr>
										</thead>
										<tbody>
											<tr className="line-above">
												<td className="table-text">{this.getEnrollLink(item.MARKET, item.EXCHANGE, item.STATE)}</td>
											</tr>
											<tr>
												<td className="table-text"><a href={"/Guests/Document/SBC?hiosId=" + item.HIOS + "&year=" + this.state.year}>
										Plan Highlights
									</a></td>
											</tr>
											<tr>
												<td className="table-text"><a href={"/Guests/Document/DOC?hiosId=" + item.HIOS + "&year=" + this.state.year}>
										Description of Coverage
									</a></td>
											</tr>
											<tr>
												<td className="table-text"><a
										href={
											"/Guests/ProviderSearch?DirectoryName=" + item.ENTITY_CODE
										}>
										View Providers
									</a></td>
											</tr>
										</tbody>
									</table>
								</div>
								<div className="small-12 medium-9 cell">
									<table>
										<thead>
											<tr>
												<td className="table-text"></td>
												<th className="tier1">Preferred Network</th>
												<th className="tier2">In Network</th>
												<th className="tier3">Out of Network</th>
											</tr>
										</thead>
										<tbody>
											<tr className="line-above">
												<td className="table-text">Individual Deductible</td>
												<td className="tier1">{item.DED_IND_TIER1}</td>
												<td className="tier2">{item.DED_IND_IN_NET}</td>
												<td className="tier3">{item.DED_IND_OUT_NET}</td>
											</tr>
											<tr>
												<td className="table-text">Family Deductible</td>
												<td className="tier1">{item.DED_FAM_TIER1}</td>
												<td className="tier2">{item.DED_FAM_IN_NET}</td>
												<td className="tier3">{item.DED_FAM_OUT_NET}</td>
											</tr>

											<tr>
												<td className="table-text">
													Individual Out-of-Pocket Max
												</td>
												<td className="tier1">{item.OOP_MAX_MED_IND_TIER1}</td>
												<td className="tier2">{item.OOP_MAX_MED_IND_IN_NET}</td>
												<td className="tier3">
													{item.OOP_MAX_MED_IND_OUT_NET}
												</td>
											</tr>
											<tr>
												<td className="table-text">Family Out-of-Pocket Max</td>
												<td className="tier1">{item.OOP_MAX_MED_FAM_TIER1}</td>
												<td className="tier2">{item.OOP_MAX_MED_FAM_IN_NET}</td>
												<td className="tier3">
													{item.OOP_MAX_MED_FAM_OUT_NET}
												</td>
											</tr>

											{isIndividual ? <><tr className="line-above">
												<td className="table-text">
													Individual Pharmacy Deductible
												</td>
												<td className="tier1">{item.DED_PHARM_IND_TIER1}</td>
												<td className="tier2">{item.DED_PHARM_IND_IN_NET}</td>
												<td className="tier3">{item.DED_PHARM_IND_OUT_NET}</td>
											</tr>
											<tr>
												<td className="table-text">
													Family Pharmacy Deductible
												</td>
												<td className="tier1">{item.DED_PHARM_FAM_TIER1}</td>
												<td className="tier2">{item.DED_PHARM_FAM_IN_NET}</td>
												<td className="tier3">{item.DED_PHARM_FAM_OUT_NET}</td>
											</tr></> : null}

										</tbody>
									</table>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		); // end return
	} // end render()
}

export default PlanList;