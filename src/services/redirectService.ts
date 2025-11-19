/**
 * services/redirectService
 * Tiny helper that allows non-component code to request a client-side navigation.
 * The app calls `setRedirectNavigate(navigate)` (from react-router) at bootstrap.
 * `redirectToLogin()` will either call the supplied navigate function or perform a
 * hard redirect with window.location.replace as a fallback.
 */
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