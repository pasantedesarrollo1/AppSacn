import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getProductDetails } from '@/services/api'
import { useScanStore } from '@/stores/scanStore'
import { computed, watch } from 'vue'

export function useProductQuery() {
  const queryClient = useQueryClient()
  const scanStore = useScanStore()

  const productQuery = useQuery({
    queryKey: computed(() => ['product', scanStore.currentProductCode]),
    queryFn: () => {
      console.log('Ejecutando queryFn con código:', scanStore.currentProductCode);
      return getProductDetails(scanStore.currentProductCode);
    },
    enabled: computed(() => !!scanStore.currentProductCode),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false, // No reintentar en caso de error
    onError: (error) => {
      console.error('Error en la consulta:', error.message);
    }
  })

  watch(() => productQuery.data, (newData) => {
    if (newData) {
      console.log('Datos del producto cargados en useProductQuery:', newData);
    }
  })

  const fetchProduct = async (code: string) => {
    console.log('fetchProduct llamado con código:', code);
    try {
      const result = await queryClient.fetchQuery({
        queryKey: ['product', code],
        queryFn: () => getProductDetails(code),
      })
      return result
    } catch (error) {
      console.error('Error en fetchProduct:', error.message);
      throw error; // Re-lanzar el error para que pueda ser manejado en ProductModal
    }
  }

  return {
    productQuery,
    fetchProduct,
  }
}