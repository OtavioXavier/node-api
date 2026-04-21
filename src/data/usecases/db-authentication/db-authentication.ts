import {
  type Authentication,
  type AuthenticationModel,
  Encrypter,
  HashComparater,
  LoadAccountByEmailRepository,
  UpdateAccesTokenRepository,
} from "./db-authentication-protocols";

export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByRepository: LoadAccountByEmailRepository,
    private readonly hashComparater: HashComparater,
    private readonly encrypter: Encrypter,
    private readonly updateAccessToken: UpdateAccesTokenRepository,
  ) {
    this.loadAccountByRepository = loadAccountByRepository;
    this.hashComparater = hashComparater;
    this.encrypter = encrypter;
    this.updateAccessToken = updateAccessToken;
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
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessToken.updateAccessToken(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
