/**
 * Neighborhood navigation utilities
 * Handles user navigation for neighborhood-related actions
 */
import { NavigateFunction } from "react-router-dom";
import { NeighborhoodUser } from "@/types/user";

export const neighborhoodActions = {
  browseFeed: (navigate: NavigateFunction, user: NeighborhoodUser) => {
    if (user.zipcode) {
      navigate(`/posts?zipcode=${encodeURIComponent(user.zipcode)}`);
    } else {
      navigate("/posts");
    }
  },

  createPost: (navigate: NavigateFunction) => {
    navigate("/posts/new");
  },

  searchNeighborhood: (navigate: NavigateFunction, user: NeighborhoodUser) => {
    if (user.zipcode) {
      navigate(`/posts?zipcode=${encodeURIComponent(user.zipcode)}`);
    }
  },

  viewMyPosts: (navigate: NavigateFunction) => {
    navigate("/posts?filter=mine");
  },

  updateProfile: (navigate: NavigateFunction) => {
    navigate("/profile");
  },
};
