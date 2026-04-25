import {
  AccountModel,
  addAccountModel,
  AddAccountRepository,
} from "@/data/usecases/db-add-account/db-add-account-protocols";
import { MongoHelper } from "../helpers/mongo-helper";

describe("AccountMongoRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: addAccountModel): Promise<AccountModel> {
      return new Promise((resolve) =>
        resolve({
          id: "any_id",
          name: "any_name",
          email: "any_email",
          password: "hashed_password",
        }),
      );
    }
  }

  it("Shold return account on add with success", async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.add({
      name: "any_name",
      email: "any_email",
      password: "valid_password",
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toEqual("any_name");
    expect(account.email).toEqual("any_email");
  });
});
