'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export default function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'CHILD'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        redirect: false,
      })

      console.log('SignIn result:', result)

      if (result?.ok) {
        router.push('/')
      } else {
        console.error('Sign in failed:', result?.error)
        alert(`Sign in failed: ${result?.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🎮 Quest Hub
            </h1>
            <p className="text-slate-400 mt-2">Join Daniel&apos;s family quest system</p>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Role
              </label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={[
                  { value: 'CHILD', label: 'Quest Hero (Child)' },
                  { value: 'PARENT', label: 'Quest Master (Parent)' }
                ]}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Joining Quest...' : 'Enter Quest Hub'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}