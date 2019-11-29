import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

const withAuth = (ComponentToProtect) => {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
       fetch('http://localhost:3000/login', {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            this.setState({ loading: false });
            console.log(res);
          } else {
            console.log('Error logging in!');
            console.log(res);
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        window.location = "/login";
        return <Redirect to="/login" />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  }
};

export default withAuth;
