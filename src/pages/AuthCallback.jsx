import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        navigate('/')
      }
    })

    // Fallback: if already signed in, redirect after a short delay
    const timeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('getSession error:', error)
          navigate('/login')
          return
        }
        if (session) navigate('/')
        else navigate('/login')
      })
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <p className="text-slate-400">E-Mail wird bestätigt...</p>
      </div>
    </div>
  )
}
