const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export type RawPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const fetchPosts = async (signal?: AbortSignal): Promise<RawPost[]> => {
  const response = await fetch(POSTS_URL, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<RawPost[]>;
};
