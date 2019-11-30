import React, { Component } from 'react';

import '../css/login.css';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          gender: '',
          jobRole: '',
          department: '',
          address: '',
          redirect: false,
          message: '',
          error: '',
          token: localStorage.token,
          unauthorized: '',
          isLoggedIn: false,
        };
      this.handleFirstName = this.handleFirstName.bind(this);
      this.handleLastName = this.handleLastName.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.handleGender = this.handleGender.bind(this);
      this.handleJobRole = this.handleJobRole.bind(this);
      this.handleDepartment = this.handleDepartment.bind(this);
      this.handleAddress = this.handleAddress.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      // if(this.state.token !== '' || this.state.token.length > 50) return window.location = '/feed';
    }

    handleFirstName (event) {
        this.setState({firstName: event.target.value});
    }

    handleLastName (event) {
        this.setState({lastName: event.target.value});
    }

    handleEmailChange (event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange (event) {
        this.setState({password: event.target.value});
    }

    handleGender (event) {
        this.setState({gender: event.target.value});
    }

    handleJobRole (event) {
        this.setState({jobRole: event.target.value});
    }

    handleDepartment (event) {
        this.setState({department: event.target.value});
    }

    handleAddress (event) {
        this.setState({address: event.target.value});
    }

    handleSubmit(event) {
      event.preventDefault();
      fetch('https://t-w-app.herokuapp.com//api/v1/auth/create-user', {
        method: "POST",
        body : JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
          gender: this.state.gender,
          jobRole: this.state.jobRole,
          department: this.state.department,
          address: this.state.address,
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + this.state.token,
        },
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((response) => {
          if(response.status === 'success') {
            this.setState({ token: response.data.token });
            this.setState({token: response.data.token});
            this.setState({unauthorized: false});
          }
          console.log('response:', response);
          this.setState({ 
            message: response.message,
            error: response.error,
          })
        })
        .catch((err) => {
          console.log('error:', err);
        });

    }

    // componentDidMount() {
    //     this.callAPI();
    // }

    render() {
        return (
            <div className="App">
              <h1 className="App-title">Teamwork app - Add a user account below</h1>
              <div className = 'share-screen'>
                <form className = "login-form signup-form" onSubmit={this.handleSubmit}>
                  <p className = "msg">{ this.state.message }</p>
                  <p className = "msg">{ this.state.error }</p>
                  <input type = "text" className = "inputfield signup-input" placeholder = "First Name" name = "firstName" value={this.state.firstName} onChange={this.handleFirstName}/>
                  <input type = "text" className = "inputfield signup-input" placeholder = "Last Name" name = "lastName" value={this.state.lastName} onChange={this.handleLastName}/>
                  <input type = "text" className = "inputfield signup-input" placeholder = "Email" name = "email" value={this.state.email} onChange={this.handleEmailChange}/>
                  <input type = "password" className = "inputfield signup-input" placeholder = "Password" name = "password" value={this.state.password} onChange={this.handlePasswordChange}/>
                  <input type = "text" className = "inputfield signup-input" placeholder = "Gender" name = "gender" value={this.state.gender} onChange={this.handleGender}/>
                  <input type = "text" className = "inputfield signup-input" placeholder = "Job Role" name = "jobRole" value={this.state.jobRole} onChange={this.handleJobRole}/>
                  <input type = "text" className = "inputfield signup-input" placeholder = "Department" name = "department" value={this.state.department} onChange={this.handleDepartment}/>
                  <input type = "text" className = "inputfield signup-input" placeholder = "Address" name = "address" value={this.state.address} onChange={this.handleAddress}/>
                  <button className = "submit-btn">Create user</button>
                </form>
              </div>
            </div>
        );
    }
};

export default Signup;
