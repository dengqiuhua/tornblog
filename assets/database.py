# coding=utf-8
#Created by dengqiuhua on 15-10-24.
import MySQLdb
conn = MySQLdb.connect(host='localhost', user='root', passwd='123456', db='tornblog', port=3306,charset="utf8")

class dbhelper:

    def __init__(self):
        pass

    def __del__(self):
        if conn:
            conn.close()

    @staticmethod
    def query(sql):
        with conn:
            try:
                cur=conn.cursor()
                cur.execute(sql)
                rows = cur.fetchall()
                column_names = [d[0] for d in cur.description]
            finally:
                cur.close()
            result = []
            for row in rows:
                result.append(dict([pair for pair in zip(column_names, row)]))
            return result
        return None

    @staticmethod
    def execute(sql):
        with conn:
            try:
                cur=conn.cursor()
                cur.execute(sql)
                rows = cur.fetchone()
            finally:
                cur.close()
            return rows
        return None

    @staticmethod
    def execute_with_params(sql, params=None):
        with conn:
            try:
                cur=conn.cursor()
                cur.execute(sql, params)
            finally:
                cur.close
            return cur.rowcount
        return None

    @staticmethod
    def insert(sql, params=None):
        with conn:
            try:
                cur=conn.cursor()
                cur.execute(sql, params)
            finally:
                cur.close
            return conn.insert_id()
        return None

    @staticmethod
    def fetch_column(sql):
        with conn:
            try:
                cur=conn.cursor()
                cur.execute(sql)
                rows = cur.fetchone()
            finally:
                cur.close()
            return rows[0]
        return None



