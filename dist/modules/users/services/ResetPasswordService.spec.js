"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokensRepository"));

var _ResetPasswordService = _interopRequireDefault(require("./ResetPasswordService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeUsersTokenRepository;
let fakeHashProvider;
let resetPassword;
describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeUsersTokenRepository = new _FakeUserTokensRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    resetPassword = new _ResetPasswordService.default(fakeUsersRepository, fakeUsersTokenRepository, fakeHashProvider);
  });
  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const hashPassword = jest.spyOn(fakeHashProvider, 'generateHash');
    const {
      token
    } = await fakeUsersTokenRepository.generate(user.id);
    await resetPassword.execute({
      token,
      password: '123123'
    });
    const updatedUser = await fakeUsersRepository.findById(user.id);
    expect(hashPassword).toBeCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });
  it('should not be able to reset password with non-existing token', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await expect(resetPassword.execute({
      token: 'non-existing token',
      password: 'new-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password with non-existing user', async () => {
    const {
      token
    } = await fakeUsersTokenRepository.generate('non-existing user_id');
    await expect(resetPassword.execute({
      token,
      password: 'new-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password with token older than 2 hours', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const date = new Date();
      return date.setHours(date.getHours() + 3);
    });
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUsersTokenRepository.generate(user.id);
    await expect(resetPassword.execute({
      token,
      password: 'new-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});