
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
    path("follow/<int:user_id>", views.follow, name = "follow"),
    path("like/<int:post_id>", views.like, name = "like")
]
