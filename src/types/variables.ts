  
// for community forum 
export interface User {
  user_id: number;
  username: string;
  email: string;
  location_id: number;
  location_name?: string; // optional if returned from API
  created_at: string;
  auth_uid: string;
}


export interface Location {
  location_id: number;
  location_name: string;
}

export interface Post {
  post_id: number;
  title: string;
  content: string;
  created_at: string;
  user: {
    user_id: number;
    username: string;
    location?: {
      location_id: number;
      location_name: string;
    };
  };
  topic?: string;
  sub_topic?: string;
  likes_count?: number;
  comments_count?: number;
}

export interface CreatePostInput {
  user_id: number;
  title: string;
  content: string;
  topic: string;
  sub_topic?: string;
}

export interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: User;
  likes_count?: number;
}

export interface Like {
  like_id: number;
  user_id: number;
  post_id?: number;
  comment_id?: number;
  created_at: string;
}

export interface Tank {
  id: string;
  name: string;
  description?: string;
  location_id?: string; // optional if returned from API
}