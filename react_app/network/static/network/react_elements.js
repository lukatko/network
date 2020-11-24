import React from "react"

class Post extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            hrefpage: "/user/".concat(this.props.post.author)
        };
    }
    render() 
    {
        return (
            <div className = "post">
                <a href = {this.state.hrefpage} id = "userlink"><h2>{this.props.post.author}</h2></a>
                <p>{this.props.post.content}</p>
                <p>{this.props.post.created}</p>
                <p>Number of likes: &nbsp; {this.props.post.number_of_likes}</p>
            </div>
        );
    }
}


export default Post