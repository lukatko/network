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
                <p>{this.props.post.number_of_likes}</p>
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
            page: 1,
            new_post: ""
        };
        this.load_next();
    }

    update = (event) =>
    {
        this.setState({
            new_post: event.target.value
        });
    }
    inputKey = (event) =>
    {
        if (event.key === 'Enter')
        {
            fetch(`/post`, {
                method: "POST",
                body: JSON.stringify({
                    content: this.state.new_post
                })
            })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    new_post: "",
                    posts: [],
                    page: 1,
                    has_next: 1
                });
                this.load_next();
            })
        }
    }

    load_next = () =>
    {
        fetch(`/posts?page=${this.state.page}`)
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
                <div className = "post" id = "new_post">
                    <h3>New post</h3>
                    <textarea type = "text" value = {this.state.new_post} onChange = {this.update} onKeyPress = {this.inputKey} />
                </div>
                {this.state.posts.map((element, i) => {
                    return <Post post = {element} key = {i} />;
                })}
                {this.next()}
            </div>
        );
    }

}

ReactDOM.render(<Posts />, document.querySelector("#posts"));