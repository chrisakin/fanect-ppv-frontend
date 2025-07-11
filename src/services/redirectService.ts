let navigateFn: (path: string) => void;

export const setRedirectNavigate = (navigate: (path: string) => void) => {
  navigateFn = navigate;
};

export const redirectToLogin = () => {
  if (navigateFn) {
    navigateFn('/');
  } else {
    window.location.replace('/');
  }
};