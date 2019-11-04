interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

interface Refresh {
  exec: (refreshToken: string) => Promise<RefreshResult>;
}

export default Refresh;
