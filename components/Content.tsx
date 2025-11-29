import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Theme } from '../types';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowUpRight, 
  MapPin,
  BookOpen,
  Briefcase,
  X,
  Link as LinkIcon,
  Award,
  Zap,
  Code2,
  Terminal,
  Cpu,
  Globe,
  Database,
  Cloud,
  ChevronRight,
  Download,
  FileText,
  Eye,
  Copy,
  Check
} from 'lucide-react';

interface ContentProps {
  theme: Theme;
}

// --- Helper Components ---

const CopyButton = ({ text, isDark }: { text: string, isDark: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
      <span className="font-bold text-sm">{copied ? "Copied" : "Copy"}</span>
    </motion.button>
  );
};

const Badge = ({ text, isDark }: { text: string; isDark: boolean }) => (
  <span className={`px-2 py-1 rounded text-xs font-bold border ${
    isDark 
      ? 'bg-neutral-800 border-neutral-700 text-neutral-300' 
      : 'bg-gray-100 border-gray-200 text-gray-700'
  }`}>
    {text}
  </span>
);

const SocialPill = ({ href, icon, label, isDark }: { href: string; icon: React.ReactNode; label: string; isDark: boolean }) => (
  <motion.a 
    href={href} 
    target="_blank" 
    rel="noreferrer"
    initial="initial"
    whileHover="hover"
    className={`flex items-center gap-2 p-1 rounded-full text-xs font-bold border transition-colors overflow-hidden ${
      isDark 
        ? 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white' 
        : 'border-black/5 bg-black/5 text-neutral-700 hover:bg-black/10 hover:text-black'
    }`}
  >
    <motion.div
      className={`p-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
      variants={{
        initial: { rotate: 0 },
        hover: { rotate: 360 }
      }}
      transition={{ duration: 0.5, ease: "circOut" }}
    >
      {icon}
    </motion.div>
    <motion.span
      variants={{
        initial: { width: 0, opacity: 0, marginRight: 0 },
        hover: { width: "auto", opacity: 1, marginRight: 8 }
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="whitespace-nowrap overflow-hidden"
    >
      {label}
    </motion.span>
  </motion.a>
);

const SpotlightCard = ({ theme, className = "", children }: { theme: Theme; className?: string; children: React.ReactNode }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`relative rounded-3xl overflow-hidden border transition-colors duration-500 group ${
      isDark 
        ? 'bg-[#111] border-white/10 hover:border-white/20' 
        : 'bg-white border-black/5 hover:border-black/10'
    } ${className}`}>
      {/* Dynamic Cursor Gradient would be applied by parent/global styles if utilizing standard CSS vars, 
          or we can keep the pure CSS hover effect from previous iterations */}
      <div 
        className="absolute -inset-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(
            600px circle at var(--cursor-x) var(--cursor-y), 
            ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(0,0,0,0.15)'}, 
            transparent 40%
          )`,
          backgroundAttachment: 'fixed'
        }} 
      />
      <div className={`relative h-full rounded-3xl overflow-hidden bg-transparent z-10`}>
         {children}
      </div>
    </div>
  );
};

