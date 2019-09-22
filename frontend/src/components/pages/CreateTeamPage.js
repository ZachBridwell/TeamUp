import React from 'react';
import '../../App.css';
import {Redirect} from 'react-router-dom';


class CreateTeamPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamName: '',
            teamMembers: '',
            owner: '', 
            info: '', 
            requestedSkills: '', 
            numMembers: '', 
            open: false, 
            course: '', 
            maxMembers: '',
            errors: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };
    /*TODO: need to get token and set logged in email to owner*/
    handleSubmit(event) {
        event.preventDefault();
        fetch('/startteam', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamName: this.state.teamName,
                teamMembers: this.state.teamMembers,
                owner: this.state.owner, 
                info: this.state.info, 
                requestedSkills: this.state.requestedSkills, 
                numMembers: this.state.numMembers, 
                open: true, 
                course: this.state.course, 
                maxMembers: this.state.maxMembers
            })
          }).then(response => response.ok).then(success => (success ? alert("Team successfully created") : alert("Failed to create team")))
    }
    render(){
        if(!window.localStorage.getItem('token')) {
            return <Redirect to="/login/"/>
        }
        return(
            <div>
                <div className="container">
                    <h1>Create New Team</h1>
                    <form onSubmit={this.handleSubmit}>
                    <div><label>
                        <input type="text" placeholder="Team Name" className="textbox" onChange={this.handleChange} name="teamName" id="teamName" value={this.state.teamName} /> 
                    </label></div>
                    <div><label>
                        <input type="text" placeholder="Course" className="textbox" onChange={this.handleChange} name="course" id="course" value={this.state.course} /> 
                    </label></div>
                    <div><label>
                        <input type="text" placeholder="Existing Team Members" className="textbox" onChange={this.handleChange} name="teamMembers" id="teamMembers" value={this.state.teamMembers} /> 
                    </label></div>
                    <div><label>
                        <input type="text" placeholder="Owner" className="textbox" onChange={this.handleChange} name="owner" id="owner" value={this.state.owner} /> 
                    </label></div>
                    <div><label>
                        <input type="text" placeholder="Project Overview" className="textboxbig" onChange={this.handleChange} name="info" id="info" value={this.state.info} /> 
                    </label></div>
                    <div><label>
                        <input type="text" placeholder="Prefered Skills" className="textboxbig" onChange={this.handleChange} name="requestedSkills" id="requestedSkills" value={this.state.requestedSkills} /> 
                    </label></div>
                   
                    <div><label>
                        Current Number of Members
                        <select value={this.state.numMembers} onChange={this.handleChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </label></div>
                    <div><label>
                        Max Number of Members
                        <select value={this.state.maxMembers} onChange={this.handleChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </label></div>
                    <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }

}
export default CreateTeamPage;