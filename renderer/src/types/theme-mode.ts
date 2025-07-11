export type ThemeMode = 'light' | 'dark' | 'system';

declare global {
  interface Window {
    themeMode: {
      current(): Promise<ThemeMode>;
      dark(): Promise<void>;
      light(): Promise<void>;
      system(): Promise<boolean>;
      toggle(): Promise<boolean>;
    };
    electronWindow: {
      minimize(): Promise<void>;
      maximize(): Promise<void>;
      close(): Promise<void>;
    };
  }
}
