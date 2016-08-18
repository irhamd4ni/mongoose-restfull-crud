'use strict';

const _ = require('lodash');
const eachOfSeries = require('async/eachOfSeries');
const errorFormat = require('./errorFormat');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const crud = (Model, options) => {
  options = options || {};
  const self = {
    get: function(req, res) {
      const query = self._getQuery(req);
      const select  = options.select || {};
      const page    = req.query.page || (options.page || 1);
      const perPage = page < 0 ? null : (
                    req.query.limit && req.query.limit > 0
                      ? req.query.limit
                      : (options.perPage || 20)
                    );
      const sort    = req.query.sort
                    ? JSON.parse(req.query.sort)
                    : (options.sort || {name: 'asc'});
      const modelQuery = Model
        .find(query)
        .select(select);

      if (select) {
        modelQuery.select(select);
      }

      if (page > 0) {
        modelQuery
          .limit(perPage)
          .skip(perPage * (page -1))
      }
      if (options.populate) {
        modelQuery.populate(options.populate);
      }
      modelQuery
        .sort(sort)
        .exec(function (err, results) {
          if (err) {
            return res.status(400).json(errorFormat(err));
          }
          if (!results) {
            return res.status(404).json({});
          }
          Model.count(query).exec(function (err, count) {
            if (err) {
              return res.status(400).json(errorFormat(err));
            }
            return res.status(200).json({
              page: page,
              pages: perPage ? _.ceil(count / perPage) :  null,
              perPage: perPage,
              totalCount: count,
              results: results
            });
          });
        });
    },

    getOne: function(req, res) {
      const query = self._getQuery(req);
      return self._getOne(res, req.params.id, query);
    },

    post: function(req, res) {
      const query = self._getQuery(req);
      const doc = new Model(_.assign(req.body, query));
      doc.save(function(err, doc) {
        if (err) {
          return res.status(400).json(errorFormat(err));
        }
        if (!doc) {
          return res.status(400).json(errorFormat("Record not found after saving"));
        }
        if (options.populate) {
          return self._getOne(res, doc._id, query);
        } else {
          return res.status(200).json(doc);
        }
      });
    },

    put: function(req, res) {
      const query = self._getQuery(req);
      _.assign(query, {
        _id: req.params.id
      });
      Model.findOne(query, function(err, doc) {
        if (err) {
          return res.status(400).json(errorFormat(err));
        }
        if (!doc) {
          return res.status(400).json(errorFormat("Record not found"));
        }
        _.assign(doc, req.body)

        doc.save(function(err, doc) {
          if (err) {
            return res.status(400).json(errorFormat(err));
          }
          if (!doc) {
            return res.status(400).json(errorFormat("Record not found"));
          }
          if (options.populate || options.select) {
            return self._getOne(res, doc._id, query);
          } else {
            return res.status(200).json(doc);
          }
        });
      });
    },

    delete: function(req, res) {
      const query = self._getQuery(req);
      _.assign(query, {
        _id: req.params.id
      });
      Model.findOne({_id: req.params.id}, function(err, doc) {
        if (err) {
          return res.status(400).json(errorFormat(err));
        }
        if (!doc) {
          return res.status(400).json(errorFormat("Record not found"));
        }
        doc.remove(function(err) {
          if (err) {
            return res.status(400).json(errorFormat(err));
          }
          res.status(200).json({
            message: "Record removed"
          });
        });
      });
    },

    bulkPost: function(req, res) {
      const query   = self._getQuery(req);
      const oks     = [];
      const errors  = [];

      eachOfSeries(req.body,
        function(item, key, cb) {
          const doc = new Model(_.assign({}, item, query));
          doc.save(function(err, doc) {
            if (err) {
              errors.push(errorFormat(err).errors);
              return cb(null);
            }
            if (!doc) {
              errors.push("Record not found after saving");
              return cb(null);
            }
            oks.push(doc);
            cb();
          });
        },
        function(err) {
          return res.status(200).json({
            results: oks,
            errors: _.flatten(errors)
          });
        }
      );
    },

    _getOne: function(res, id, query) {
      let modelQuery;
      if (ObjectId.isValid(id)) {
        modelQuery = Model
          .findOne(_.assign(query, {
            _id: id
          }));
      } else {
        modelQuery = Model
          .findOne(_.assign(query, {
            slug: id
          }));
      }

      if (!_.isEmpty(options.select)) {
        modelQuery.select(options.select);
      }

      if (!_.isEmpty(options.populate)) {
        modelQuery.populate(options.populate);
      }

      modelQuery.exec(function(err, doc) {
        if (err) {
          return res.status(400).json(errorFormat(err));
        }
        if (!doc) {
          return res.status(404).json(errorFormat("Record not found"));
        }
        return res.status(200).json(doc);
      });
    },

    _getQuery(req) {
      const query = req.query.filter ? JSON.parse(req.query.filter) : {};
      if (options.filter) {
        return _.assign({}, query, options.filter);
      }
      return query;
    }

  }
  return self;
}

module.exports = crud;
