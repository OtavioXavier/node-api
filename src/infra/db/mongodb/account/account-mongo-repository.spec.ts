import { Collection } from "mongodb";
import { AccountMongoRepository } from "./account-mongo-repository";
import { MongoHelper } from "../helpers/mongo-helper";
import { addAccountModel } from "@/domain/usecases/add-account";

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

const makeAccountData = (): addAccountModel => {
  return {
    name: "any_name",
    email: "any_email@mail.com",
    password: "valid_password",
  };
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
    const account = await sut.add(makeAccountData());
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toEqual("any_name");
    expect(account.email).toEqual("any_email@mail.com");
  });

  it("Shold return account if loadByEmail tiver sucesso", async () => {
    const sut = makeSut();
    const accountData = makeAccountData();
    await accountCollection.insertOne(accountData);
    const account = await sut.loadByEmail(accountData.email);
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toEqual(accountData.name);
    expect(account.email).toEqual(accountData.email);
  });

  it("Shold return nyll if loadByEmail falhar", async () => {
    const sut = makeSut();
    const accountData = makeAccountData();
    await accountCollection.insertOne(accountData);
    const account = await sut.loadByEmail("wrong_email@mail.com");
    expect(account).toBeNull();
  });

  it("Shold update the correct account on updateAccessToken", async () => {
    const sut = makeSut();
    const accountData = makeAccountData();
    await accountCollection.insertOne(accountData);
    const { _id } = await accountCollection.findOne({
      email: accountData.email,
    });
    await sut.updateAccessToken(_id.toString(), "access_token");
    const account = await accountCollection.findOne({ _id });
    expect(account).toBeTruthy();
    expect(account.accessToken).toBe("access_token");
  });
});
