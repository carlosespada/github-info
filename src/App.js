import React, { Component } from 'react';
import { getRepos, getUserData } from './api/github-api.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    	isDisabledSearch: true,
    	isError: false,
    	isLoading: false,
    	isSearchComplete: false,
      name: '',
      orgs: [],
      repos: [],
      user: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({name: event.target.value});
    if (event.target.value !== '') {
			this.setState({isDisabledSearch: false});
		} else {
			this.setState({isDisabledSearch: true});
		}
  }

  async handleSubmit(event) {
    event.preventDefault();
    let responseRepos;
    let responseUserData;
    this.setState({isError: false});
    this.setState({isLoading: true});
    this.setState({isSearchComplete: false});
    try {
    	responseRepos = await getRepos(this.state.name);
   		this.setState({repos: responseRepos});
   		
   		responseUserData = await getUserData(this.state.name);
	   	this.setState({orgs: responseUserData.orgs});
	   	this.setState({user: responseUserData.user});

	  	this.setState({isSearchComplete: true});
   	} catch {
   		this.setState({isError: true});
   	}
   	this.setState({isLoading: false});
  }

  render() {
  	const { isDisabledSearch, isError, isLoading, isSearchComplete, name, orgs, repos, user } = this.state;
    return (
      <div className="app">
        <main className="app-main">
          <form className="app-form" onSubmit={this.handleSubmit}>
						<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
							<input className="mdl-textfield__input" type="text" id="input-name" value={name} onChange={this.handleChange} />
							<label className="mdl-textfield__label" htmlFor="input-name">Github user name</label>
						</div>
						<div>
            	<button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" type="submit" disabled={isDisabledSearch || isLoading}>Submit</button>
            </div>
          </form>
          {isLoading ? (
          <div class="sk-circle">
						<div class="sk-circle1 sk-child"></div>
						<div class="sk-circle2 sk-child"></div>
						<div class="sk-circle3 sk-child"></div>
						<div class="sk-circle4 sk-child"></div>
						<div class="sk-circle5 sk-child"></div>
						<div class="sk-circle6 sk-child"></div>
						<div class="sk-circle7 sk-child"></div>
						<div class="sk-circle8 sk-child"></div>
						<div class="sk-circle9 sk-child"></div>
						<div class="sk-circle10 sk-child"></div>
						<div class="sk-circle11 sk-child"></div>
						<div class="sk-circle12 sk-child"></div>
					</div>
          ) : isError ? (
          <p className="app-not-found">We haven't found any info about this user.<br />Please modify your search and try again.</p>
          ) : isSearchComplete ? (
          <div className="app-user">
	          <h1>{user.login}</h1>
	          <p className="app-user-location">{user.location}</p>
	          <h2>Repos</h2>
	          {repos.length > 0 ? (
	          <ul>
	        		{repos.map(repo => {
	        			return (
	        				<li key={repo.id}>
	        					<h3><a target="_blank" rel="noopener noreferrer" title="Go to repo" href={repo.svn_url}>{repo.name}</a></h3>
	        					{repo.language ? (
	        					<span className="mdl-chip">
											<span className="mdl-chip__text">{repo.language}</span>
										</span>
										):null}
	        					<p>{repo.description}</p>
	        				</li>
	        			)
	        		})}
	      		</ul>
	      		) : (
	      		<p>This user hasn't any repository in Github</p>
	      		)}
	      		<h2>Organisations</h2>
	      		{orgs.length > 0 ? (
	          <ul>
	        		{orgs.map(org => {
	        			return (
	        				<li key={org.id}>
	        					<h3>{org.login}</h3>
	        					<p>{org.description}</p>
	        				</li>
	        			)
	        		})}
	      		</ul>
	      		) : (
	      		<p>This user hasn't any organisation in Github</p>
	      		)}
	      	</div>
      		): null}
        </main>
      </div>
    );
  }
}

export default App;
