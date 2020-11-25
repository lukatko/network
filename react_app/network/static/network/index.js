class Post extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            hrefpage: "/user/".concat(this.props.post.author),
            number_of_likes: this.props.post.number_of_likes,
            liked: this.props.post.liked
        };
    }
    like = () => {
        fetch(`like/${this.props.post.id}`, {
            method: "PUT"
        })
        .then(response => response.json())
        .then(data => {
            if (this.state.liked)
            {
                this.setState({
                    number_of_likes: this.state.number_of_likes - 1,
                    liked: 0
                });
            }
            else 
            {
                this.setState({
                    number_of_likes: this.state.number_of_likes + 1,
                    liked: 1
                });
            }
            
        });
    }

    render() 
    {
        return (
            <div className = "post">
                <a href = {this.state.hrefpage} id = "userlink"><h2>{this.props.post.author}</h2></a>
                <p>{this.props.post.content}</p>
                <p>{this.props.post.created}</p>
                <div id = "like">
                    <span>{this.state.number_of_likes}&nbsp;</span>
                    <span><i id = "heart_button" className = "fa fa-heart" onClick = {this.like} style = {this.state.liked ? {color: "red"} : {color: "blue"}}></i></span>
                </div>
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