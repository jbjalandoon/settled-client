import axios from "axios";
import { Bounce, toast } from "react-toastify";

// TODO: change url to env

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: apiUrl + "/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    // If HTTP status is 2xx, just return
    return response;
  },
  (error) => {
    // Any status outside of 2xx (or a network error) comes here.

    // You can customize the message based on error.response.status, etc.
    let message = "Something went wrong";
    if (error.response) {
      // Server responded with a status code outside 2xx
      const status = error.response.status;
      const data = error.response.data;

      // Customize your error text however you like:
      if (data && data.message) {
        message = data.message;
      } else if (status >= 500) {
        message = "Server error, please try again later.";
      } else if (status === 404) {
        message = "Resource not found.";
      } else if (status === 401) {
        message = "Unauthorized. Please log in again.";
      } else {
        message = `Error ${status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      // Request was made but no response (e.g. network down)
      message = "Network error: could not reach server.";
    } else {
      // Something else happened setting up the request
      message = error.message;
    }

    // Show a toast notification
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

    // Then reject so individual callers can also handle it if they want
    return Promise.reject(error);
  },
);

export default api;
