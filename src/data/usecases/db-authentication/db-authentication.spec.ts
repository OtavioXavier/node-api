import { DBAuthentication } from "./db-authentication";
import {
  AccountModel,
  LoadAccountByEmailRepository,
} from "./db-authentication-protocols";

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "valid_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

type Sut = {
  sut: DBAuthentication;
  loadEmailRepository: LoadAccountByEmailRepository;
};

const makeSut = (): Sut => {
  const loadEmailRepository = makeLoadAccountByEmailRepository();
  const sut = new DBAuthentication(loadEmailRepository);

  return {
    sut,
    loadEmailRepository,
  };
};

describe("DBAuthentication", () => {
  it("Shold call LoadAccountByRepository with correct email", async () => {
    const { sut, loadEmailRepository } = makeSut();
    const spy = jest.spyOn(loadEmailRepository, "loadByEmail");
    await sut.auth({ email: "valid@email.com", password: "valid_password" });
    expect(spy).toHaveBeenCalledWith("valid@email.com");
  });

  it("Shold return null if LoadAccountByRepository return null", async () => {
    const { sut, loadEmailRepository } = makeSut();
    jest.spyOn(loadEmailRepository, "loadByEmail").mockResolvedValueOnce(null);
    const invalidAccessToken = await sut.auth({
      email: "invalid@email.com",
      password: "any_password",
    });
    expect(invalidAccessToken).toBeNull();
  });
});
