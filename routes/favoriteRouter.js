const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const Campsite = require('../models/campsites');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get([cors.cors, authenticate.verifyUser], (req, res, next) => {
    
    Favorite.find({'user': req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post([cors.corsWithOptions, authenticate.verifyUser], (req, res, next) => {
    
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(fav => {
                if (!favorite.campsites.includes(fav._id)) {
                    favorite.campsites.push(fav._id);
                }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id, campsites: req.body })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }
    }).catch(err => next(err));
})
.put([cors.corsWithOptions, authenticate.verifyUser], (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete([cors.corsWithOptions, authenticate.verifyUser], (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get([cors.cors, authenticate.verifyUser], (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/:campsiteId');
})
.post([cors.corsWithOptions, authenticate.verifyUser], (req, res, next) => {

    if (mongoose.Types.ObjectId.isValid(req.params.campsiteId)) {
        Campsite.findOne({ _id: req.params.campsiteId})
        .then(campsite => {
            if (campsite) {
                console.log('campsite found');
                Favorite.findOne({ user: req.user._id })
                .then(favorite => {
                    if (favorite) {
                        if (!favorite.campsites.includes(req.params.campsiteId)){
                            favorite.campsites.push(req.params.campsiteId);
                            favorite.save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                        } else {
                            res.statusCode = 200;
                            res.end('That campsite is already in the list of favorites!')
                        }            
                    } else {
                        Favorite.create({ user: req.user._id, campsites: req.params.campsiteId })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                    }
                }).catch(err => next(err));
            } else {
                console.log('campsite NOT found');
                res.statusCode = 404;
                res.end('Campsite not found')
            }
        })
        .catch(err => next(err));    
    } else {
        console.log('campsite NOT found');
        res.statusCode = 404;
        res.end('Campsite not found')
    }
})
.put([cors.corsWithOptions, authenticate.verifyUser], (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/:campsiteId');
})
.delete([cors.corsWithOptions, authenticate.verifyUser], (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            if (favorite.campsites.includes(req.params.campsiteId)){
                favorite.campsites.remove(req.params.campsiteId);
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.end('That campsite is NOT in the list of favorites!')
            }            
        } else {
            res.statusCode = 200;
            res.end('No favorites for the user');
        }
    }).catch(err => next(err));
});

module.exports = favoriteRouter;