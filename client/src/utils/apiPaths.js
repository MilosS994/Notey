const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_USER_INFO: "/auth/me",
  },

  NOTES: {
    GET_ALL_NOTES: "/notes",
    GET_NOTE: (id) => `/notes/${id}`,
    CREATE_NOTE: "/notes",
    UPDATE_NOTE: (id) => `/notes/${id}`,
    DELETE_NOTE: (id) => `/notes/${id}`,
    PIN_NOTE: (id) => `/notes/pin/${id}`,
    SEARCH_NOTES: "/notes/search",
  },
};

export default API_PATHS;
