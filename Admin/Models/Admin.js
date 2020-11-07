var moongoose = require('mongoose')
var express = require('express');
var router = express.Router();

var Schema = moongoose.Schema

var AdminSchema = new Schema({
    username:String,
    password:String,
    name:String,
    birthday:Date,
    gender:String,
    address:String,
    phone:String,
    IsDeleted:Boolean,
    Log_CreatedDate:Date,
    Log_CreatedBy:Date,
    Log_UpdatedDate:Date,
    Log_UpdatedBy:String,
})

var Admin = moongoose.model('Admin',AdminSchema,'Admins')
module.exports.Admin = Admin