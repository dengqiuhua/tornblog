# -*- coding:utf-8 -*-
__author__ = 'dengqiuhua'
from tornado.web import url
from user import UserList, UserDetail
from blog import BlogList, BlogDetail

handle_api = [
    url(r"/api/user/$", UserList, name="api-user"),
    url(r"/api/user/(?P<userid>\d+)/$", UserDetail, name="api-user-detail"),
    url(r"/api/blog/$", BlogList, name="api-blog"),
    url(r"/api/blog/(?P<blogid>\d+)/$", BlogDetail, name="api-blog-detail"),
]