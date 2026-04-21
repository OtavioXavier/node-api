import { DBAddAccount } from "./db-add-account";
import {
  AccountModel,
  addAccountModel,
  AddAccountRepository,
  Hasher,
} from "./db-add-account-protocols";

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: addAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountRepositoryStub();
};

type Sut = {
  sut: DBAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (): Sut => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();

  const dbAddAccount = new DBAddAccount(addAccountRepositoryStub, hasherStub);

  return {
    sut: dbAddAccount,
    hasherStub,
    addAccountRepositoryStub,
  };
};

const makeFakeAccountData = (): addAccountModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

describe("DBAddAccount", () => {
  it("Shold call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const encryptSpy = jest.spyOn(hasherStub, "hash");
    await sut.add(makeFakeAccountData());
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  it("Shold call AddAccountRepository with correct credentials", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    await sut.add(makeFakeAccountData());
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  it("Shold return a created account on success", async () => {
    const { sut } = makeSut();
    const createdAccount = await sut.add(makeFakeAccountData());
    expect(createdAccount).toEqual(makeFakeAccount());
  });
});
