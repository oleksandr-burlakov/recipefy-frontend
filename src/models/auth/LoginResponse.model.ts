export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  accessToken: string
}
