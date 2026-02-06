'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated')
    
    if (auth !== 'true') {
      router.replace('/admin/login')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  return isAuthorized
}