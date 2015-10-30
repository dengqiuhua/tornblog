# coding=utf-8
#Created by dengqiuhua on 15-10-24.
import os

base_dir = os.path.dirname(__file__)
settings = {
    'static_path': os.path.join(base_dir, 'static'),
    'template_path' : os.path.join(base_dir, 'themes'),
    'theme_static_path' : os.path.join(base_dir, 'themes/default/static'),
    'admin_static_path' : os.path.join(base_dir, 'themes/admin/static'),
    'login_url' : '/login/',
    'cookie_secret': "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    'debug' : True
}
