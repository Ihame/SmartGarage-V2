
import React, { useContext, useState, useEffect } from 'react';
import { AppView, CommunityPost as PostType, AuthStatus, UserProfile } from '../types';
import Button from './common/Button';
import { AuthContext, CommunityContext, LanguageContext } from '../App';
import { ArrowLeftIcon, PlusCircleIcon, UserIcon, InformationCircleIcon, RpmSpinnerIcon } from './common/Icon';
// Supabase client is not directly used here if context provides all necessary functions.

interface CommunityHubProps {
  onNavigate: (view: AppView) => void;
}

const PostCard: React.FC<{ post: PostType, translate: (key: string) => string }> = ({ post, translate }) => {
  return (
    <div className="bg-slate-700/70 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-3">
        <UserIcon className="w-8 h-8 text-sky-400 rounded-full mr-3 flex-shrink-0"/>
        <div>
          <p className="font-semibold text-sky-300 text-sm">{post.author_name || 'Anonymous'}</p>
          <p className="text-xs text-slate-400">
            {post.created_at ? new Date(post.created_at).toLocaleString() : 'Just now'}
          </p>
        </div>
      </div>
      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
    </div>
  );
};


const CommunityHub: React.FC<CommunityHubProps> = ({ onNavigate }) => {
  const { translate } = useContext(LanguageContext);
  const { authStatus, currentUser } = useContext(AuthContext); // currentUser is UserProfile
  const { posts, addPost, fetchPosts, isLoadingPosts } = useContext(CommunityContext);
  
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postError, setPostError] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  useEffect(() => {
    // fetchPosts is called from App.tsx context provider already
    // If you need to re-fetch under specific conditions here, you can call it.
  }, []);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) {
      setPostError(translate('postContentEmpty'));
      return;
    }
    if (!currentUser?.id) {
        setPostError(translate('authError', "You must be logged in to post."));
        return;
    }
    setPostError('');
    setIsSubmittingPost(true);
    const newPost = await addPost(newPostContent, currentUser.id, currentUser.full_name || currentUser.email);
    setIsSubmittingPost(false);
    if (newPost) {
        setNewPostContent('');
        setIsCreatingPost(false); 
        // fetchPosts(); // Optionally re-fetch all posts or rely on context update
    } else {
        setPostError(translate('errorOccurred', "Failed to submit post. Please try again."));
    }
  };

  const handleCreatePostClick = () => {
    if (authStatus === AuthStatus.AUTHENTICATED) {
      setIsCreatingPost(prev => !prev);
      setPostError(''); // Clear error when toggling form
    } else {
      onNavigate(AppView.AUTH); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 min-h-[calc(100vh-10rem)]">
        <Button variant="ghost" size="sm" onClick={() => onNavigate(AppView.LANDING)} className="mb-6 flex items-center group text-slate-400 hover:text-emerald-400">
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-emerald-400 transition-colors" />
            {translate('backToHome')}
        </Button>

      <div className="bg-slate-800 shadow-xl rounded-xl p-5 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-700">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2 sm:mb-0">{translate('communityHubTitle')}</h1>
          <Button 
            onClick={handleCreatePostClick} 
            variant={isCreatingPost ? "ghost" : "primary"}
            size="sm"
            leftIcon={<PlusCircleIcon className="w-4 h-4"/>}
            disabled={isSubmittingPost}
          >
            {isCreatingPost ? translate('cancelPost') : translate('createPost')}
          </Button>
        </div>

        {authStatus !== AuthStatus.AUTHENTICATED && (
          <div className="mb-6 p-4 bg-sky-800/30 border border-sky-700 rounded-lg text-sm text-sky-200 flex items-start">
            <InformationCircleIcon className="w-5 h-5 mr-2.5 flex-shrink-0 mt-0.5 text-sky-400"/>
            <div>
              <p className="font-semibold">{translate('loginToEngage')}</p>
              <p>{translate('communitySignInBenefits')}</p>
              <Button size="sm" variant="accent" className="mt-2 text-xs py-1 px-2" onClick={()=> onNavigate(AppView.AUTH)}>
                {translate('loginOrRegister')}
              </Button>
            </div>
          </div>
        )}

        {isCreatingPost && authStatus === AuthStatus.AUTHENTICATED && (
          <div className="mb-8 p-5 bg-slate-700/50 rounded-lg">
            <textarea
              value={newPostContent}
              onChange={(e) => { setNewPostContent(e.target.value); setPostError(''); }}
              placeholder={translate('postContentPlaceholder')}
              rows={4}
              className="w-full bg-slate-600 border-slate-500 rounded-md p-3 text-sm text-white focus:ring-emerald-500 focus:border-emerald-500"
              disabled={isSubmittingPost}
            />
            {postError && <p className="text-red-400 text-xs mt-1">{postError}</p>}
            <div className="mt-3 flex justify-end">
              <Button onClick={handlePostSubmit} size="md" variant="secondary" isLoading={isSubmittingPost} disabled={isSubmittingPost}>
                {translate('submitPost')}
              </Button>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold text-white mb-4">{translate('recentPosts')}</h2>
        {isLoadingPosts ? (
          <div className="text-center py-10">
            <RpmSpinnerIcon className="w-12 h-12 text-sky-400 mx-auto" />
            <p className="text-slate-400 mt-2">{translate('loadingPosts', 'Loading posts...')}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-5">
            {posts.map(post => <PostCard key={post.id} post={post} translate={translate} />)}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">{translate('noPostsYet')}</p>
        )}
      </div>
    </div>
  );
};

export default CommunityHub;
