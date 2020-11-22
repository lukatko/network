class Post extends React.Component 
{
    render() 
    { 
        return (
            <div id = "post">
                <h2>{this.props.post.username}</h2>
                <p>{this.props.post.content}</p>
                <p>{this.props.post.date}</p>
                <span>{this.props.post.number_of_likes}</span>
            </div>
        );
    }
}


export default Post