import {
  AccountModel,
  addAccountModel,
  AddAccountRepository,
} from "@/data/usecases/db-add-account/db-add-account-protocols";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadAccountByEmailRepository } from "@/data/usecases/db-authentication/db-authentication-protocols";
import { Collection } from "mongodb";

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(accountData: addAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: result.insertedId });
    return MongoHelper.map(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const account = await (await accountCollection).findOne({ email });
    return account && MongoHelper.map(account);
  }
}

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

let accountCollection: Collection;

describe("AccountMongoRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  it("Shold return account on add with success", async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "valid_password",
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toEqual("any_name");
    expect(account.email).toEqual("any_email@mail.com");
  });

  it("Shold return account if loadByEmail tiver sucesso", async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "valid_password",
    });
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toEqual("any_name");
    expect(account.email).toEqual("any_email@mail.com");
  });
});
