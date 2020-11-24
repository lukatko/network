document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("#follow").addEventListener("click", function() {
        if (document.querySelector("#follow").innerHTML === "Follow")
        {
            fetch(`${window.location.href}/follow`, {
                method: "PUT"
            })
            .then(response => response.json())
            .then(data => {
                document.querySelector('#follow').innerHTML = "Following";
                document.querySelector('#FollowersNum').innerHTML = parseInt(document.querySelector("#FollowersNum").innerHTML) + 1;
            });
        }
        else
        {
            fetch(`${window.location.href}/follow`, {
                method: "PUT"
            })
            .then(response => response.json())
            .then(data => {
                document.querySelector('#follow').innerHTML = "Follow";
                document.querySelector('#FollowersNum').innerHTML = parseInt(document.querySelector("#FollowersNum").innerHTML) - 1;
            });
        }
    });
})