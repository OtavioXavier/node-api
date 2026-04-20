export interface UpdateAccesToken {
    updateAccessToken (id: string, accessToken: string): Promise<void>
}