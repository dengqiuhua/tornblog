# coding=utf-8
#Created by dengqiuhua on 15-10-24.
from tornado.web import RequestHandler, authenticated, HTTPError
from settings import settings
from models.blog import BlogInfo
from base import Base, Format
from assets.util import time_format
import markdown2
import time

class Index(Base):
    #@authenticated
    def get(self, *args, **kwargs):
        #self.write(self.request.host)
        args = {}
        page = int(self.get_argument("p",1))
        pagesize = 10
        bloglist = BlogInfo().limit(pagesize,(page -1) * pagesize).filter(**args)
        bloglist = Format.format_blog_list(bloglist)
        counts = BlogInfo().counts(**args)
        # 分页
        page_html = self.get_page_html(counts,pagesize)
        nav = 1
        self.render("default/web-index.html", nav=nav,bloglist=bloglist,page_html=page_html)

class MyBlog(Base):
    @authenticated
    def get(self, *args, **kwargs):
        args = {}
        args["user"] = self.current_user["id"]
        page = int(self.get_argument("p",1))
        pagesize = 10
        bloglist = BlogInfo().limit(pagesize,(page -1) * pagesize).filter(**args)
        counts = BlogInfo().counts(**args)
        bloglist = Format.format_blog_list(bloglist)
        # 分页
        page_html = self.get_page_html(counts,pagesize)
        nav = 2
        self.render("default/web-myblog.html", nav=nav, bloglist=bloglist,page_html=page_html)

class BlogAdd(Base):
    @authenticated
    def get(self, *args, **kwargs):
        nav = 2

        content_form = markdown2
        self.render("default/web-blog-new.html", nav=nav,content_form=content_form)
    def post(self, *args, **kwargs):
        title = self.get_argument("title")
        content = self.get_argument("content")
        blog = BlogInfo().create(title=title,content=content,user=self.current_user["id"],createtime=time.time())
        nav = 2
        self.render("default/web-blog-new.html", nav=nav,blog=blog)

class BlogDetail(Base):
    def get(self, *args, **kwargs):
        blogid = kwargs["blogid"]
        nav = 1
        args = {}
        blog = BlogInfo().get(id=blogid)
        if not blog:
            raise HTTPError(404)
        blog["createtime"] = time_format(blog["createtime"], "%Y-%m-%d")
        BlogInfo().update("id=%s" % blog["id"], view_count=blog["view_count"] + 1)
        bloglist = BlogInfo().limit(7).filter(**args)
        bloglist = Format.format_blog_list(bloglist)
        self.render("default/web-blog-detail.html", nav=nav, blog=blog, bloglist=bloglist)