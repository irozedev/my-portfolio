import { motion } from "motion/react";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ShieldAlert, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import { ModernAuthModal } from "./modern-auth-modal";

// Only this account may open the admin panel. A client-side check alone is not a
// security boundary — anything genuinely sensitive must also be enforced
// server-side (Supabase RLS / edge-function auth check).
const OWNER_EMAIL = "rozedev095@gmail.com";

export function AdminPage() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const isOwner = !!user && user.email?.toLowerCase() === OWNER_EMAIL;

  useEffect(() => {
    if (!isOwner) return;
    try {
      const saved = localStorage.getItem("portfolio-projects");
      if (saved) setProjects(JSON.parse(saved));
    } catch {
      setProjects([]);
    }
  }, [isOwner]);

  const handleSaveProject = (project: any) => {
    let updated;
    if (isAddingNew) {
      updated = [...projects, { ...project, id: Date.now() }];
    } else {
      updated = projects.map(p => p.id === project.id ? project : p);
    }
    setProjects(updated);
    localStorage.setItem("portfolio-projects", JSON.stringify(updated));
    setEditingProject(null);
    setIsAddingNew(false);
  };

  const handleDeleteProject = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem("portfolio-projects", JSON.stringify(updated));
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-[var(--accent-primary)]" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Restricted area</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              {user
                ? "This account does not have access to the admin panel."
                : "Sign in with the owner account to continue."}
            </p>

            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3 mb-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            )}

            <a
              href="#home"
              className="block text-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Back to Home
            </a>
          </div>
        </motion.div>

        <ModernAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-hover)] mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </a>
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-[var(--text-muted)] mt-2">Manage your portfolio projects</p>
          </div>
          <motion.button
            onClick={() => {
              setIsAddingNew(true);
              setEditingProject({
                title: "",
                description: "",
                image: "",
                tags: [],
                demoUrl: "",
                githubUrl: "",
                stats: { clients: 0, revenue: 0, rating: 0 }
              });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Add New Project
          </motion.button>
        </div>

        {/* Projects List */}
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl">
              <p className="text-[var(--text-muted)]">No projects yet. Add your first project!</p>
            </div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-[var(--text-secondary)] mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-lg text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setIsAddingNew(false);
                      }}
                      className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {isAddingNew ? "Add New Project" : "Edit Project"}
                </h2>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsAddingNew(false);
                  }}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProject(editingProject);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject.tags?.join(", ") || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(",").map((t: string) => t.trim()) })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="React, Next.js, TypeScript"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Demo URL</label>
                    <input
                      type="url"
                      value={editingProject.demoUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={editingProject.githubUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsAddingNew(false);
                    }}
                    className="px-6 py-3 border-2 border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}