import React, { Component } from 'react';
import SignUpForm from './signup/Signup.jsx';
import LogInForm from './login/Login.jsx';
import Posts from './posts/Posts.jsx';
import GroupSelect from './groupselect/Groupselect.jsx'
import MakePost from './makepost/MakePost.jsx'
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
      newComment: '',
      commentsData: [],
      postData: [],
      usergroups: [],
      group_id: '',
      newPost: '',
      tags: '',
      signUpFormDisplay: 'signup-form',
      logInFormDisplay: 'form-container',
      username: '',
      signup: {
        username: '',
        password: ''
      },
      login: {
        loggedIn: false,
        username: '',
        password: ''
      },
  };
}

// Rafa login code:

  updateFormSignUpUsername(e) {
    this.setState({
      signup: {
        username: e.target.value,
        password: this.state.signup.password
      }
    });
  }

  updateFormSignUpPassword(e) {
    this.setState({
      signup: {
        username: this.state.signup.username,
        password: e.target.value
      }
    });
  }

  updateFormLogInUsername(e) {
    this.setState({
      login: {
        username: e.target.value,
        password: this.state.login.password
      }
    });
  }

  updateFormLogInPassword(e) {
    this.setState({
      login: {
        username: this.state.login.username,
        password: e.target.value
      }
    });
  };

  updateFormNewPost(e){
    this.setState({
      newPost: e.target.value
    })
  };

  updateFormTags(e){
    this.setState({
      tags: e.target.value
    })
  };

  updateFormNewComment(e){
    this.setState({
      newComment: e.target.value
    })
  };

  handleSignUp() {
    fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        username: this.state.signup.username,
        password: this.state.signup.password
      })
    })
    .then(this.setState({
      username: this.state.login.username,
      signup: {
        username: '',
        password: ''
      },
      signUpFormDisplay: 'hidden'
    }))
    .catch(err => console.log(err));
  };

  handleLogIn() {
    fetch('/api/auth', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        username: this.state.login.username,
        password: this.state.login.password
      })
    })
    .then(this.setState({
      username: this.state.login.username,
      login: {
        username: '',
        password: ''
      },
      signUpFormDisplay: 'hidden',
      logInFormDisplay: 'hidden'
    }))
    .then(this.onSuccessfulLogIn)
    .catch(err => console.log(err));
  }

  loginFunctions(username) {
    this.getUserGroups(username);
    this.handleLogIn();
  }

  // ---------- END RAFA CODE

  handleNewPost() {
    fetch('/posts/newPost', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        newPost: this.state.newPost,
        tags: this.state.tags,
        group_id: this.state.group_id,
        username: this.state.username
      })
    })
    .then(this.setState({
      newPost: '',
      tags: ''
    }))
    .catch(err => console.log(err));
  };

  handleNewComment(postId){
    console.log('creating new comment to post', postId)
    fetch('/posts/newComment', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        textinput: this.state.newComment,
        post_id: postId,
        username: this.state.username
      })
    })
    .then(this.setState({
      newComment: '',
    }))
    .catch(err => console.log(err));
  };

  handleNewPostFunctions() {
    this.handleNewPost();
    setTimeout(() => {this.handleChooseGroup(this.state.group_id)}, 300);
  }

  handleDeletePostFunctions(postId) {
    this.deletePost(postId);
  }

  handleNewCommentFunctions(postId){
    this.handleNewComment(postId)
    setTimeout(() => {this.handleChooseGroup(this.state.group_id)}, 300);
  }

  getUserGroups(username) {
  return fetch(`/usergroups/${username}`, {
    method: 'GET'
  })
  .then(r => r.json())
  .then((data) => {
    this.setState({
      usergroups: data
    });
  })
  .catch(err => console.log(err));
  }

  handleChooseGroup(GroupId){
    return fetch(`/posts/${GroupId}`, {
      method: 'GET'
    })
    .then(r => r.json())
    .then((data) => {
      this.setState({
        postData: data,
        group_id: GroupId
      });
    })
  }

  deletePost(PostId){
    fetch(`posts/delete/${PostId}`, {
      method: 'delete'
    })
    .then(() => {
      const updatePosts = this.state.postData.filter((post) => {
        return post.id !== PostId;
      })
        this.setState({ postData: updatePosts })
        console.log(updatePosts)
    })
    .catch(err => console.log(err));
  }

  deleteComment(commentId){
    console.log('deleting comment')
    fetch(`posts/comment/${commentId}`, {
      method: 'delete'
    })
    .then(() => {
      const updateComments = this.state.commentsData.filter((comment) => {
        return comment.id !== commentId;
      })
        this.setState({ commentsData: updateComments })
        console.log('the new comments are:', updateComments)
    })
    .catch(err => console.log(err));
  }

  // handleComments(postId){
  //   return fetch(`/posts/comments/${postId}`, {
  //     method: 'GET'
  //   })
  //   .then(r => r.json())
  //   .then((data) => {
  //     console.log('$$$$$$ the comment data is', data)
  //     this.setState({
  //       commentsData: data
  //     });
  //   })
  // }

  render(){
    return (
      <div>
        <p> {this.state.username} </p>
        <SignUpForm
          signUpFormDisplay={this.state.signUpFormDisplay}
          signUpUsername={this.state.signup.username}
          signUpPassword={this.state.signup.password}
          updateFormUsername={event => this.updateFormSignUpUsername(event)}
          updateFormPassword={event => this.updateFormSignUpPassword(event)}
          handleFormSubmit={() => this.handleSignUp()}
        />
        <LogInForm
          logInFormDisplay={this.state.logInFormDisplay}
          loginFunctions={() => this.loginFunctions(this.state.login.username)}
          logInUsername={this.state.login.username}
          logInPassword={this.state.login.password}
          updateFormUsername={event => this.updateFormLogInUsername(event)}
          updateFormPassword={event => this.updateFormLogInPassword(event)}
          handleFormSubmit={() => this.handleLogIn()}
        />
        <GroupSelect
          userGroupSelectDisplay={this.state.userGroupSelectDisplay}
          usergroups={this.state.usergroups}
          handleChooseGroup={this.handleChooseGroup.bind(this)}
        />
        <MakePost
          newPost={this.state.newPost}
          tags={this.state.tags}
          updateFormNewPost={event => this.updateFormNewPost(event)}
          updateFormTags={event => this.updateFormTags(event)}
          handleNewPost={() => this.handleNewPostFunctions()}
        />
        <Posts
          newComment={this.state.newComment}
          updateFormNewComment={event => this.updateFormNewComment(event)}
          handleNewCommentFunctions={this.handleNewCommentFunctions.bind(this)}
          postData={this.state.postData}
          commentData={this.state.commentData}
          username={this.state.username}
          handleDeletePostFunctions={this.handleDeletePostFunctions.bind(this)}
          deleteComment={this.deleteComment.bind(this)}
        />
      </div>
   );
 }
};

export default App;
