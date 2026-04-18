const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return {
    token: token || null,
    role: role || null,
    isLoggedIn: Boolean(token),
  };
};

export const createUserSlice = (set) => ({
  user: {
    username: "",
    email: "",
    tempemail: "",
    authLoading: false,
    verifying: false,
  },
  auth: getStoredAuth(),

  setAuthSession: ({ token, role }) => {
    if (token) {
      localStorage.setItem("token", token);
    }

    if (role) {
      localStorage.setItem("role", role);
    }

    set({
      auth: {
        token: token || null,
        role: role || null,
        isLoggedIn: Boolean(token),
      },
    });
  },

  clearAuthSession: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    set({
      auth: {
        token: null,
        role: null,
        isLoggedIn: false,
      },
    });
  },

  setUserData: ({ username, email }) => {
    set((state) => ({
      user: {
        ...state.user,
        username: username || "",
        email: email || "",
      },
    }));
  },

  setTempEmail: (tempemail) => {
    set((state) => ({
      user: {
        ...state.user,
        tempemail: tempemail || "",
      },
    }));
  },

  setVerifying: (verifying) => {
    set((state) => ({
      user: {
        ...state.user,
        verifying: Boolean(verifying),
      },
    }));
  },
});

// Backward-compatible alias while moving away from auth folder naming.
export const createAuthSlice = createUserSlice;