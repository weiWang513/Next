import Cookies from "js-cookie";
import { getMainDomain } from "../utils/utils";

export const getInjectInfo = (type) => {
  try {
    if (typeof type !== "string") return null;
    if (process.env.NEXT_PUBLIC_INJECT_COOKIE === "true") {
      return Cookies.get(type, { domain: getMainDomain() });
    } else {
      return localStorage.getItem(type);
    }
  } catch (error) {
    return null
  }
};

export const setInjectInfo = (type, value) => {
  try {
    if (typeof type !== "string") return null;
    if (process.env.NEXT_PUBLIC_INJECT_COOKIE === "true") {
      Cookies.set(type, value, { domain: getMainDomain() });
    } else {
      localStorage.setItem(type, value);
    }
  } catch (error) {}
};

export const removeInjectInfo = (type) => {
  try {
    if (typeof type !== "string") return null;
    if (process.env.NEXT_PUBLIC_INJECT_COOKIE === "true") {
      Cookies.remove(type, { domain: getMainDomain() });
    } else {
      localStorage.removeItem(type);
    }
  } catch (error) {}
};
