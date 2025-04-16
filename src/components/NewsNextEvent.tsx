'use client';
import React, { useState } from 'react';
import { useUserStore } from '@/../stores/user-store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaThumbsUp, FaThumbsDown, FaReply, FaTrash } from 'react-icons/fa';

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
  replies: Comment[];
}

function NewsNextEvent() {
  const { user } = useUserStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      content: newComment,
      likes: [],
      dislikes: [],
      createdAt: new Date(),
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      content: replyContent,
      likes: [],
      dislikes: [],
      createdAt: new Date(),
      replies: []
    };

    setComments(comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [reply, ...comment.replies] };
      }
      return comment;
    }));

    setReplyTo(null);
    setReplyContent('');
  };

  const handleLike = (commentId: string) => {
    if (!user) return;

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const likes = comment.likes.includes(user.id)
          ? comment.likes.filter(id => id !== user.id)
          : [...comment.likes, user.id];
        const dislikes = comment.dislikes.filter(id => id !== user.id);
        return { ...comment, likes, dislikes };
      }
      return comment;
    }));
  };

  const handleDislike = (commentId: string) => {
    if (!user) return;

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const dislikes = comment.dislikes.includes(user.id)
          ? comment.dislikes.filter(id => id !== user.id)
          : [...comment.dislikes, user.id];
        const likes = comment.likes.filter(id => id !== user.id);
        return { ...comment, likes, dislikes };
      }
      return comment;
    }));
  };

  const handleDelete = (commentId: string) => {
    if (!user) return;
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="space-y-6 p-4 bg-[#0a0a20]/50 backdrop-blur-sm rounded-xl border border-white/10">
      {/* Comment Input */}
      <div className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-4 bg-[#0a0a20]/80 border border-gray-800 rounded-xl text-white placeholder:text-gray-500 "
        />
        <Button
          onClick={handleComment}
          disabled={!user || !newComment.trim()}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50"
        >
          Post Question
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a20]/80 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-gray-800 hover:border-gray-700/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  {comment.username}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user?.id === comment.userId && (
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <FaTrash size={14} />
                </Button>
              )}
            </div>

            <p className="text-gray-300">{comment.content}</p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-2 hover:bg-blue-500/10 ${
                  comment.likes.includes(user?.id || '') ? 'text-blue-400' : 'text-gray-500'
                }`}
              >
                <FaThumbsUp size={14} />
                <span>{comment.likes.length}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleDislike(comment.id)}
                className={`flex items-center gap-2 hover:bg-red-500/10 ${
                  comment.dislikes.includes(user?.id || '') ? 'text-red-400' : 'text-gray-500'
                }`}
              >
                <FaThumbsDown size={14} />
                <span>{comment.dislikes.length}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setReplyTo(comment.id)}
                className="text-gray-500 hover:text-gray-300 hover:bg-white/5"
              >
                <FaReply size={14} />
              </Button>
            </div>

            {/* Reply Input */}
            {replyTo === comment.id && (
              <div className="space-y-4 pl-8 border-l-2 border-gray-800">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-4 bg-[#0a0a20]/80 border border-gray-800 rounded-xl text-white placeholder:text-gray-500 focus:border-blue-500/50 transition-colors"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50"
                  >
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setReplyTo(null)}
                    className="text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="space-y-4 pl-8 border-l-2 border-gray-800">
                {comment.replies.map(reply => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#0a0a20]/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          {reply.username}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2">{reply.content}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default NewsNextEvent;
