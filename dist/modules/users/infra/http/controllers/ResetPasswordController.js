"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ResetPasswordService = _interopRequireDefault(require("../../../services/ResetPasswordService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index, show, create, update, delete
class ResetPasswordController {
  async create(request, response) {
    const {
      password,
      token
    } = request.body;

    const resetPassword = _tsyringe.container.resolve(_ResetPasswordService.default);

    await resetPassword.execute({
      password,
      token
    });
    return response.status(204).send();
  }

}

exports.default = ResetPasswordController;