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

export type SocialUserType = ISocialWithApple | ISocialWithGoogle;
