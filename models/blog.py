# coding=utf-8
#Created by dengqiuhua on 15-10-24.
from base import Model

class BlogInfo(Model):
    class Meta:
        table_name = "torn_blog_info"
    id = ""
    title = ""
    content = ""
    user = ""
    createtime = ""
