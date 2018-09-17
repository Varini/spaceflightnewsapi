/* eslint-disable radix,camelcase,no-param-reassign */
const Article = require('../models/article');

exports.articlesEndpoint = (req, res) => {
  const reqLimit = req.query.limit;
  delete req.query.limit;
  const query = Object.keys(req.query).reduce((mappedQuery, key) => {
    const param = req.query[key];
    if (param) {
      mappedQuery[key] = param;
    }
    return mappedQuery;
  }, {});

  Article.find(query)
    .limit(parseInt(reqLimit))
    .sort({ date_published: -1 })
    .select('-id')
    .then((articles) => {
      if (articles === undefined || articles.length === 0) {
        res.status(404).json({ message: 'Nothing found! Please refine your search. No worries, it happens to all of us sometimes.' });
      } else {
        res.send(articles);
      }
    });
};

exports.articleEndpoint = (req, res) => {
  Article.find(req.query, (err, article) => {
    if (err) { res.send(err); }
    if (article === undefined || article.length === 0) {
      res.status(404).json({ message: 'Article not found! Please refine your search. No worries, it happens to all of us sometimes.' });
    } else {
      res.send(article);
    }
  });
};
