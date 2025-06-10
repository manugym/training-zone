if (!process.env.EXPO_PUBLIC_BASE_URL) {
  throw new Error('EXPO_PUBLIC_BASE_URL not defined');
}
export const ServerUrl = process.env.EXPO_PUBLIC_BASE_URL;
