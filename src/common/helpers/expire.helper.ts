export const isTokenExpired = function (
  createdAt: Date,
  expiresIn: number,
): boolean {
  const now = Date.now();
  const expirationTime = new Date(createdAt).getTime() + expiresIn * 1000;
  return now >= expirationTime;
};
