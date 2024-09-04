const apiRequest = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const API = {
  fetchDataById: async <T>(url: string, id: string) =>
    await apiRequest<T>(`${url}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-access-token",
      },
    }),
  fetchData: async <T>(url: string, token: string) =>
    await apiRequest<T>(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }),
  updateData: async <T>(url: string, id: string, data: any) =>
    await apiRequest<T>(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-access-token",
      },
      body: JSON.stringify(data),
    }),
  deleteData: async (url: string, id: string) =>
    await apiRequest<void>(`${url}/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer your-access-token" },
    }),
  createData: async <T>(url: string, data: any) =>
    await apiRequest<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-access-token",
      },
      body: JSON.stringify(data),
    }),
  deleteMany: async (url: string, ids: number[] | string[]) =>
    await apiRequest<void>(url, {
      method: "POST", // Assuming a POST request with a body for deletion criteria
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-access-token",
      },
      body: JSON.stringify({ ids }),
    }),
};
