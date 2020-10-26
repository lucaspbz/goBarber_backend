"use strict";

var _tsyringe = require("tsyringe");

var _upload = _interopRequireDefault(require("../../../config/upload"));

var _DiskStorageProvider = _interopRequireDefault(require("./StorageProvider/implementations/DiskStorageProvider"));

var _S3StorageProvider = _interopRequireDefault(require("./StorageProvider/implementations/S3StorageProvider"));

var _EtherealMailProvider = _interopRequireDefault(require("./MailProvider/implementations/EtherealMailProvider"));

var _HandlebarsMailTemplateProvider = _interopRequireDefault(require("./MailTemplateProvider/implementations/HandlebarsMailTemplateProvider"));

require("./CacheProvider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const providers = {
  disk: _DiskStorageProvider.default,
  s3: _S3StorageProvider.default
};

_tsyringe.container.registerSingleton('StorageProvider', providers[_upload.default.driver]);

_tsyringe.container.registerSingleton('MailTemplateProvider', _HandlebarsMailTemplateProvider.default);

_tsyringe.container.registerInstance('MailProvider', _tsyringe.container.resolve(_EtherealMailProvider.default));