import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    clear,
    login,
    loginStatus,
    isInitializing,
    isLoginSuccess,
  } = useInternetIdentity();

  const isAuthenticated = isLoginSuccess && identity !== undefined;
  const isLoading = isInitializing;
  const principal = identity?.getPrincipal();

  return {
    identity,
    principal,
    isAuthenticated,
    isLoading,
    login,
    logout: clear,
    loginStatus,
  };
}
