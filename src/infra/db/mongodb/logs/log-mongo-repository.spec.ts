import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helper";
import { Collection } from "mongodb";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.insertOne({ stack });
  }
}

describe("LogMongoRepository", () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  it("Shold create a log error on success", async () => {
    const sut = new LogMongoRepository();
    await sut.logError("any_error");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
