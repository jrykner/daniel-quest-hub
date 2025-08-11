'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from './Button'
import { Card, CardContent } from './Card'

export function UserProfile() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const getRoleDisplay = (role?: string) => {
    return role === 'PARENT' ? '🎖️ Quest Master' : '⚔️ Quest Hero'
  }

  const getRoleBadgeColor = (role?: string) => {
    return role === 'PARENT' 
      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getRoleBadgeColor(session.user.role)}`}>
              {getRoleDisplay(session.user.role)}
            </div>
            <div>
              <h2 className="font-bold text-white">{session.user.name}</h2>
              <p className="text-sm text-slate-400">{session.user.email}</p>
            </div>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            variant="outline"
            size="sm"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}