class Pagination extends React.Component
{
    constructor(props)
    {
        super(props);

    }
    active = () =>
    {
        if (this.props.number_of_pages == 1)
        {
            return (
                <ul className="pagination">
                    <li className="page-item active"><a className="page-link">1</a></li>
                </ul>
            );
        }
        else if (this.props.number_of_pages == 2)
        {
            if (this.props.current_page == 1)
            {
                return (
                    <ul className="pagination">
                        <li className="page-item active"><a className="page-link">1</a></li>
                        <li className="page-item" onClick = {this.next}><a className="page-link">2</a></li>
                        <li className="page-item" onClick = {this.next}>
                            <a className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span className="sr-only">Next</span>
                            </a>
                        </li>
                    </ul>
                )
            }
            else
            {   return (
                    <ul className="pagination">
                        <li className="page-item" onClick = {this.previous}>
                            <a className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span className="sr-only">Previous</span>
                            </a>
                        </li>
                        <li className="page-item" onClick = {this.previous}><a className="page-link">1</a></li>
                        <li className="page-item active"><a className="page-link">2</a></li>
                    </ul>
                );
            }
        }
        else if (!this.props.has_previous)
        {
            return (
                <ul className="pagination">
                    <li className="page-item active"><a className="page-link">1</a></li>
                    <li className="page-item" onClick = {this.next}><a className="page-link">2</a></li>
                    <li className="page-item" onClick = {this.next_two}><a className="page-link">3</a></li>
                    <li className="page-item" onClick = {this.next}>
                        <a className="page-link" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
            );
        }
        else if (!this.props.has_next)
        {
            return (
                <ul className="pagination">
                    <li className="page-item" onClick = {this.previous}>
                        <a className="page-link" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </a>
                    </li>
                    <li className="page-item" onClick = {this.previous_two}><a className="page-link">{this.props.current_page - 2}</a></li>
                    <li className="page-item" onClick = {this.previous}><a className="page-link">{this.props.current_page - 1}</a></li>
                    <li className="page-item active"><a className="page-link">{this.props.current_page}</a></li>
                </ul>
            )
        }
        else
        {
            return (
                <ul className="pagination">
                    <li className="page-item" onClick = {this.previous}>
                        <a className="page-link" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </a>
                    </li>
                    <li className="page-item" onClick = {this.previous}><a className="page-link">{this.props.current_page - 1}</a></li>
                    <li className="page-item active"><a className="page-link">{this.props.current_page}</a></li>
                    <li className="page-item" onClick = {this.next}><a className="page-link">{this.props.current_page + 1}</a></li>
                    <li className="page-item" onClick = {this.next}>
                        <a className="page-link" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
            );
        }
    }

    next = () =>
    {
        this.props.handler(this.props.current_page + 1);
    }

    next_two = () =>
    {
        this.props.handler(this.props.current_page + 2);
    }

    previous = () =>
    {
        this.props.handler(this.props.current_page - 1);
    }

    previous_two = () =>
    {
        this.props.handler(this.props.current_page - 2);
    }

    render()
    {
        return(
            <nav aria-label="Page navigation example" className = "paginator">
                {this.active()}
            </nav>
        )
    }
}

class Post extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            hrefpage_author: "/user/".concat(this.props.post.author),
            number_of_likes: this.props.post.number_of_likes,
            liked: this.props.post.liked,
            edit_post: this.props.post.content,
            id_post: `post_body${this.props.post.id}`,
            id_edit: `edit_body${this.props.post.id}`
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

    update = (event) => {
        this.setState({
            edit_post: event.target.value
        });
    }

    inputKey = (event) =>
    {
        if (event.key === 'Enter')
        {
            fetch(`/post/${this.props.post.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    content: this.state.edit_post
                })
            })
            .then(response => response.json())
            .then(data => {
                document.querySelector(`#${this.state.id_post}`).style.display = "block";
                document.querySelector(`#${this.state.id_edit}`).style.display = "none";
            })
        }
    }

    edit()
    {
        if (this.props.username === this.props.post.author)
        {
            return (
                <a id = "edit" onClick = {this.edit_post}>Edit</a>
            )
        }
    }

    edit_post = () =>
    {
        document.querySelector(`#${this.state.id_post}`).style.display = "none";
        document.querySelector(`#${this.state.id_edit}`).style.display = "block";
    }


    render() 
    {
        return (
            <div className = "post">
                <a href = {this.state.hrefpage_author} id = "userlink"><h2>{this.props.post.author}</h2></a>
                {this.edit()}
                <div id = {this.state.id_post}>
                    <p id = "content">{this.state.edit_post}</p>
                    <p>{this.props.post.created}</p>
                    <div id = "like">
                        <span>{this.state.number_of_likes}&nbsp;</span>
                        <span><i id = "heart_button" className = "fa fa-heart" onClick = {this.like} style = {this.state.liked ? {color: "red"} : {color: "blue"}}></i></span>
                    </div>
                </div>
                <div id = {this.state.id_edit} style = {{display:"none"}}>
                    <h3>Edit post</h3>
                    <textarea type = "text" value = {this.state.edit_post} onChange = {this.update} onKeyPress = {this.inputKey} />
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
            username: "",
            has_previous: 0,
            new_post: ""
        };
        this.number_of_pages;
        this.handler = this.handler.bind(this);
        this.load_next(1);
    }

    componentDidMount()
    {
        fetch("/get_user")
        .then(response => response.json())
        .then(data => {
            this.setState({
                username: data.username
            })
        });
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
                this.load_next(1);
            })
        }
    }

    load_next = (page) =>
    {
        fetch(`/posts?page=${page}`)
        .then(response => response.json())
        .then(data => {
            this.number_of_pages = data.number_of_pages;
            this.setState({
                posts: data.posts,
                has_next: data.has_next,
                has_previous: data.has_previous,
                page: page
            });
        });

    }

    handler(page)
    {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.load_next(page);
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
                    return <Post post = {element} key = {element.id} username = {this.state.username} />;
                })}
                <Pagination current_page = {this.state.page} handler = {this.handler} number_of_pages = {this.number_of_pages} has_next = {this.state.has_next} has_previous = {this.state.has_previous} />
            </div>
        );
    }

}

ReactDOM.render(<Posts />, document.querySelector("#posts"));