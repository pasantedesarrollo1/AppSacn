import { defineStore } from "pinia"
import { ref } from "vue"

export const useConfigStore = defineStore("config", () => {
  const ruc = ref(localStorage.getItem("app_ruc") || "")
  const isConfigured = ref(!!localStorage.getItem("app_ruc"))

  function setRuc(value: string) {
    ruc.value = value
    localStorage.setItem("app_ruc", value)
    isConfigured.value = true
  }

  function clearRuc() {
    ruc.value = ""
    localStorage.removeItem("app_ruc")
    isConfigured.value = false
  }

  return {
    ruc,
    isConfigured,
    setRuc,
    clearRuc,
  }
})

