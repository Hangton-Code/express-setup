"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editAvatarController = exports.editProfileController = void 0;
// edit profile data such as name
function editProfileController(req, res) {
    req.user.update(Object.assign({}, req.body));
    res.end();
}
exports.editProfileController = editProfileController;
// edit avatar
function editAvatarController(req, res) {
    console.log(req.file, req.body);
    res.send();
}
exports.editAvatarController = editAvatarController;
