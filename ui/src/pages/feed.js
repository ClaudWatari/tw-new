import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import '../css/feed.css';

// const checkToken = () => {
//   if(localStorage.getItem('token') === '') return window.location = '/login';
// };
// checkToken();

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
          headers: '',
          message: '',
          token: localStorage.token,
          feed: [],
          itemComment: '',
          loggedUser: '',
          articleid: [],
          gifid: [],
        };
        this.items = '';

      if(this.state.token === '' || !this.state.token || this.state.token.length < 50) return window.location = '/login';
      
      fetch('http://localhost:4000/api/v1/feed', {
      	headers: {
      	  "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + this.state.token,
      	}
      })
      .then((res) => res.json())
      .then((response) => {
        if(response.success !== true) return window.location = '/login';
        // console.log(response.data.feed) 
      	this.setState({ headers: {"Authorization": "Bearer " + this.state.token,} })
      	this.setState({ message: response.message })
      	// console.log(this.state.feed);
        const imagePath = 'https://res.cloudinary.com/dzdqe8iow/image/upload/v1573523580/';
        
        this.setState({loggedUser: localStorage.username})
        this.setState({ feed: response.data.feed.map((item, key) => { return item.imageurl.split('.')[1] === 'gif' ? <section><img key = {item.gifid} src = {imagePath + item.imageurl.split('/screenshots/')[1]} alt = {item.title} /><Link to = {`./gifs/${item.gifid}`} className = "article-link-to">View Full</Link><button className = "article-link-to gif-commenter">Add comment</button></section> : <article key = {item.gifid} id = {item.gifid}> {item.imageurl} <form className = "comment-section" onSubmit = {this.postComment} id = {item.gifid}><textarea className = "commenter" placeholder = "Comment" onChange = {this.handleComment} required></textarea><button className = "comment-btn">Ok</button></form><Link to = {`./articles/${item.gifid}`} className = "article-link-to">View Full</Link></article> }) })
        this.setState({ articleid: this.state.feed.map((item, key) => { return item.props.children === undefined ? 0 : item.key }) })
      })
      .catch((error) => {
        console.log(error);
      })

      this.handleComment = (event) => {
        this.setState({itemComment: event.target.value})
      }

      this.postComment = (event) => {
        event.preventDefault();
        console.log(event.target.id);
        fetch(`https://t-w-app.herokuapp.com//api/v1/articles/${event.target.id}/comments`, {
          method: "POST",
          body : JSON.stringify({ comment: this.state.itemComment, articleid: event.target.id, loggedUser: this.state.loggedUser }),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + this.state.token,
          },
          credentials: 'include',
      })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        throw error;
      })
      }
    }

    render() {
        return (
            <div className="App">
              <header className = 'header'>
                <h1 className="App-title_">Logged in as <span className = 'username-span'> {this.state.loggedUser} </span></h1>
                <Link to = {'./signup'}>
                  <button className = "nav-link_" variant = "raised">
                    Create new user account
                  </button>
                </Link>
              </header>
              <div className = "feed-section">
                { this.state.feed }
              </div>
            </div>
        );
    }
}

export default Feed;
