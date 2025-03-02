import { useQuery, useQueryClient } from "@tanstack/vue-query"
import { getProductDetails } from "@/services/api"
import { useScanStore } from "@/stores/scanStore"
import { computed, watch, ref } from "vue"

export function useProductQuery() {
  const queryClient = useQueryClient()
  const scanStore = useScanStore()
  const errorMessage = ref("")

  const productQuery = useQuery({
    queryKey: computed(() => ["product", scanStore.currentProductCode]),
    queryFn: () => {
      console.log("Ejecutando queryFn con código:", scanStore.currentProductCode)
      return getProductDetails(scanStore.currentProductCode)
    },
    enabled: computed(() => !!scanStore.currentProductCode),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false, // No reintentar en caso de error
    onError: (error: Error) => {
      console.error("Error en la consulta:", error)
      errorMessage.value = error.message
    },
  })

  watch(
    () => productQuery.data,
    (newData) => {
      if (newData) {
        console.log("Datos del producto cargados en useProductQuery:", newData)
      }
    },
  )

  const fetchProduct = async (sku: string) => {
    console.log("fetchProduct llamado con código:", sku)
    try {
      const result = await queryClient.fetchQuery({
        queryKey: ["product", sku],
        queryFn: () => getProductDetails(sku),
      })
      errorMessage.value = ""
      return result
    } catch (error) {
      console.error("Error en fetchProduct:", error)
      if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = "Error desconocido"
      }
      throw error
    }
  }

  return {
    productQuery,
    fetchProduct,
    errorMessage,
  }
}

