from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    author = models.ForeignKey(User, on_delete = models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now = True)

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete = models.CASCADE)
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now = True)


class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "following")
    following = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "followers")

class Like(models.Model):
    author = models.ForeignKey(User, on_delete = models.CASCADE)
    post = models.ForeignKey(Post, on_delete = models.CASCADE) 