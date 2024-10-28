'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { usePathname } from 'next/navigation'
import { PenLine } from 'lucide-react'
import { AuthButton } from '@/components/auth-button'

export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <PenLine className="h-6 w-6" />
          <span className="font-semibold text-lg">AI IELTS Practice</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/practice/academic">
            <Button variant={pathname.includes('academic') ? 'default' : 'ghost'}>
              Academic
            </Button>
          </Link>
          <Link href="/practice/general">
            <Button variant={pathname.includes('general') ? 'default' : 'ghost'}>
              General
            </Button>
          </Link>
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}