import { DBAuthentication } from "./db-authentication";
import {
  AccountModel,
  HashComparater,
  LoadAccountByEmailRepository,
} from "./db-authentication-protocols";

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparater = (): HashComparater => {
  class HashComparaterStub implements HashComparater {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparaterStub();
};

type Sut = {
  sut: DBAuthentication;
  loadEmailRepository: LoadAccountByEmailRepository;
  hashComparer: HashComparater;
};

const makeSut = (): Sut => {
  const loadEmailRepository = makeLoadAccountByEmailRepository();
  const hashComparer = makeHashComparater();
  const sut = new DBAuthentication(loadEmailRepository, hashComparer);

  return {
    sut,
    loadEmailRepository,
    hashComparer,
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

  it("Shold call HashComparater with correct password", async () => {
    const { sut, hashComparer } = makeSut();
    const spy = jest.spyOn(hashComparer, "compare");
    await sut.auth({ email: "valid@email.com", password: "valid_password" });
    expect(spy).toHaveBeenCalledWith("valid_password", "hashed_password");
  });
});
