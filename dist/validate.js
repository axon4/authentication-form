"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassWord = exports.validateEMail = void 0;
function validateEMail(eMail) {
    var inValidations = [];
    if (!/\S+@\S+\.\S+/.test(eMail))
        inValidations.push('inValid eMail');
    return inValidations;
}
exports.validateEMail = validateEMail;
;
function validatePassWord(passWord) {
    var inValidations = [];
    if (passWord.length < 4)
        inValidations.push('inValid passWord');
    return inValidations;
}
exports.validatePassWord = validatePassWord;
;
