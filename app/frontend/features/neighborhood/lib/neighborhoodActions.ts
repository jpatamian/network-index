/**
 * Neighborhood navigation utilities
 * Handles user navigation for neighborhood-related actions
 */
import { NeighborhoodUser } from '@/types/user'

export const neighborhoodActions = {
  browseFeed: (user: NeighborhoodUser) => {
    if (user.zipcode) {
      window.location.href = `/posts?zipcode=${encodeURIComponent(user.zipcode)}`
    } else {
      window.location.href = '/posts'
    }
  },

  createPost: () => {
    window.location.href = '/posts/new'
  },

  searchNeighborhood: (user: NeighborhoodUser) => {
    if (user.zipcode) {
      window.location.href = `/posts?zipcode=${encodeURIComponent(user.zipcode)}`
    }
  },

  viewMyPosts: () => {
    window.location.href = '/posts?filter=mine'
  },


  updateProfile: () => {
    window.location.href = '/profile'
  },
}
