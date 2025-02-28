import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getProductDetails } from '@/services/api'
import { useScanStore } from '@/stores/scanStore'
import { computed } from 'vue'

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
  })

  const fetchProduct = async (code: string) => {
    console.log('fetchProduct llamado con código:', code);
    await queryClient.prefetchQuery({
      queryKey: ['product', code],
      queryFn: () => getProductDetails(code),
    })
  }

  return {
    productQuery,
    fetchProduct,
  }
}
