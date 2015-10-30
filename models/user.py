# -*- coding:utf-8 -*-
__author__ = 'dengqiuhua'
from base import Model

class UserInfo(Model):
    class Meta:
        table_name = "torn_user_info"
    id = ""
    username = ""
    name = ""
    email = ""
    createtime = ""

