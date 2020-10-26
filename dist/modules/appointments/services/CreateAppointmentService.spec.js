"use strict";

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let createAppointment;
let fakeNotificationsRepository;
let fakeCacheProvider;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationsRepository = new _FakeNotificationsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointment = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
  });
  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 16),
      provider_id: '123456213321',
      user_id: '123123'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456213321');
  });
  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 11, 13);
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456213321',
      user_id: '123123'
    });
    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456213321',
      user_id: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create a appointment on a past date', async () => {
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456213321',
      user_id: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create a appointment with same user as provider', async () => {
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 10, 13),
      provider_id: 'user-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create a appointment before 8am and after 5pm', async () => {
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 11, 7),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 12, 18),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});