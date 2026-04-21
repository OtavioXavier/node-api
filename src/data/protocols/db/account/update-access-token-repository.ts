export interface UpdateAccesTokenRepository {
  updateAccessToken(id: string, accessToken: string): Promise<void>;
}
