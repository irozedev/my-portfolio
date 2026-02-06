import { motion } from "motion/react";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useState } from "react";

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, use proper auth)
    if (password === "admin123") {
      setIsAuthenticated(true);
      // Load projects from localStorage
      const saved = localStorage.getItem("portfolio-projects");
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } else {
      alert("Incorrect password!");
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Login
              </button>
              <a
                href="#home"
                className="block text-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                Back to Home
              </a>
            </form>
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-xs text-yellow-400">
                <strong>Default Password:</strong> admin123
              </p>
              <p className="text-xs text-yellow-400 mt-1">
                ⚠️ Change this in production!
              </p>
            </div>
          </div>
        </motion.div>
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