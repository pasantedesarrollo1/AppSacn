import axios, { type AxiosError } from "axios"

const api = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}`,
  headers: {
    Accept: "application/json",
    "X-tenant": "1792780241001",
  },
})

export const getProductDetails = async (sku: string) => {
  try {
    const response = await api.get(`/inventory/product/show-by-sku?sku=${sku}`)
    return response.data.data
  } catch (error) {
    console.error("Error fetching product details:", error)
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 422) {
        throw new Error("Producto no disponible")
      }
    }
    throw error
  }
}

export { api }

