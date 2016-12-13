import React, { Component } from 'react';

// create a React Component called _App_
class MakePost extends Component {

  render(){
    return (
      <div className={this.props.newPostContainer}>
        <input
          className="linkInput"
          type="text"
          placeholder="enter a link to share"
          value={this.props.newPostMedia}
          onChange={this.props.updateFormNewPost}
        />
        <input
          className="linkInput"
          type="text"
          placeholder="enter tags"
          value={this.props.tags}
          onChange={this.props.updateFormTags}
        />
        <div className="newPostButton" onClick={this.props.handleNewPost}>
          post
        </div>
      </div>
    );
  }
}

export default MakePost;
