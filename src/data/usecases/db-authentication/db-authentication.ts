import {
  type Authentication,
  type AuthenticationModel,
  Encrypter,
  HashComparater,
  LoadAccountByEmailRepository,
} from "./db-authentication-protocols";

export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByRepository: LoadAccountByEmailRepository,
    private readonly hashComparater: HashComparater,
    private readonly encrypter: Encrypter,
  ) {
    this.loadAccountByRepository = loadAccountByRepository;
    this.hashComparater = hashComparater;
    this.encrypter = encrypter;
  }
  async auth(credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByRepository.loadByEmail(
      credentials.email,
    );
    if (account != null) {
      const isTheSamePassword = await this.hashComparater.compare(
        credentials.password,
        account.password,
      );
      if (isTheSamePassword) {
        return this.encrypter.encrypt(account.id);
      }
    }
    return null;
  }
}
