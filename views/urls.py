# coding=utf-8
#Created by dengqiuhua on 15-10-24.
from tornado.web import url
from views.admin import Index, Blog, User

handle_admin = [
    url(r"/admin/$", Index, name="admin-index"),
    url(r"/admin/blog/$", Blog, name="admin-blog"),
    url(r"/admin/user/$", User, name="admin-user"),
]