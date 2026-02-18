/**
 * Neighborhood navigation utilities
 * Handles user navigation for neighborhood-related actions
 */

interface User {
  zipcode?: string
  username?: string
  email?: string
}

export const neighborhoodActions = {
  browseFeed: (user: User) => {
    if (user.zipcode) {
      window.location.href = `/posts?zipcode=${encodeURIComponent(user.zipcode)}`
    } else {
      window.location.href = '/posts'
    }
  },

  createPost: () => {
    window.location.href = '/posts#create'
  },

  searchNeighborhood: (user: User) => {
    if (user.zipcode) {
      window.location.href = `/posts?zipcode=${encodeURIComponent(user.zipcode)}`
    }
  },

  viewMyPosts: () => {
    window.location.href = '/posts?my_posts=true'
  },

  updateProfile: () => {
    window.location.href = '/profile'
  },
}
