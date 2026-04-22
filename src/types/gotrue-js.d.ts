declare module "gotrue-js" {
  interface User {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
    jwt(): Promise<string>;
    logout(): Promise<void>;
  }

  interface GoTrueOptions {
    APIUrl: string;
    audience?: string;
    setCookie?: boolean;
  }

  class GoTrue {
    constructor(options: GoTrueOptions);
    currentUser(): User | null;
    // loginExternalProvider does NOT exist — removed
    // .on() does NOT exist — removed
  }

  export default GoTrue;
}
