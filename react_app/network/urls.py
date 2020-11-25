
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts", views.posts, name = "posts"),
    path("post", views.new_post, name = "new_post"),
    path("comment/<int:post_id>", views.new_comment, name = "new_comment"),
    path("user/<str:username>/follow", views.follow, name = "follow"),
    path("like/<int:post_id>", views.like, name = "like"),
    path("user/<str:username>", views.user, name = "user"),
    path("user/<str:username>/posts", views.user_posts, name = "user_posts"),
    path("following", views.following, name = "following"),
    path("following/posts", views.following_posts, name = "following_post"),
    path("get_user", views.get_user, name = "get_user"),
    path("post/<int:post_id>", views.edit_post, name = "edit_post")
]
