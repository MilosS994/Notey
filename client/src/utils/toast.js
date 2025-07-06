import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

export const showInfo = (message) => {
  toast(message);
};

export const showWelcome = (user) => {
  setTimeout(() => {
    toast(
      `Hey there, ${user}! Welcome! Hope you have a wonderful and productive time here.`,
      {
        icon: "📝",
        duration: 7000,
        position: "top-center",
        style: {
          fontWeight: 500,
          textAlign: "center",
          borderRadius: "16px",
          padding: "16px 24px",
          background: "#f1f5f9",
          color: "#262626",
        },
      }
    );
  }, 5000);
};
