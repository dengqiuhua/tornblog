# coding=utf-8
#Created by dengqiuhua on 15-10-24.
import tornado.web
import tornado.ioloop
from tornado.options import define, options
from urls import handle
from settings import settings

define("port", default=8088, type=int, help="listen port")

application = tornado.web.Application(handle, **settings)
application.listen(options.port)
tornado.ioloop.IOLoop.current().start()