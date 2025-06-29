// redirectService.ts
let navigateFn: (path: string) => void;

export const setRedirectNavigate = (navigate: (path: string) => void) => {
  navigateFn = navigate;
};

export const redirectToLogin = () => {
  if (navigateFn) {
    navigateFn('/'); // Navigate to home page where login modal can be triggered
  } else {
    // Fallback: redirect to home page using window.location
    window.location.href = '/';
  }
};