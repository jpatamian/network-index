import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {isAuthenticated ? `Welcome back, ${user?.username || user?.email}!` : 'Welcome to The Network Index'}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {isAuthenticated
              ? 'Your community networking platform'
              : 'A community networking platform for mutual aid and resource sharing in your neighborhood.'}
          </p>

          {!isAuthenticated && (
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>

        {isAuthenticated && user && (
          <div className="mt-12 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.username || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Zipcode</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.zipcode}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.anonymous ? 'Anonymous' : 'Authenticated'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
