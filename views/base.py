# -*- coding:utf-8 -*-
__author__ = 'dengqiuhua'
from tornado.web import RequestHandler
from models.user import UserInfo
from assets.util import time_format, filter_tags
from tornado.escape import xhtml_escape

class Base(RequestHandler):
    def get_current_user(self):
        username = self.get_secure_cookie("user")
        user = None
        if username:
            user = UserInfo().get(username=username)
        return user
    def get_page_html(self, counts=0, pagesize=10):
        pageindex = int(self.get_argument("p",1))
        page_number = 0
        if counts > 0:
            if counts % pagesize == 0:
                page_number = counts / pagesize
            else:
                page_number = counts / pagesize + 1
        is_pre = False
        is_next = False
        if page_number > 1 and pageindex > 1:
            is_pre = True
        if page_number > 1 and pageindex < page_number:
            is_next = True
        return self.render_string("default/web-pagination.html", pageindex=pageindex, page_number=page_number, is_pre=is_pre, is_next=is_next)

class Format():
    @staticmethod
    def format_blog_list(datalist):
        if not datalist:
            return []
        newlist = []
        for data in datalist:
            data = Format.format_blog(data)
            newlist.append(data)
        return newlist
    @staticmethod
    def format_blog(data):
        if not data:
            return None
        data["createtime"] = time_format(data["createtime"], "%Y-%m-%d")
        data["content"] = filter_tags(data["content"])
        return data

