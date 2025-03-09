export const saveToLocalStorage = <T>(key: string, data: T): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }
}

export const loadFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) as T : null
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return null
    }
  }
  return null
}

