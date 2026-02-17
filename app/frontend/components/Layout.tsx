import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Layout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  The Network Index
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <span className="text-gray-700 px-3 py-2 text-sm">
                        {user?.username || user?.email || 'User'}
                      </span>
                      <button
                        onClick={logout}
                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 The Network Index. Built with React, Vite, and Rails.
          </p>
        </div>
      </footer>
    </div>
  )
}