const ShimmerButton = ({ children, onClick, className, isDark }: { children: React.ReactNode, onClick?: () => void, className?: string, isDark: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative overflow-hidden ${className}`}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    <div className={`absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent z-0`} />
    <style>{`
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `}</style>
  </motion.button>
);

const MoreButton = ({ isDark }: { isDark: boolean }) => (
  <div className={`mt-auto pt-4 flex items-center justify-between text-xs font-bold ${isDark ? 'text-neutral-500 group-hover:text-indigo-400' : 'text-neutral-400 group-hover:text-indigo-600'} transition-colors`}>
    <span className="uppercase tracking-wider">More Details</span>
    <motion.div 
      className={`p-1 rounded-full ${isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-black/5 group-hover:bg-black/10'} transition-colors`}
      initial={{ x: 0 }}
      whileHover={{ x: 3 }}
    >
       <ChevronRight size={14} />
    </motion.div>
  </div>
);

// Data structures for the Expanded View
const getCardDetails = (isDark: boolean): Record<string, any> => ({
  "contact": {
    title: "Let's Connect",
    description: "I'm always open to discussing Generative AI, LLMs, or full-stack engineering opportunities.",
    content: (
      <div className="space-y-6">
        <p className="text-lg opacity-90">
            Seeking opportunities to apply and expand technical skills in a dynamic environment. 
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <div className="p-6 rounded-2xl border border-dashed border-gray-500/30 bg-gray-500/5">
            <h4 className="text-sm font-bold uppercase tracking-wider opacity-60 mb-4">Contact Details</h4>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Mail size={24} />
                    </div>
                    <span className="font-mono text-xl md:text-2xl font-bold">subhanprsnl@gmail.com</span>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <CopyButton text="subhanprsnl@gmail.com" isDark={isDark} />
                    <ShimmerButton 
                        isDark={isDark}
                        className={`flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors`}
                    >
                        <a href="mailto:subhanprsnl@gmail.com" className="flex items-center gap-2">
                           <ArrowUpRight size={20} /> Write Email
                        </a>
                    </ShimmerButton>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <motion.a 
                whileHover={{ y: -4, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                href="https://linkedin.com" target="_blank" rel="noreferrer" className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                <Linkedin size={24} className="text-[#0077b5]" />
                <div>
                    <h4 className="font-bold">LinkedIn</h4>
                    <p className="text-xs opacity-70">Professional Network</p>
                </div>
             </motion.a>
             <motion.a 
                whileHover={{ y: -4, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                href="https://github.com/Subhan-code" target="_blank" rel="noreferrer" className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                <Github size={24} />
                <div>
                    <h4 className="font-bold">GitHub</h4>
                    <p className="text-xs opacity-70">Code & Contributions</p>
                </div>
             </motion.a>
        </div>
      </div>
    )
  },
  "resume": {
    title: "Resume / CV",
    subtitle: "Professional Journey",
    description: "A comprehensive overview of my experience, technical skills, and academic background.",
    content: (
        <div className="space-y-8">
            <div className={`p-8 rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/10' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-black/5'}`}>
                <div className="flex items-start gap-4">
                    <FileText size={48} className="text-indigo-500 shrink-0" />
                    <div>
                        <h4 className="text-xl font-bold mb-2">Syed Subhan Uddin_Resume.pdf</h4>
                        <p className="opacity-80 mb-6 max-w-lg">
                            Includes detailed breakdowns of my internship at IBM, deployment projects with AWS/Docker, and my work with Generative AI agents.
                        </p>
                        <div className="flex flex-wrap gap-4">
                             <a href="/resume.pdf" download className="contents">
                                <ShimmerButton isDark={isDark} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
                                    <Download size={20} /> Download PDF
                                </ShimmerButton>
                            </a>
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="/resume.pdf" 
                                target="_blank" 
                                className={`px-6 py-3 rounded-xl font-bold border flex items-center gap-2 transition-colors ${isDark ? 'border-white/20 hover:bg-white/10' : 'border-black/10 hover:bg-black/5'}`}
                            >
                                <Eye size={20} /> View Preview
                            </motion.a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 className="font-bold text-lg mb-4 border-b border-dashed border-gray-500/30 pb-2">Key Highlights</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['CGPA 8.53', 'Google Arcade Ranger', 'Buildspace Alumni', 'AWS Certified Cloud Practitioner', 'IBM AI/ML Intern'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 opacity-80">
                            <Check size={16} className="text-green-500" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
  },
  "devops": {
    title: "AWS & Docker DevOps",
    subtitle: "Containerized Application Deployment",
    description: "Orchestrated a complete CI/CD pipeline using AWS DevOps tools and Docker containers.",
    tags: ["Docker", "AWS ECS/EKS", "CodePipeline", "CloudWatch"],
    content: (
        <div className="space-y-4">
            <p>Designed a robust deployment architecture to automate application delivery.</p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
                <li>Containerized applications using Docker for consistent environments.</li>
                <li>Automated deployment with AWS CodeBuild, CodePipeline, and ECR.</li>
                <li>Managed orchestration using ECS/EKS.</li>
                <li>Leveraged CloudWatch for real-time monitoring and logging.</li>
            </ul>
        </div>
    )
  },
  "no2": {
    title: "NO₂ Prediction Platform",
    subtitle: "ML Model & Visualization",
    description: "Developed a Python ML model and Flask API with a React interface to predict and visualize nitrogen dioxide pollution levels.",
    tags: ["Python", "Machine Learning", "Flask", "ReactJS"],
    content: (
        <div className="space-y-4">
            <p>Bridged the gap between Data Science and Web Development.</p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
                <li>Built a predictive ML model with high accuracy.</li>
                <li>Exposed model via Flask API endpoints.</li>
                <li>Created an interactive ReactJS frontend for data visualization.</li>
            </ul>
        </div>
    )
  },
  "disaster": {
    title: "Disaster Info System",
    subtitle: "Real-Time Aggregation",
    description: "Built a real-time disaster data system using APIs, ReactJS, and cloud deployment to enhance NDRF’s response capabilities.",
    tags: ["ReactJS", "APIs", "Cloud Deployment"],
    content: (
        <div className="space-y-4">
            <p>A mission-critical application focused on speed and reliability.</p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
                <li>Aggregated data from multiple real-time APIs.</li>
                <li>Optimized UI for rapid information consumption.</li>
                <li>Deployed on cloud infrastructure for high availability.</li>
            </ul>
        </div>
    )
  },
  "experience": {
    title: "IBM SkillsBuild",
    subtitle: "AI/ML Intern",
    date: "Jun 2024 - Jul 2024",
    content: (
        <div className="space-y-4">
            <p>Remote internship focusing on scalable AI solutions.</p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
                <li>Developed and deployed an AI chatbot using IBM Watson on IBM Cloud.</li>
                <li>Built a Diabetes Prediction ML model with 85% accuracy using real-world healthcare datasets.</li>
                <li>Collaborated in a cross-functional Agile team of 5 to design scalable AI solutions.</li>
            </ul>
        </div>
    )
  },
  "education": {
    title: "CMR Engineering College",
    subtitle: "B.Tech – CSE (Data Science)",
    date: "Nov 2022 – Present",
    content: (
        <div className="space-y-4">
            <p>Strong foundation in Data Science and Core Engineering.</p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
                <li>CGPA: 8.53</li>
                <li>Certifications: Google Cybersecurity, Postman API</li>
                <li>Core Competencies: Problem-solving, collaboration, analytical thinking.</li>
            </ul>
        </div>
    )
  },
  "genai": {
    title: "Generative AI Focus",
    subtitle: "LLMs & RAG Architectures",
    description: "Currently exploring the frontiers of Large Language Models, Vector Databases, and Agentic Workflows.",
    tags: ["LangChain", "OpenAI API", "Hugging Face", "Pinecone"],
    content: (
        <div className="space-y-4">
            <p>My current research and development focus is on:</p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
                <li>Building RAG (Retrieval-Augmented Generation) pipelines for custom knowledge bases.</li>
                <li>Fine-tuning open-source models (Llama 3, Mistral) for specific domain tasks.</li>
                <li>Developing autonomous agents using LangGraph.</li>
            </ul>
        </div>
    )
  },
  "certs": {
    title: "Certifications & Achievements",
    subtitle: "Credentials & Milestones",
    content: (
        <div className="space-y-6">
            <div className="space-y-4">
                 <h4 className="font-bold text-lg border-b border-dashed border-gray-500/30 pb-2">Achievements</h4>
                 <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={18} className="text-yellow-500" />
                        <h4 className="font-bold">Buildspace Nights & Weekends S5</h4>
                    </div>
                    <p className="text-sm opacity-80">Successfully completed the 6-week intensive builder cohort, launching real products and iterating based on user feedback.</p>
                </div>
                 <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <Award size={18} className="text-blue-400" />
                        <h4 className="font-bold">Google Arcade Skillboost</h4>
                    </div>
                    <p className="text-sm opacity-80">Achieved <span className="font-bold text-blue-400">Arcade Ranger</span> status. Mastered cloud computing fundamentals, GenAI tools, and infrastructure modernization on Google Cloud.</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-lg border-b border-dashed border-gray-500/30 pb-2">Professional Certifications</h4>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold">Google Cybersecurity</h4>
                    <p className="text-sm opacity-70">Network security, system protection, and cyber defense strategies.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold">Postman API Expert</h4>
                    <p className="text-sm opacity-70">Hands-on API development, testing, and automation.</p>
                </div>
            </div>
        </div>
    )
  },
  "skills": {
      title: "Technical Expertise",
      subtitle: "Full Stack & Data Science",
      description: "A comprehensive breakdown of my technical toolkit, ranging from core programming to advanced AI implementation.",
      tags: ["Full Stack", "Data Science", "DevOps"],
      content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                  <div>
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Code2 size={16} /> Languages</h4>
                      <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Python (Advanced)</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">JavaScript/TypeScript</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Java (Core)</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">C++</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">SQL</span>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Globe size={16} /> Web Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">ReactJS</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Next.js</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Flask/FastAPI</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">HTML5/CSS3</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Tailwind CSS</span>
                      </div>
                  </div>
                   <div>
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Database size={16} /> Databases</h4>
                      <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">MongoDB</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">PostgreSQL</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">MySQL</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Vector DBs (Pinecone)</span>
                      </div>
                  </div>
              </div>
              <div className="space-y-4">
                   <div>
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Cpu size={16} /> AI / ML</h4>
                      <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">TensorFlow</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">PyTorch</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">LangChain</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Hugging Face</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">OpenCV</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">RAG</span>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Cloud size={16} /> DevOps & Cloud</h4>
                      <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Docker</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">AWS (EC2, S3, ECR)</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Git/GitHub</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Linux</span>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Terminal size={16} /> Core Concepts</h4>
                      <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">Data Structures & Algo</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">OOPs</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">DBMS</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-sm">SDLC</span>
                      </div>
                  </div>
              </div>
          </div>
      )
  }
});

const Content: React.FC<ContentProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const pageBg = isDark ? 'bg-black' : 'bg-white';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Get data based on current theme
  const cardDetails = useMemo(() => getCardDetails(isDark), [isDark]);

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleCardClick = (id: string) => {
    if (cardDetails[id]) {
      setSelectedId(id);
    }
  };

  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-700 font-sans selection:bg-indigo-500/30`}>
      <div className="w-[90%] md:w-[80%] mx-auto py-12 lg:py-20 relative z-10">
        
        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]"
        >
          
          {/* --- ROW 1 --- */}
          {/* HEADER */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-8 p-4 md:p-8 flex flex-col justify-center min-h-[300px]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`}></span>
                </span>
                <span className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  Data Science & GenAI
                </span>
              </div>
              
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-none ${isDark ? 'text-white' : 'text-black'}`}>
                Syed Subhan Uddin
              </h1>
              <p className={`text-lg font-mono mb-6 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>GenAI Engineer & Full Stack Dev</p>
              
              <p className={`text-xl md:text-2xl font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'} max-w-3xl leading-relaxed`}>
                Architecting intelligent systems with <span className={isDark ? 'text-white' : 'text-black'}>Generative AI</span> and 
                <span className={isDark ? 'text-white' : 'text-black'}> Large Language Models</span>. 
                I turn complex data into <span className={isDark ? 'text-white' : 'text-black'}>autonomous, scalable solutions</span> that solve real-world problems.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 items-center">
               <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-colors ${isDark ? 'border-white/10 bg-white/5 text-neutral-300' : 'border-black/5 bg-black/5 text-neutral-700'}`}>
                <MapPin size={14} />
                Hyderabad, India
              </div>
              <SocialPill href="mailto:subhanprsnl@gmail.com" icon={<Mail size={18} />} label="Email" isDark={isDark} />
              <SocialPill href="https://github.com/Subhan-code" icon={<Github size={18} />} label="GitHub" isDark={isDark} />
              <SocialPill href="https://linkedin.com" icon={<Linkedin size={18} />} label="LinkedIn" isDark={isDark} />
            </div>
          </motion.div>

          {/* PROFILE PICTURE */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-4 h-full min-h-[300px]">
            <SpotlightCard theme={theme} className="h-full">
              <div className="absolute inset-0 p-0">
                <div className="w-full h-full relative overflow-hidden bg-black">
                  <img 
                    src="https://i.pinimg.com/originals/d9/f6/b7/d9f6b7bed716e54bf9ee96f74da84c14.gif" 
                    alt="Avatar" 
                    className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </SpotlightCard>
          </motion.div>


          {/* --- ROW 2 --- */}
          {/* EXPERIENCE */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-4" onClick={() => handleCardClick('experience')}>
            <SpotlightCard theme={theme} className="h-full cursor-pointer">
               <motion.div 
                 whileHover={{ y: -5 }}
                 whileTap={{ scale: 0.98 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 className="p-8 flex flex-col justify-between h-full group"
               >
                 <div>
                    <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Experience</span>
                    <div className="mt-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                            <Briefcase size={24} className={isDark ? 'text-white' : 'text-black'} />
                        </div>
                        <div>
                            <h3 className={`font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>IBM SkillsBuild</h3>
                            <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>AI/ML Intern</p>
                        </div>
                    </div>
                 </div>
                 <div className="mt-6">
                    <p className={`text-xs font-bold mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Jun 2024 - Jul 2024</p>
                    <MoreButton isDark={isDark} />
                 </div>
               </motion.div>
            </SpotlightCard>
          </motion.div>

          {/* EDUCATION */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-4" onClick={() => handleCardClick('education')}>
             <SpotlightCard theme={theme} className="h-full cursor-pointer">
                <motion.div 
                   whileHover={{ y: -5 }}
                   whileTap={{ scale: 0.98 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="p-8 flex flex-col justify-between h-full group"
                >
                    <div>
                        <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Education</span>
                        <div className="mt-4 flex gap-3">
                             <div className={`p-3 h-fit rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                                <BookOpen size={20} className={isDark ? 'text-white' : 'text-black'} />
                             </div>
                             <div>
                                <h3 className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>CMR Eng. College</h3>
                                <p className={`text-xs font-medium mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>B.Tech CSE (Data Science)</p>
                             </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className={`pt-4 border-t ${isDark ? 'border-white/5' : 'border-black/5'} flex justify-between mb-2`}>
                            <span className={`text-xs font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>2022 - Present</span>
                            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-black'}`}>CGPA: 8.53</span>
                        </div>
                        <MoreButton isDark={isDark} />
                    </div>
                </motion.div>
             </SpotlightCard>
          </motion.div>

          {/* DEVOPS PROJECT */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-4" onClick={() => handleCardClick('devops')}>
            <SpotlightCard theme={theme} className="h-full cursor-pointer">
              <motion.div 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-8 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Project</span>
                    <Badge text="Cloud" isDark={isDark} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>AWS DevOps</h3>
                  <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'} line-clamp-3`}>
                    Containerized application deployment with Docker, ECR, and ECS/EKS.
                  </p>
                </div>
                <div className="mt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge text="Docker" isDark={isDark} />
                        <Badge text="AWS" isDark={isDark} />
                    </div>
                    <MoreButton isDark={isDark} />
                </div>
              </motion.div>
            </SpotlightCard>
          </motion.div>


          {/* --- ROW 3 --- */}
          {/* SKILLS */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-4" onClick={() => handleCardClick('skills')}>
            <SpotlightCard theme={theme} className="h-full cursor-pointer">
               <motion.div 
                 whileHover={{ y: -5 }}
                 whileTap={{ scale: 0.98 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 className="p-8 h-full flex flex-col justify-between group"
               >
                 <div>
                    <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Skills</span>
                    <h3 className={`text-2xl font-bold mt-2 mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Tech Stack</h3>
                    
                    <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {['Python', 'ReactJS', 'LangChain', 'AWS', 'Docker', 'MySQL', 'MongoDB'].map((skill) => (
                            <span key={skill} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'}`}>
                                {skill}
                            </span>
                        ))}
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${isDark ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>+ More</span>
                    </div>
                    </div>
                 </div>
                 <MoreButton isDark={isDark} />
               </motion.div>
            </SpotlightCard>
          </motion.div>

          {/* CONTACT */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-4" onClick={() => handleCardClick('contact')}>
            <SpotlightCard theme={theme} className="h-full cursor-pointer">
              <motion.div 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-8 flex flex-col justify-between h-full group"
              >
                <div>
                   <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Contact</span>
                   <h3 className={`text-3xl font-bold mt-2 mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Let's Connect</h3>
                   <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Available for hire. Let's discuss GenAI.
                   </p>
                </div>
                
                <ShimmerButton 
                  isDark={isDark}
                  className={`
                    mt-8 px-6 py-4 rounded-xl flex items-center justify-between transition-all duration-300 shadow-md
                    ${isDark 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25' 
                      : 'bg-black text-white hover:bg-neutral-800 hover:shadow-black/20'}
                  `}
                >
                  <span className="font-bold">Send Email</span>
                  <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
                </ShimmerButton>
              </motion.div>
            </SpotlightCard>
          </motion.div>

          {/* NO2 PROJECT */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-4" onClick={() => handleCardClick('no2')}>
            <SpotlightCard theme={theme} className="h-full cursor-pointer">
              <motion.div 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-8 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Project</span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>NO₂ Prediction</h3>
                  <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'} line-clamp-3`}>
                    ML model & Visualization Platform for Nitrogen Dioxide levels.
                  </p>
                </div>
                <div className="mt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                       <Badge text="Python" isDark={isDark} />
                       <Badge text="Flask" isDark={isDark} />
                    </div>
                    <MoreButton isDark={isDark} />
                </div>
              </motion.div>
            </SpotlightCard>
          </motion.div>


          {/* --- ROW 4 --- */}
          {/* TERMINAL */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-8">
            <SpotlightCard theme={theme} className="h-full">
              <div className="p-6 font-mono text-sm flex flex-col h-full">
                 <div className="flex items-center gap-2 mb-4 justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>main.py</span>
                 </div>
                 <div className={`flex-1 rounded-lg p-4 overflow-hidden flex flex-col ${isDark ? 'bg-black/40' : 'bg-black/5'}`}>
                    <div className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Python 3.9.6 (default, Jun 2024)</div>
                    <div className="mt-2">
                        <span className={isDark ? 'text-green-400' : 'text-green-700'}>&gt;&gt;&gt;</span> import langchain
                    </div>
                    <div>
                         <span className={isDark ? 'text-green-400' : 'text-green-700'}>&gt;&gt;&gt;</span> agent = create_react_agent(llm, tools)
                    </div>
                    <div className={`mt-2 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        Agent initialized. Waiting for prompt...
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className={isDark ? 'text-green-400' : 'text-green-700'}>$</span>
                        <input 
                            type="text" 
                            placeholder="Type command..." 
                            className={`bg-transparent outline-none w-full ${isDark ? 'text-white placeholder-neutral-600' : 'text-black placeholder-neutral-400'}`}
                        />
                    </div>
                    <div className={`mt-1 animate-pulse h-4 w-2 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                 </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* DISASTER INFO */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-4" onClick={() => handleCardClick('disaster')}>
             <SpotlightCard theme={theme} className="h-full cursor-pointer">
               <motion.div 
                 whileHover={{ y: -5 }}
                 whileTap={{ scale: 0.98 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 className="p-8 flex flex-col justify-between h-full group"
               >
                 <div>
                   <div className="flex justify-between items-start mb-4">
                     <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Project</span>
                     <LinkIcon size={18} className={isDark ? 'text-neutral-500' : 'text-neutral-400'} />
                   </div>
                   <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Disaster Info</h3>
                   <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                     Real-time information aggregation system for rapid response.
                   </p>
                 </div>
                 <div className="mt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge text="React" isDark={isDark} />
                        <Badge text="API" isDark={isDark} />
                    </div>
                    <MoreButton isDark={isDark} />
                 </div>
               </motion.div>
            </SpotlightCard>
          </motion.div>

          {/* --- ROW 5 --- */}
          {/* CERTIFICATIONS */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-6" onClick={() => handleCardClick('certs')}>
             <SpotlightCard theme={theme} className="h-full cursor-pointer">
                <motion.div 
                   whileHover={{ y: -5 }}
                   whileTap={{ scale: 0.98 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="p-8 h-full flex flex-col group"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                            <Award size={24} className={isDark ? 'text-white' : 'text-black'} />
                        </div>
                        <h3 className={`text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>Certifications & Achievements</h3>
                    </div>
                    <div className="space-y-3 mt-2">
                        <div className={`p-3 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
                            <p className={`font-bold text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Buildspace N&W S5</p>
                        </div>
                        <div className={`p-3 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
                            <p className={`font-bold text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Google Arcade Ranger</p>
                        </div>
                    </div>
                     <MoreButton isDark={isDark} />
                </motion.div>
             </SpotlightCard>
          </motion.div>
          
           {/* RESUME BLOCK */}
           <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-6" onClick={() => handleCardClick('resume')}>
             <SpotlightCard theme={theme} className="h-full cursor-pointer">
                <motion.div 
                   whileHover={{ y: -5 }}
                   whileTap={{ scale: 0.98 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="p-8 h-full flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                            <FileText size={24} className={isDark ? 'text-white' : 'text-black'} />
                        </div>
                        <h3 className={`text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>My Resume</h3>
                    </div>
                    <p className={`text-sm mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Grab a comprehensive copy of my professional background and technical skills.
                    </p>
                    <div className="mt-auto">
                        <a href="/resume.pdf" download className="contents">
                            <ShimmerButton 
                                isDark={isDark}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
                            >
                                <Download size={18} /> Download CV
                            </ShimmerButton>
                        </a>
                    </div>
                </motion.div>
             </SpotlightCard>
          </motion.div>
          
           {/* --- ROW 6 --- */}
           {/* GEN AI FOCUS (Full Width) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-12" onClick={() => handleCardClick('genai')}>
             <SpotlightCard theme={theme} className="h-full cursor-pointer">
                <motion.div 
                   whileHover={{ scale: 0.99 }}
                   whileTap={{ scale: 0.98 }}
                   className="p-8 h-full flex flex-col justify-between"
                >
                    <div>
                         <div className="flex items-center gap-2 mb-4">
                            <Zap size={20} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />
                            <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Current Focus</span>
                         </div>
                         <h3 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Generative AI & LLMs</h3>
                         <p className={`mt-4 text-lg font-medium max-w-2xl ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                             Building autonomous agents, fine-tuning open-source models (Llama 3, Mistral), and creating scalable RAG pipelines using LangChain and Vector Databases.
                         </p>
                    </div>
                    <div className="mt-8 flex items-end justify-between">
                        <div className="flex flex-wrap gap-2">
                            <Badge text="LangChain" isDark={isDark} />
                            <Badge text="RAG" isDark={isDark} />
                            <Badge text="Llama 3" isDark={isDark} />
                            <Badge text="Vector DB" isDark={isDark} />
                            <Badge text="Fine-Tuning" isDark={isDark} />
                        </div>
                        <div className={`p-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                            <ChevronRight size={24} className={isDark ? 'text-white' : 'text-black'} />
                        </div>
                    </div>
                </motion.div>
             </SpotlightCard>
          </motion.div>


          {/* --- ROW 7 --- */}
          {/* GITHUB HEATMAP: Full Width */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-12">
            <SpotlightCard theme={theme} className="w-full h-full p-8">
              <div className="flex items-center gap-3 mb-6">
                <Github size={24} className={isDark ? 'text-white' : 'text-black'} />
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Contribution Activity</h3>
              </div>
              <div className="w-full">
                <img 
                  src={`https://ghchart.rshah.org/${isDark ? '4f46e5' : '000000'}/Subhan-code`} 
                  alt="Github Contribution Chart"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className={`mt-4 text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Subhan-code's contributions over the last year
              </p>
            </SpotlightCard>
          </motion.div>
          
        </motion.div>
        
        <footer className={`mt-20 flex justify-between items-center text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
           <p>© 2025 Syed Subhan Uddin. All rights reserved.</p>
           <p className="flex items-center gap-2">Built with React & Passion</p>
        </footer>

      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedId && cardDetails[selectedId] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1, transition: { duration: 0.15 } }} 
                    exit={{ opacity: 0, transition: { duration: 0.15 } }} 
                    onClick={() => setSelectedId(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
                    exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
                    className={`relative w-full max-w-7xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 md:p-12 shadow-2xl ${isDark ? 'bg-[#151515] text-white' : 'bg-white text-black'}`}
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedId(null); }} 
                        className={`absolute top-6 right-6 p-2 rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
                    >
                        <X size={20} />
                    </button>

                    <div className="mt-2">
                        {cardDetails[selectedId].date && (
                             <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {cardDetails[selectedId].date}
                             </span>
                        )}
                        <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-2">{cardDetails[selectedId].title}</h2>
                        {cardDetails[selectedId].subtitle && (
                            <h3 className={`text-xl md:text-2xl font-medium mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                {cardDetails[selectedId].subtitle}
                            </h3>
                        )}
                        
                        {cardDetails[selectedId].description && (
                            <p className={`text-lg md:text-xl mb-8 leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                {cardDetails[selectedId].description}
                            </p>
                        )}

                        <div className="my-8 border-t border-dashed border-gray-500/30" />

                        <div className={isDark ? 'text-neutral-300 text-lg leading-relaxed' : 'text-neutral-700 text-lg leading-relaxed'}>
                            {cardDetails[selectedId].content}
                        </div>

                        {cardDetails[selectedId].tags && (
                             <div className="mt-10 pt-6 border-t border-gray-500/20 flex flex-wrap gap-2">
                                {cardDetails[selectedId].tags.map((tag: string) => (
                                    <Badge key={tag} text={tag} isDark={isDark} />
                                ))}
                             </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Content;