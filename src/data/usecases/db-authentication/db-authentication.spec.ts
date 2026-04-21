import { DBAuthentication } from "./db-authentication";
import {
  AccountModel,
  Encrypter,
  HashComparater,
  LoadAccountByEmailRepository,
} from "./db-authentication-protocols";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("access_token"));
    }
  }
  return new EncrypterStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: "any_id",
        name: "any_name",
        email: "any_email",
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
  encrypter: Encrypter;
};

const makeSut = (): Sut => {
  const loadEmailRepository = makeLoadAccountByEmailRepository();
  const hashComparer = makeHashComparater();
  const encrypter = makeEncrypter();
  const sut = new DBAuthentication(
    loadEmailRepository,
    hashComparer,
    encrypter,
  );

  return {
    sut,
    loadEmailRepository,
    hashComparer,
    encrypter,
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

  it("Shold return null if HashComparater return false ", async () => {
    const { sut, hashComparer } = makeSut();
    jest.spyOn(hashComparer, "compare").mockResolvedValueOnce(false);
    const invalidAccessToken = await sut.auth({
      email: "any@email.com",
      password: "incorrect_password",
    });
    expect(invalidAccessToken).toBeNull();
  });

  it("Shold call Encrypter with correct id", async () => {
    const { sut, encrypter } = makeSut();
    const spy = jest.spyOn(encrypter, "encrypt");
    await sut.auth({ email: "valid@email.com", password: "valid_password" });
    expect(spy).toHaveBeenCalledWith("any_id");
  });

  it("Shold return a token with success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth({
      email: "valid@email.com",
      password: "valid_password",
    });
    expect(accessToken).toEqual("access_token");
  });
});
