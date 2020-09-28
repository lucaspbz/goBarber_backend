import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";

let fakeEmailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let fakeUsersTokenRepository: FakeUserTokensRepository;

describe("SendForgotPassowrdEmail", () => {
    beforeEach(() => {
        fakeEmailProvider = new FakeMailProvider();
        fakeUsersRepository = new FakeUsersRepository();
        fakeUsersTokenRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeEmailProvider,
            fakeUsersTokenRepository
        );
    });

    it("should be able to send a forgot email password", async () => {
        const sendMail = jest.spyOn(fakeEmailProvider, "sendMail");

        await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        });

        await sendForgotPasswordEmail.execute({ email: "johndoe@example.com" });

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send a forgot email password to a non-existing user", async () => {
        await expect(
            sendForgotPasswordEmail.execute({ email: "johndoe@example.com" })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should generate a forgot password token", async () => {
        const generateToken = jest.spyOn(fakeUsersTokenRepository, "generate");

        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        });

        await sendForgotPasswordEmail.execute({ email: "johndoe@example.com" });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
