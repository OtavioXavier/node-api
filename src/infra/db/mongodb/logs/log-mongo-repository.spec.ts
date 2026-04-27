import { MongoHelper } from "../helpers/mongo-helper";
import { Collection } from "mongodb";
import { LogMongoRepository } from "./log-mongo-repository";

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

  it("Shold create a log error with correct date", async () => {
    const sut = new LogMongoRepository();
    await sut.logError("any_error");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
    const log = await errorCollection.findOne({});
    expect(log.date).toBeTruthy();
  });
});
