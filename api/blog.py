# -*- coding:utf-8 -*-
__author__ = 'dengqiuhua'
from tornado.escape import json_encode
from models.blog import BlogInfo
from views.base import Base

class BlogList(Base):
    #@authenticated
    def get(self, *args, **kwargs):
        args = {}
        bloglist = BlogInfo().filter(**args)
        counts = BlogInfo().counts(**args)
        data = {"result":True, "data":bloglist, "counts":counts}
        self.write(json_encode(data))

class BlogDetail(Base):
    def get(self, *args, **kwargs):
        blogid = kwargs["blogid"]
        blog = BlogInfo().get(id=blogid)
        counts = 1
        data = {"result":True, "data":blog, "counts":counts}
        self.write(json_encode(data))
    def delete(self, *args, **kwargs):
        blogid = kwargs["blogid"]
        blog = BlogInfo().get(id=blogid)
        BlogInfo().delete(dict(id=blog.id))
        data = {"result":True}
        self.write(json_encode(data))