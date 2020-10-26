"use strict";

var _tsyringe = require("tsyringe");

var _BCryptsHashProvider = _interopRequireDefault(require("./HashProvider/implementations/BCryptsHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('HashProvider', _BCryptsHashProvider.default);