# coding=utf-8
#Created by dengqiuhua on 15-10-24.
from tornado.web import authenticated
from models.user import UserInfo
from assets.util import md5
from base import Base

class Index(Base):
    @authenticated
    def get(self, *args, **kwargs):
        nav = 1
        self.render("admin/admin-blog.html", nav=nav)

class Login(Base):
    def get(self, *args, **kwargs):
        if self.current_user:
            next_url = self.get_argument("next",default=self.reverse_url("web-blog-my"))
            return self.redirect(next_url)
        nav = -1
        self.render("default/login.html", nav=nav)
    def post(self, *args, **kwargs):
        username = self.get_argument("username")
        password = self.get_argument("password")
        if UserInfo().counts(username=username, password=md5(password)):
            result = True
            self.set_secure_cookie("user", username)
            next_url = self.get_argument("next",default="/")
            self.redirect(next_url)
        else:
            result = False
        nav = -2
        self.render("default/login.html", nav=nav, result=result)

class Register(Base):
    def get(self, *args, **kwargs):
        if self.current_user:
            return self.redirect(self.reverse_url("web-blog-my"))
        nav = -2
        self.render("default/web-register.html", nav=nav)
    def post(self, *args, **kwargs):
        username = self.get_argument("username")
        password = self.get_argument("password")
        name = self.get_argument("name")
        if UserInfo().counts(username=username):
            result = False
        else:
            UserInfo().create(username=username, password=md5(password), name=name)
            result = True
            self.set_secure_cookie("user", username)
        nav = -2
        self.render("default/web-register.html", nav=nav, result=result)

class Logout(Base):
    def get(self, *args, **kwargs):
        self.set_secure_cookie("user", "")
        self.redirect(self.reverse_url("admin-login"))

class Blog(Base):
    @authenticated
    def get(self, *args, **kwargs):
        nav = 1
        self.render("admin/admin-blog.html", nav=nav)

class User(Base):
    @authenticated
    def get(self, *args, **kwargs):
        nav = 2
        self.render("admin/admin-user.html", nav=nav)