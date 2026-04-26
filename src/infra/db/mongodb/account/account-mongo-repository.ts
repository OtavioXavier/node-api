import {
  AccountModel,
  addAccountModel,
  AddAccountRepository,
} from "@/data/usecases/db-add-account/db-add-account-protocols";
import { MongoHelper } from "../helpers/mongo-helper";
import {
  LoadAccountByEmailRepository,
  UpdateAccesTokenRepository,
} from "@/data/usecases/db-authentication/db-authentication-protocols";
import { ObjectId } from "mongodb";

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccesTokenRepository
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

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } },
    );
  }
}
