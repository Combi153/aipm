export function getRequiredEnv(
  configService: { get: (key: string) => string | undefined },
  key: string,
): string {
  const value = configService.get(key);

  if (!value) {
    throw new Error(`필수 환경변수 ${key}가 설정되지 않았습니다`);
  }

  return value;
}
