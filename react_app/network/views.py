from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
import json

from .models import User, Post, Comment, Follow, Like

def index(request):
    if (request.user.is_authenticated):
        return render(request, "network/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def posts(request):
    page = int(request.GET.get("page"))
    p = Paginator(Post.objects.all()[::-1], 10)
    next_page = p.page(page)
    posts = []
    for i in next_page.object_list:
        posts.append({})
        posts[-1]["id"] = i.id
        posts[-1]["author"] = i.author.username
        posts[-1]["content"] = i.content
        posts[-1]["created"] = i.created.strftime("%b %#d %Y, %#I:%M %p")
        posts[-1]["number_of_likes"] = Like.objects.filter(post = i).count()
        if (Like.objects.filter(post = i, author = request.user).exists()):
            posts[-1]["liked"] = 1
        else:
            posts[-1]["liked"] = 0
    print(posts)
    return JsonResponse({
        "has_next": next_page.has_next(),
        "posts": posts
    })

@csrf_exempt
@login_required
def new_post(request):
    if (request.method != "POST"):
        return JsonResponse({"error": "POST request required."}, status=400)
    author = request.user
    content = json.loads(request.body)["content"]
    Post(author = author, content = content).save()
    return JsonResponse({"message": "Email sent successfully."}, status=201)

@csrf_exempt
@login_required
def new_comment(request, post_id):
    if (request.method != "POST"):
        return JsonResponse({"error": "POST request required."}, status=400)
    author = request.user
    post = Post.objects.get(pk = post_id)
    content = json.loads(request.body)["content"]
    Comment(author = author, content = content, post = post).save()
    return JsonResponse({"message": "Email sent successfully."}, status=201)

@csrf_exempt
@login_required
def like(request, post_id):
    if (request.method != "PUT"):
        return JsonResponse({"error": "PUT request required."}, status=400)
    author = request.user
    post = Post.objects.get(pk = post_id)
    if (Like.objects.filter(author = author, post = post).exists()):
        Like.objects.get(author = author, post = post).delete()
    else:
        Like(author = author, post = post).save()
    return JsonResponse({"message": "Email sent successfully."}, status=201)

@csrf_exempt
@login_required
def follow(request, username):
    if (request.method != "PUT"):
        return JsonResponse({"error": "PUT request required."}, status=400)
    user = User.objects.get(username = username)
    if (Follow.objects.filter(follower = request.user, following = user).exists()):
        Follow.objects.get(follower = request.user, following = user).delete()
    else:
        Follow(follower = request.user, following = user).save()
    return JsonResponse({"message": "Succesful"}, status=201)

@login_required
def user(request, username):
    user = User.objects.get(username = username)
    followers = Follow.objects.filter(following = user).count()
    following = Follow.objects.filter(follower = user).count()
    if (Follow.objects.filter(follower = request.user, following = user).exists()):
        flag = "Following"
    else:
        flag = "Follow"
    return render(request, "network/user.html", {
        "followers": followers,
        "following": following,
        "username": username,
        "flag": flag
    })

@csrf_exempt
@login_required
def user_posts(request, username):
    user = User.objects.get(username = username)
    db_posts = Post.objects.filter(author = user)
    page = int(request.GET.get("page"))
    p = Paginator(db_posts, 10)
    next_page = p.page(page)
    posts = []
    for i in next_page.object_list:
        posts.append({})
        posts[-1]["id"] = i.id
        posts[-1]["author"] = i.author.username
        posts[-1]["content"] = i.content
        posts[-1]["created"] = i.created.strftime("%b %#d %Y, %#I:%M %p")
        posts[-1]["number_of_likes"] = Like.objects.filter(post = i).count()
        if (Like.objects.filter(post = i, author = request.user).exists()):
            posts[-1]["liked"] = 1
        else:
            posts[-1]["liked"] = 0
    return JsonResponse({
        "has_next": next_page.has_next(),
        "posts": posts
    })
    
@login_required
def following(request):
    return render(request, "network/following.html")

@csrf_exempt
@login_required
def following_posts(request):
    following = Follow.objects.filter(follower = request.user)
    db_posts = []
    for follow in following:
        user = follow.following
        db_posts += (Post.objects.filter(author = user))
    print(db_posts)
    page = int(request.GET.get("page"))
    p = Paginator(db_posts, 10)
    next_page = p.page(page)
    posts = []
    for i in next_page.object_list:
        posts.append({})
        posts[-1]["id"] = i.id
        posts[-1]["author"] = i.author.username
        posts[-1]["content"] = i.content
        posts[-1]["created"] = i.created.strftime("%b %#d %Y, %#I:%M %p")
        posts[-1]["number_of_likes"] = Like.objects.filter(post = i).count()
        if (Like.objects.filter(post = i, author = request.user).exists()):
            posts[-1]["liked"] = 1
        else:
            posts[-1]["liked"] = 0
    return JsonResponse({
        "has_next": next_page.has_next(),
        "posts": posts
    })

@csrf_exempt
@login_required
def get_user(request):
    return JsonResponse({
        "username": request.user.username
    })

@csrf_exempt
@login_required
def edit_post(request, post_id):
    post = Post.objects.get(pk = post_id)
    if (request.method != "PUT"):
        return JsonResponse({"error": "PUT request required."}, status=400)
    content = json.loads(request.body)["content"]
    post.content = content
    post.save()
    return JsonResponse({"message": "Succesful"}, status=201)
