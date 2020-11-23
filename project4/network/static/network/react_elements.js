class Post extends React.Component 
{
    constructor(props)
    {
        super(props);
    }
    render() 
    {
        return (
            <div className = "post">
                <h2>{this.props.post.author}</h2>
                <p>{this.props.post.content}</p>
                <p>{this.props.post.created}</p>
                <p>Number of likes: &nbsp; {this.props.post.number_of_likes}</p>
            </div>
        );
    }
}


export default Post