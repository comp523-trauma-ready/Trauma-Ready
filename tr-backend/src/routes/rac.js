const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const RAC = mongoose.model('RAC');

// Must be logged-in/authenticated to POST, PUT or DELETE
const { ensureAuthenticated } = require('../config/auth');


// http://statt-portal.herokuapp.com/rac
// Generates the table of RACs, unless querystring is included
router.get('/', (req, res) => {
    if(req.query.name) {
        queryRACByName(req, res);
    } else  if(req.query.code) {
        queryRACByActivationCode(req, res);
    } else {
        RAC.find((err, docs) => {
            if (!err) {
                res.render('rac/index', {
                    viewTitle: 'Regional Advisory Committees',
                    list: docs
                });
            } else {
                console.log(`Error in retrieving RAC list : ${err}`);
            }
        });
    }
});

// query RAC by name, return in json format
function queryRACByName(req, res) {
    RAC.findOne({
        name: req.query.name
    })
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

// query RAC by activation code, return in json format
function queryRACByActivationCode(req, res) {
    RAC.find(
        {
        'activationCodes.code': req.query.code
        })
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}

// http://statt-portal.herokuapp.com/rac/:rid
// Generates the RAC in json format matching the id
router.get('/:rid', (req, res) => {
    if(!req.params.rid) {
        return res.status(400).send('Missing URL parameter: RAC ID (rid)')
    }
    RAC.findOne({
        rid: req.params.rid
    })
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(404).json(err);
        });
});

// Creates a new RAC in the database
router.post('/', ensureAuthenticated, (req, res) => {
    if(!req.body) {
        return res.status(400).send('Request body is missing');
    }
    let newRAC = new RAC(req.body);
    newRAC.save()
        .then(doc => {
            if(!doc || doc.length === 0) {
                return res.status(500).send(doc);
            }

            res.status(201).send(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Update an existing RAC
router.put('/:rid', ensureAuthenticated, (req, res) => {
    if(!req.params.rid) {
        return res.status(400).send('Missing URL parameter: RAC id (rid)');
    }
    RAC.findOneAndUpdate({
        rid: req.params.rid}, req.body, {new: true})
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// Delete an existing RAC
router.delete('/:rid', ensureAuthenticated, (req, res) => {
    if(!req.params.rid) {
        return res.status(400).send('Missing URL parameter: RAC id (rid)');
    }
    RAC.findOneAndRemove({
        rid: req.params.rid})
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


module.exports = router;