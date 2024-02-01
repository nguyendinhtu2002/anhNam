const mongoose = require("mongoose");

const CrawlerSchema = mongoose.Schema({
    t01: {
        type: Number,
        default: 0,
    },
    t04: {
        type: Number,
        default: 0,
    },
    t07: {
        type: Number,
        default: 0,
    },
    t10: {
        type: Number,
        default: 0,
    },
    t13: {
        type: Number,
        default: 0,
    },
    t16: {
        type: Number,
        default: 0,
    },
    t19: {
        type: Number,
        default: 0,
    },
    t22: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const CrawlerModel = mongoose.model("Crawler", CrawlerSchema);
module.exports = CrawlerModel;
