# coding=utf-8
#Created by dengqiuhua on 15-10-24.
from tornado.web import url, StaticFileHandler
from views.web import *
from views.admin import Login, Register, Logout
from views.urls import handle_admin
from api.urls import handle_api
from settings import settings

handle = [
    url(r"/themes/static/(.+)", StaticFileHandler, dict(path=settings["theme_static_path"]), name="default_static"),
    url(r"/admin/static/(.+)", StaticFileHandler, dict(path=settings["admin_static_path"]), name="admin_static"),
    url(r"/$", Index, name="web-index"),
    url(r"/login/$", Login, name="admin-login"),
    url(r"/register/$", Register, name="admin-register"),
    url(r"/logout/$", Logout, name="admin-logout"),
    url(r"/blog/my/$", MyBlog, name="web-blog-my"),
    url(r"/blog/new/$", BlogAdd, name="web-blog-add"),
    url(r"/blog/(?P<blogid>\d+)/$", BlogDetail, name="web-blog-detail"),
]

handle.extend(handle_admin)
handle.extend(handle_api)