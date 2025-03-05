import axios, { type AxiosError } from "axios"

const api = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}`,
  headers: {
    Accept: "application/json",
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

export const verifyRuc = async (ruc: string) => {
  try {
    const response = await api.get(`/general/verify-ruc?ruc=${ruc}`, {
      headers: {
        "X-tenant": ruc,
      },
    })
    return response.data.data
  } catch (error) {
    console.error("Error verificando RUC:", error)
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 404) {
        throw new Error("RUC no encontrado")
      }
      if (axiosError.response?.status === 500) {
        throw new Error("RUC inválido o no registrado")
      }
    }
    throw error
  }
}

export const setTenant = (ruc: string) => {
  api.defaults.headers["X-tenant"] = ruc
}

export { api }

