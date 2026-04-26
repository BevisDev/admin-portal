type HandleGoogleCallbackArgs = {
  setMe: (data: Me) => void;
  navigate: NavigateFunction;
};

type GoogleProfile = {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  verified_email?: boolean;
};

export const loginGoogle = (): string => {
  return "";
};
