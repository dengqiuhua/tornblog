# coding=utf-8
#Created by dengqiuhua on 15-10-24.
from assets.database import dbhelper

class Model(object):

    objects = None
    _limit = ""
    def __init__(self):
        pass

    @property
    def table(self):
        if self.Meta.table_name:
            return self.Meta.table_name
        else:
            return self.__class__.__name__

    def get_conditions(self, **kwargs):
        pass

    def limit(self, rows, offset=None):
        self._limit += ' LIMIT %s%s' % ('%s, ' % offset if offset is not None else '', rows)
        return self

    def get(self, **kwargs):
        sql = "SELECT * FROM %s %s LIMIT 1" % (self.table, self._get_where(**kwargs))
        result = dbhelper.query(sql)
        if result:
            return result[0]
        return None

    def filter(self, **kwargs):
        sql = "SELECT * FROM %s %s " % (self.table, self._get_where(**kwargs) + self._limit)
        return dbhelper.query(sql)

    def create(self, **kwargs):
        fields, params = self._get_insert_params(**kwargs)
        sql = "INSERT INTO %s %s" % (self.table, fields)
        #print(fields)
        #return sql
        return dbhelper.insert(sql,params)

    def counts(self, **kwargs):
        sql = "SELECT COUNT(id) AS count FROM %s %s " % (self.table, self._get_where(**kwargs))
        return dbhelper.fetch_column(sql)

    def update(self, where, **kwargs):
        fields, params = self._get_update_params(**kwargs)
        if where:
            where = " AND %s" % where
        sql = "UPDATE %s SET %s WHERE 1=1 %s" % (self.table, fields, where)
        print(sql)
        return dbhelper.execute_with_params(sql,params)

    def delete(self, **kwargs):
        sql = "DELETE FROM %s %s" % (self.table, self._get_where(**kwargs))
        params = kwargs
        return dbhelper.execute_with_params(sql,params)

    def _get_where(self, **kwargs):
        kwargs = dict(kwargs)
        where = ""
        if kwargs:
            where = "WHERE 1=1 "
            for key, value in kwargs.items():
                where += " AND %s='%s' " % (key, value)
        return where

    def _get_update_params(self, **kwargs):
        kwargs = dict(kwargs)
        columns=kwargs.keys()
        _fields=",".join(["".join(['`',column,'`'," = %s"]) for column in columns])
        #_values=",".join(["%s" for i in range(len(columns))])
        #_sql=",".join([_fields,"= %s"])
        _params=[kwargs[key] for key in columns]
        return _fields, _params

    def _get_insert_params(self, **kwargs):
        kwargs = dict(kwargs)
        columns=kwargs.keys()
        _fields=",".join(["".join(['`',column,'`']) for column in columns])
        _values=",".join(["%s" for i in range(len(columns))])
        _sql="".join(["(",_fields,") VALUES (",_values,")"])
        _params=[kwargs[key] for key in columns]
        return _sql, _params


