import { useState, useEffect } from 'react';
import { BlogPost } from '../../types/blog.types';
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
  uploadBlogImage,
  initializeBlog
} from '../../services/blogService';
import { useAuth } from '../../contexts/AuthContext';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const BlogManagement = () => {
  const { user, userData } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    imagePath: '',
    author: userData?.displayName || 'Kitchen Staff',
    status: 'draft' as 'draft' | 'published',
    tags: [] as string[]
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      await initializeBlog(); // Initialize with sample posts if empty
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      let imageUrl = editingPost?.featuredImage || '';
      let imagePath = editingPost?.imagePath || '';

      // Upload image if selected
      if (imageFile) {
        const uploadResult = await uploadBlogImage(imageFile, formData.title);
        imageUrl = uploadResult.url;
        imagePath = uploadResult.path;
      }

      const postData = {
        ...formData,
        featuredImage: imageUrl,
        imagePath,
      };

      if (editingPost) {
        await updatePost(editingPost.id, postData);
        toast.success('Post updated successfully');
      } else {
        await createPost(postData, user.uid);
        toast.success('Post created successfully');
      }

      loadPosts();
      closeModal();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async (id: string, imagePath?: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id, imagePath);
        toast.success('Post deleted successfully');
        loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'draft' | 'published') => {
    try {
      await togglePostStatus(id, currentStatus);
      toast.success(`Post ${currentStatus === 'published' ? 'unpublished' : 'published'} successfully`);
      loadPosts();
    } catch (error) {
      console.error('Error toggling post status:', error);
      toast.error('Failed to update post status');
    }
  };

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        imagePath: post.imagePath || '',
        author: post.author,
        status: post.status,
        tags: post.tags || []
      });
      setImagePreview(post.featuredImage || '');
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        imagePath: '',
        author: userData?.displayName || 'Kitchen Staff',
        status: 'draft',
        tags: []
      });
      setImagePreview('');
      setImageFile(null);
    }
    setPreviewMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setImageFile(null);
    setImagePreview('');
    setPreviewMode(false);
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-melt-charcoal">Blog Management</h1>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {post.featuredImage ? (
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="h-10 w-10 rounded object-cover mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                        📝
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{post.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(post.publishedAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(post.id, post.status)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.status === 'published' ? (
                      <EyeIcon className="h-3 w-3" />
                    ) : (
                      <EyeSlashIcon className="h-3 w-3" />
                    )}
                    <span className="capitalize">{post.status}</span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{post.views || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openModal(post)}
                    className="text-melt-gold hover:text-melt-red mr-3"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.imagePath)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-melt-red hover:text-melt-gold"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="p-6">
                <div className="prose max-w-none">
                  <h1>{formData.title || 'Untitled'}</h1>
                  <p className="text-gray-500">By {formData.author}</p>
                  {formData.featuredImage && (
                    <img src={formData.featuredImage} alt={formData.title} className="w-full rounded-lg" />
                  )}
                  <div className="bg-gray-100 p-4 rounded italic">
                    {formData.excerpt || 'No excerpt'}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {formData.content || 'No content'}
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="mt-4">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-block bg-gray-200 px-2 py-1 rounded text-sm mr-2">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <PhotoIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-melt-gold file:text-melt-charcoal hover:file:bg-opacity-90"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
                    placeholder="Enter post title"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Short description) *
                  </label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
                    placeholder="Brief summary of the post..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold font-mono"
                    placeholder="Write your post content here..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-grow p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
                      placeholder="Enter a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-secondary px-4 py-2"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' })}
                        className="mr-2"
                      />
                      <span className="flex items-center">
                        <EyeSlashIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        Draft
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="published"
                        checked={formData.status === 'published'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' })}
                        className="mr-2"
                      />
                      <span className="flex items-center">
                        <EyeIcon className="h-4 w-4 text-green-500 mr-1" />
                        Publish
                      </span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2"
                  >
                    {editingPost ? 'Update' : 'Create'} Post
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;