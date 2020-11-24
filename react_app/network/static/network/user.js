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

class Posts extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            posts: [],
            has_next: 1,
            page: 1
        };
        this.load_next();
    }

    load_next = () =>
    {
        fetch(`${window.location.href}/posts?page=${this.state.page}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                posts: this.state.posts.concat(data.posts),
                has_next: data.has_next,
                page: this.state.page + 1
            });
        });

    }

    next()
    {
        if (this.state.has_next)
        {
            return (
                <div id = "load_next" onClick = {this.load_next}>Load next posts</div>
            )
        }
        else
        {
            return (
                <h4>No more posts to show</h4>
            )
        }
    }

    render() 
    {
        return (
            <div>
                <h1>Posts</h1>
                {this.state.posts.map((element, i) => {
                    return <Post post = {element} key = {i} />;
                })}
                {this.next()}
            </div>
        );
    }

}

ReactDOM.render(<Posts />, document.querySelector("#posts"));