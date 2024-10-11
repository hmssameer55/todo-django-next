'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Cookies from 'js-cookie'
import { LayoutGrid, LogIn, UserPlus } from 'lucide-react'

export default function AuthPage() {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

  const [isSignIn, setIsSignIn] = useState(true)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin') // Control the active tab state

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = e.currentTarget

    const username = data.username.value
    const password = data.password.value

    try {
      const response = await fetch(backendURL + '/api-token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const { token } = await response.json()

      if (token) {
        Cookies.set('token', token)
        window.location.href = '/'
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = e.currentTarget

    const username = data.username.value
    const email = data.email.value
    const password = data.password.value
    const first_name = 'test'
    const last_name = 'test'

    try {
      const response = await fetch(backendURL + '/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name,
          last_name,
        }),
      })
      const { token } = await response.json()
      if (token) {
        Cookies.set('token', token)
        window.location.href = '/'
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <LayoutGrid className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-blue-600 ml-4">NexDjango Tasks</h1>
        </div>
        <Card className="w-full">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center text-blue-100">
              {isSignIn
                ? 'Enter your credentials to access your account'
                : 'Sign up to start managing your tasks'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
		  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="signin"
                  onClick={() => {
                    setIsSignIn(true)
                    setActiveTab('signin')
                  }}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  onClick={() => {
                    setIsSignIn(false)
                    setActiveTab('signup')
                  }}
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username">Username</Label>
                    <Input id="signin-username" name="username" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input id="signup-username" name="username" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg">
            <p className="text-sm text-gray-500 w-full text-center">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsSignIn(!isSignIn)
                  setActiveTab(isSignIn ? 'signup' : 'signin') // Toggle the active tab
                }}
                className="text-blue-500 hover:underline"
              >
                {isSignIn ? 'Sign up' : 'Sign in'}
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
