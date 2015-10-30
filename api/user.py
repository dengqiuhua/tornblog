# -*- coding:utf-8 -*-
__author__ = 'dengqiuhua'
from tornado.escape import json_encode
from tornado.web import authenticated
from models.user import UserInfo
from views.base import Base

class UserList(Base):
    def get(self, *args, **kwargs):
        args = {}
        userlist = UserInfo().filter(**args)
        counts = UserInfo().counts(**args)
        data = {"result":True, "data":userlist, "counts":counts}
        self.write(json_encode(data))

class UserDetail(Base):
    def get(self, *args, **kwargs):
        userid = kwargs["userid"]
        user = UserInfo().get(id=userid)
        counts = 1
        data = {"result":True, "data":user, "counts":counts}
        self.write(json_encode(data))
    def put(self, *args, **kwargs):
        userid = kwargs["userid"]
        user = UserInfo().get(id=userid)
        name = self.get_argument("name", None)
        password = self.get_argument("password", None)
        is_super = self.get_argument("is_super", None)
        args = {}
        if name:
            args["name"] = name
        if password:
            args["password"] = password
        if is_super:
            args["is_super"] = is_super
        UserInfo().update("and id=%s" % user["id"], **args)
        data = {"result":True}
        self.write(json_encode(data))
    def delete(self, *args, **kwargs):
        userid = kwargs["userid"]
        user = UserInfo().get(id=userid)
        UserInfo().delete(dict(id=user.id))
        data = {"result":True}
        self.write(json_encode(data))
