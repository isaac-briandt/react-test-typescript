import axios, { AxiosResponse } from "axios";

// export type ApiErrorResponse = {
//   message: string;
//   errors: Record<string, string[]>;
// };

export const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const getToken = async () => {
  const accessToken = (await localStorage.getItem("token")) as string | null;
  return accessToken;
};

const setAuthHeader = async () => {
  const token = await getToken();
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const get = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<AxiosResponse<T>> => {
  await setAuthHeader();
  return axiosInstance.get<T>(url, { params });
};

export const post = async <T>(
  url: string,
  data?: Record<string, unknown>
): Promise<AxiosResponse<T>> => {
  await setAuthHeader();
  return axiosInstance.post<T>(url, data);
};

export const put = async <T>(
  url: string,
  data: Record<string, unknown>
): Promise<AxiosResponse<T>> => {
  await setAuthHeader();
  return axiosInstance.put<T>(url, data);
};

export const patch = async <T>(
  url: string,
  data: Record<string, unknown>
): Promise<AxiosResponse<T>> => {
  await setAuthHeader();
  return axiosInstance.patch<T>(url, data);
};

export const remove = async <T>(url: string): Promise<AxiosResponse<T>> => {
  await setAuthHeader();
  return axiosInstance.delete<T>(url);
};

export default axiosInstance;
