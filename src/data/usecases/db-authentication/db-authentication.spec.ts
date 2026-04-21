import {
  AccountModel,
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
} from "./db-authentication-protocols";

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

export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByRepository: LoadAccountByEmailRepository,
  ) {
    this.loadAccountByRepository = loadAccountByRepository;
  }
  async auth(credentials: AuthenticationModel): Promise<string> {
    await this.loadAccountByRepository.loadByEmail(credentials.email);
    return new Promise((resolve) => resolve("valid_token"));
  }
}

describe("DBAuthentication", () => {
  it("Shold call LoadAccountByRepository with correct email", async () => {
    const loadEmailByRepositoryStub = new LoadAccountByEmailRepositoryStub();
    const sut = new DBAuthentication(loadEmailByRepositoryStub);
    const spy = jest.spyOn(loadEmailByRepositoryStub, "loadByEmail");
    await sut.auth({ email: "valid@email.com", password: "valid_password" });
    expect(spy).toHaveBeenCalledWith("valid@email.com");
  });
});
