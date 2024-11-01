interface ISocialUserBasics {
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
}

interface ISocialWithApple extends ISocialUserBasics {
  appleId: string;
}

interface ISocialWithGoogle extends ISocialUserBasics {
  googleId: string;
}

interface ISocialWithMicrosoft extends ISocialUserBasics {
  microsoftId: string;
}

export type SocialUserType =
  | ISocialWithApple
  | ISocialWithGoogle
  | ISocialWithMicrosoft;
