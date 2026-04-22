import { HashComparater } from "@/data/protocols/criptography/hash-comparater";
import { Hasher } from "@/data/protocols/criptography/hasher";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));
const salt = 12;

export class BcryptAdapter implements Hasher, HashComparater {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
  async hash(value: string): Promise<string> {
    const hash = bcrypt.hash(value, salt);
    return hash;
  }
}

describe("Bcrypt Adapter", () => {
  it("Shold call hash with the correct password and salt", async () => {
    const sut = new BcryptAdapter(salt);
    const spy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_password");
    expect(spy).toHaveBeenCalledWith("any_password", salt);
  });

  it("Shold return a valid hash on hash success", async () => {
    const sut = new BcryptAdapter(salt);
    const validHash = await sut.hash("valid_password");
    expect(validHash).toEqual("hash");
  });

  it("Shold call compare with correct values", async () => {
    const sut = new BcryptAdapter(salt);
    const spy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_password", "hash");
    expect(spy).toHaveBeenCalledWith("any_password", "hash");
  });

  it("Shold return true on compare success", async () => {
    const sut = new BcryptAdapter(salt);
    const isSame = await sut.compare("any_password", "hash");
    expect(isSame).toBe(true);
  });

  it("Shold return false on compare fail", async () => {
    const sut = new BcryptAdapter(salt);
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false);
    const isSame = await sut.compare("any_password", "hash");
    expect(isSame).toBe(false);
  });
});
