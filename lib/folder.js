//folder
//external modules
var async = require('async');
var LZString = require('lz-string');
var moment = require('moment');

//core
var config = require("./config.js");
var logger = require("./logger.js");
var response = require("./response.js");
var models = require("./models");

//public
var Folder = {
    listNotes: listNotes
};

function listNotes(req, res) {
    if (req.isAuthenticated()) {
        var userId = req.user.id;
        var folderId = LZString.decompressFromBase64(req.params.folderId);
        getNotes(userId, folderId, function (err, notes) {
            if (err) return response.errorInternalError(res);
            if (notes === false) return response.errorForbidden(res);
            if (notes === null) return response.errorNotFound(res);
            res.send({
                notes: notes
            });
        });
    } else {
        return response.errorForbidden(res);
    }
}

function getNotes(ownerId, folderId, callback) {
    models.Folder.findOne({
        where: {
            id: folderId
        }
    }).then(function (folder) {
        if (!folder) return callback(null, null);
        if (ownerId != folder.ownerId) return callback(null, false);
        var _note = [];
        folder.getNotes().then(function(notes) {
            notes.forEach(function (note) {
                var noteInfo = models.Note.parseNoteInfo(note.content);
                _note.push({
                    id: LZString.compressToBase64(note.id),
                    text: note.title,
                    time: moment(note.lastchangeAt || note.createdAt).valueOf(),
                    tag: noteInfo.tags
                });
            });
            if (config.debug)
                logger.info('read notes success: ' + folderId);
            return callback(null, _note);
        });
    }).catch(function (err) {
        logger.error('read notes failed: ' + err);
        return callback(err, null);
    });
}

module.exports = Folder;
