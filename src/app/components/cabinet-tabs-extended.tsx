import { motion } from 'motion/react';
import { Clock, CheckCircle2, Briefcase, CreditCard, FileText, Inbox, Calendar, Download, Eye, Send } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

// Interfaces
interface ClientProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number;
  startDate: string;
  deadline: string;
  budget: string;
  milestones: {
    id: string;
    name: string;
    completed: boolean;
    dueDate: string;
  }[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  projectName: string;
  amount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  pdfUrl?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'nda' | 'brief' | 'technical' | 'other';
  uploadDate: string;
  fileUrl: string;
  fileSize: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'client' | 'stepan';
  timestamp: string;
  read: boolean;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'discovery' | 'review' | 'demo' | 'planning';
  status: 'scheduled' | 'completed' | 'cancelled';
  meetLink?: string;
}

// Projects Tab
export function ProjectsTab({ projects }: { projects: ClientProject[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-4">My Projects</h3>
      
      {projects.length > 0 ? (
        projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:border-[#00d9ff]/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[var(--text-primary)] text-base sm:text-lg mb-1">
                  {project.name}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-2">
                  {project.description}
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                project.status === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/30' :
                project.status === 'completed' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                project.status === 'on-hold' ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' :
                'text-red-400 bg-red-400/10 border-red-400/30'
              }`}>
                {project.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-secondary)]">Progress</span>
                <span className="text-xs font-medium text-[var(--text-primary)]">{project.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--text-primary)]">Milestones:</span>
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2 text-xs">
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span className={milestone.completed ? 'text-[var(--text-secondary)] line-through' : 'text-[var(--text-primary)]'}>
                    {milestone.name}
                  </span>
                  <span className="text-[var(--text-secondary)] ml-auto">
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[var(--text-secondary)]">Budget:</span>
                <p className="font-medium text-[var(--text-primary)] mt-1">{project.budget}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Deadline:</span>
                <p className="font-medium text-[var(--text-primary)] mt-1">
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">No active projects</p>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Start a new project by requesting a quote!
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Invoices Tab
export function InvoicesTab({ invoices }: { invoices: Invoice[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-4">Invoices & Payments</h3>
      
      {invoices.length > 0 ? (
        invoices.map((invoice) => (
          <motion.div
            key={invoice.id}
            layout
            className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:border-[#00d9ff]/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[var(--text-primary)] text-base mb-1">
                  {invoice.invoiceNumber}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {invoice.projectName}
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                invoice.status === 'paid' ? 'text-green-400 bg-green-400/10 border-green-400/30' :
                invoice.status === 'pending' ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' :
                'text-red-400 bg-red-400/10 border-red-400/30'
              }`}>
                {invoice.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Amount:</span>
                <span className="text-[var(--text-primary)]">&euro;{invoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Tax (21% BTW):</span>
                <span className="text-[var(--text-primary)]">&euro;{invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="font-medium text-[var(--text-primary)]">Total:</span>
                <span className="font-bold text-[#00d9ff]">&euro;{invoice.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <span className="text-[var(--text-secondary)]">Issue Date:</span>
                <p className="font-medium text-[var(--text-primary)] mt-1">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Due Date:</span>
                <p className="font-medium text-[var(--text-primary)] mt-1">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {invoice.pdfUrl && (
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(invoice.pdfUrl, '_blank')}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-[var(--text-primary)] border border-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  onClick={() => window.open(invoice.pdfUrl, '_blank')}
                  className="flex-1 bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">No invoices yet</p>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Invoices will appear here once projects start
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Documents Tab
export function DocumentsTab({ documents }: { documents: Document[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-4">Documents</h3>
      
      {documents.length > 0 ? (
        documents.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#00d9ff]/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 text-[#00d9ff]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-[var(--text-primary)] truncate mb-1">
                  {doc.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="px-2 py-0.5 bg-white/5 rounded">
                    {doc.type.toUpperCase()}
                  </span>
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
              <Button
                onClick={() => window.open(doc.fileUrl, '_blank')}
                className="bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30 px-3 py-2 flex-shrink-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">No documents yet</p>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Contracts, NDAs and other documents will appear here
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Messages Tab
export function MessagesTab({ 
  messages, 
  newMessage, 
  setNewMessage, 
  setMessages 
}: { 
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
}) {
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: ChatMessage = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'client',
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages([...messages, msg]);
      setNewMessage('');
      toast.success('Message sent!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 h-full flex flex-col"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">Chat with Stepan</h3>
      
      {/* Messages List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-xl ${
                msg.sender === 'client'
                  ? 'bg-[#00d9ff]/20 border border-[#00d9ff]/30 text-[var(--text-primary)]'
                  : 'bg-white/5 border border-white/10 text-[var(--text-primary)]'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">No messages yet</p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Start a conversation!
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2 pt-4 border-t border-white/10">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[#00d9ff] focus:outline-none"
        />
        <Button
          onClick={handleSendMessage}
          className="bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black px-4 py-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// Calendar Tab
export function CalendarTab({ meetings }: { meetings: Meeting[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-4">Meetings & Schedule</h3>
      
      {meetings.length > 0 ? (
        meetings.map((meeting) => (
          <motion.div
            key={meeting.id}
            layout
            className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:border-[#00d9ff]/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[var(--text-primary)] text-base mb-1">
                  {meeting.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{meeting.time}</span>
                  <span>({meeting.duration})</span>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                meeting.status === 'scheduled' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                meeting.status === 'completed' ? 'text-green-400 bg-green-400/10 border-green-400/30' :
                'text-red-400 bg-red-400/10 border-red-400/30'
              }`}>
                {meeting.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                meeting.type === 'discovery' ? 'bg-purple-500/20 text-purple-300' :
                meeting.type === 'review' ? 'bg-blue-500/20 text-blue-300' :
                meeting.type === 'demo' ? 'bg-green-500/20 text-green-300' :
                'bg-amber-500/20 text-amber-300'
              }`}>
                {meeting.type.toUpperCase()}
              </span>
            </div>

            {meeting.meetLink && meeting.status === 'scheduled' && (
              <Button
                onClick={() => window.open(meeting.meetLink, '_blank')}
                className="w-full bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30"
              >
                Join Meeting
              </Button>
            )}
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">No meetings scheduled</p>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Book a call to get started!
          </p>
        </div>
      )}
    </motion.div>
  );
}
