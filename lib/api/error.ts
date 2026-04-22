import axios from "axios";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "Requested resource was not found.",
  409: "A conflicting record already exists.",
  422: "Submitted data is invalid.",
  429: "Too many requests. Please try again in a moment.",
  500: "Something went wrong. Please try again later.",
  502: "Service is temporarily unavailable. Please try again.",
  503: "Service is temporarily unavailable. Please try again.",
  504: "Request timed out. Please try again.",
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed. Please try again.",
) {
  const isProduction = process.env.NODE_ENV === "production";

  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!isProduction) {
    const backendMessage = error.response?.data?.message;
    if (typeof backendMessage === "string" && backendMessage.trim()) {
      return backendMessage;
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  const status = error.response?.status;
  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  return fallback;
}