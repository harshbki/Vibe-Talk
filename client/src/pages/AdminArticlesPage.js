import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { createArticle } from '../api';
import { useSeoMeta } from '../utils/seo';

const AdminArticlesPage = () => {
  const [secret, setSecret] = useState(() => sessionStorage.getItem('vtAdminSecret') || '');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useSeoMeta({
    title: 'Admin Articles — Vibe Talk',
    description: 'Vibe Talk internal admin page for publishing articles.',
    canonicalPath: '/admin/articles',
    robots: 'noindex,nofollow',
  });

  const saveSecret = () => {
    sessionStorage.setItem('vtAdminSecret', secret);
    setStatus('Admin key saved for this session.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secret.trim()) {
      setStatus('Enter your admin secret first.');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const article = await createArticle({ title, excerpt, body }, secret.trim());
      setStatus(`Published: /articles/${article.slug}`);
      setTitle('');
      setExcerpt('');
      setBody('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to publish. Check admin secret.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-extrabold mb-2">Manage Articles</h1>
        <p className="text-sm text-base-content/60 mb-6">
          Only you (site admin) can publish articles. Set <code className="text-xs">ADMIN_SECRET</code> in
          Render env, then enter it below.
        </p>

        <div className="card bg-base-200/50 border border-base-200 mb-6">
          <div className="card-body p-4 flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              className="input input-bordered input-sm flex-1"
              placeholder="Admin secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <button type="button" className="btn btn-sm btn-ghost" onClick={saveSecret}>
              Save key
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-control w-full">
            <span className="label-text font-semibold">Title</span>
            <input
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text font-semibold">Excerpt (SEO summary)</span>
            <input
              className="input input-bordered"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={300}
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text font-semibold">Body</span>
            <textarea
              className="textarea textarea-bordered min-h-[200px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm" /> : 'Publish article'}
          </button>
        </form>

        {status && (
          <div className="alert alert-info mt-4 text-sm">
            <span>{status}</span>
            {status.startsWith('Published:') && (
              <Link to={status.replace('Published: ', '')} className="link link-primary ml-2">
                View →
              </Link>
            )}
          </div>
        )}

        <Link to="/articles" className="btn btn-ghost btn-sm mt-6">← Back to articles</Link>
      </div>
    </PublicLayout>
  );
};

export default AdminArticlesPage;
