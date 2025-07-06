const API_PATHS = {
  // AUTH
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    GET_USER_INFO: "/auth/me",
  },

  // USER
  USER: {
    UPDATE_USER: "/users/me",
    DELETE_USER: "/users/me",
  },

  // ADMIN
  ADMIN: {
    DELETE_USER: (userId) => `/admin/users/${userId}`,
    GET_USERS: "admin/users",
  },

  // NOTES
  NOTES: {
    CREATE_NOTE: "/notes",
    GET_NOTES: "/notes",
    GET_NOTE: (noteId) => `/notes/${noteId}`,
    UPDATE_NOTE: (noteId) => `/notes/${noteId}`,
    DELETE_NOTE: (noteId) => `/notes/${noteId}`,

    SEARCH_NOTES: "/notes/search",
    PIN_NOTE: (noteId) => `/notes/${noteId}/pin`,
    SORT_BY_PRIORITY: "/notes/sort/priority",
    SORT_BY_DATE: "/notes/sort/date",
    SORT_BY_TITLE: "/notes/sort/title",
    SORT_BY_PINNED: "/notes/sort/pinned",
    SORT_MULTI: "/notes/sort/multi",
  },
};

export default API_PATHS;
