import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { BlogPost, BlogPostFormData, sampleBlogPosts } from '../types/blog.types';

const BLOG_COLLECTION = 'blog';

// Helper to create URL-friendly slug
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Initialize blog with sample posts if empty
export const initializeBlog = async (): Promise<void> => {
  try {
    const snapshot = await getDocs(collection(db, BLOG_COLLECTION));
    
    if (snapshot.empty) {
      for (const post of sampleBlogPosts) {
        await addDoc(collection(db, BLOG_COLLECTION), {
          ...post,
          publishedAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log('Blog initialized with sample posts');
    }
  } catch (error) {
    console.error('Error initializing blog:', error);
  }
};

// Get all published posts
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('status', '==', 'published')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as BlogPost))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error('Error getting published posts:', error);
    throw error;
  }
};

// Get latest posts for homepage
export const getLatestPosts = async (count: number = 3): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('status', '==', 'published')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as BlogPost))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
  } catch (error) {
    console.error('Error getting latest posts:', error);
    throw error;
  }
};

// Get all posts (including drafts - for kitchen)
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const q = query(collection(db, BLOG_COLLECTION), orderBy('publishedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as BlogPost));
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw error;
  }
};

// Get single post by slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      
      // Increment view count
      const views = (doc.data().views || 0) + 1;
      await updateDoc(doc.ref, { views });
      
      return {
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as BlogPost;
    }
    return null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw error;
  }
};

// Get single post by ID
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        publishedAt: docSnap.data().publishedAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      } as BlogPost;
    }
    return null;
  } catch (error) {
    console.error('Error getting post by ID:', error);
    throw error;
  }
};

// Create new post
export const createPost = async (
  postData: BlogPostFormData,
  authorId: string
): Promise<string> => {
  try {
    const slug = createSlug(postData.title);
    
    // Check if slug exists
    const slugQuery = query(
      collection(db, BLOG_COLLECTION),
      where('slug', '==', slug)
    );
    const slugSnapshot = await getDocs(slugQuery);
    
    // If slug exists, append timestamp
    const finalSlug = !slugSnapshot.empty 
      ? `${slug}-${Date.now()}`
      : slug;
    
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...postData,
      slug: finalSlug,
      authorId,
      publishedAt: postData.status === 'published' ? new Date() : null,
      updatedAt: new Date(),
      views: 0
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Update post
export const updatePost = async (id: string, updates: Partial<BlogPostFormData>): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    const updateData: any = {
      ...updates,
      updatedAt: new Date()
    };
    
    // If publishing for first time, set publishedAt
    if (updates.status === 'published') {
      const currentDoc = await getDoc(docRef);
      if (currentDoc.exists() && !currentDoc.data().publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (id: string, imagePath?: string): Promise<void> => {
  try {
    // Delete image from storage if exists
    if (imagePath) {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef).catch(() => console.log('Image not found'));
    }
    
    const docRef = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Toggle post status (publish/unpublish)
export const togglePostStatus = async (id: string, currentStatus: 'draft' | 'published'): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    const updateData: any = {
      status: newStatus,
      updatedAt: new Date()
    };
    
    // If publishing, set publishedAt
    if (newStatus === 'published') {
      updateData.publishedAt = new Date();
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error toggling post status:', error);
    throw error;
  }
};

// Upload blog image
export const uploadBlogImage = async (file: File, postTitle: string): Promise<{ url: string; path: string }> => {
  try {
    const timestamp = Date.now();
    const fileName = `${postTitle.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;
    const storageRef = ref(storage, `blog/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return { url, path: `blog/${fileName}` };
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};
