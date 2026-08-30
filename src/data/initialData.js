/**
 * initialData.js — AXION Club seed data
 *
 * SECURITY: All password fields contain salted SHA-256 hashes, NOT plaintext.
 * Hash function: SHA-256( 'axion_v1_2026_salt' + password + 'axion_v1_2026_salt' )
 * See src/utils/authUtils.js → hashPassword()
 *
 * Original demo credentials (for development only):
 *   admin@axion-aiml.club   →  password: admin
 *   mentor@axion-aiml.club  →  password: mentor
 *   lead@axion-aiml.club    →  password: lead
 */
export const initialClubData = {
  branding: {
    clubName: "AXION",
    fullName: "AXION Technical & AI/ML Club",
    tagline: "Technical & AI/ML Club — Innovating Beyond Boundaxion",
    description: "The official Technical & AI/ML Club exploring Deep Learning, Large Language Models, Robotics, Computer Vision, and Advanced Computing through hands-on research and high-impact engineering.",
    primaryColor: "#0ea5e9",
    secondaryColor: "#06b6d4",
    accentColor: "#f59e0b",
    logoUrl: "/axion_logo.jpg",
    foundedYear: "2023",
    university: "Institute of Advanced Technology",
    contactEmail: "admin@axion-aiml.club",
    socials: {
      github: "https://github.com/axion-aiml-club",
      discord: "https://discord.gg/axion-ai",
      linkedin: "https://linkedin.com/company/axion-aiml-club",
      twitter: "https://twitter.com/axion_aiml",
      huggingface: "https://huggingface.co/axion-aiml"
    }
  },

  joinRequests: [],
  adminUsers: [
    {
      id: "usr-01",
      name: "Aarav Sharma",
      email: "admin@axion-aiml.club",
      // SHA-256(salt + 'admin' + salt) — see authUtils.js
      passwordHash: "a44890d45a4d0188381891cb49369a96a3ac6f6afbe1afc3323bcc62083e7999",
      role: "Head Administrator",
      title: "President & AI Systems Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      permissions: ["ALL"]
    },
    {
      id: "usr-02",
      name: "Dr. Elena Rostova",
      email: "mentor@axion-aiml.club",
      // SHA-256(salt + 'mentor' + salt) — see authUtils.js
      passwordHash: "461ff644f1da080fb715d66cba6a5ecadc7add556d2128322cd2feb4aad79bc6",
      role: "Club Mentor",
      title: "Faculty Advisor & Research Director",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      permissions: ["CMS", "LEARNING", "MEMBERS"]
    },
    {
      id: "usr-03",
      name: "Sophia Chen",
      email: "lead@axion-aiml.club",
      // SHA-256(salt + 'lead' + salt) — see authUtils.js
      passwordHash: "1a689c10dd5b827b5df8150db1a693c75d0a5499c2bceb89b7e11b9eabddeaba",
      role: "Core Technical Lead",
      title: "Robotics & CV Lead",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      permissions: ["PROJECTS", "EVENTS", "LEARNING"]
    }
  ],

  stats: {
    totalMembers: 342,
    activeProjects: 18,
    upcomingEvents: 5,
    engagementRate: "94.6%",
    growthTrend: [
      { month: "Jan", members: 120, rsvps: 85 },
      { month: "Feb", members: 165, rsvps: 120 },
      { month: "Mar", members: 210, rsvps: 180 },
      { month: "Apr", members: 255, rsvps: 210 },
      { month: "May", members: 295, rsvps: 260 },
      { month: "Jun", members: 342, rsvps: 310 }
    ],
    domainBreakdown: [
      { domain: "Generative AI & LLMs", percentage: 38, count: 7 },
      { domain: "Computer Vision", percentage: 28, count: 5 },
      { domain: "Reinforcement Learning & Robotics", percentage: 18, count: 3 },
      { domain: "MLOps & Edge Computing", percentage: 16, count: 3 }
    ]
  },

  learningDomains: [
    {
      id: "dom-01",
      name: "Generative AI & Large Language Models",
      slug: "genai-llms",
      badgeColor: "badge-cyan",
      accent: "#06b6d4",
      level: "Intermediate to Advanced",
      description: "Master Transformer architectures, PEFT / LoRA fine-tuning, RAG pipelines, and agentic reasoning frameworks.",
      modulesCount: 6
    },
    {
      id: "dom-02",
      name: "Computer Vision & Visual Intelligence",
      slug: "computer-vision",
      badgeColor: "badge-blue",
      accent: "#0ea5e9",
      level: "All Levels",
      description: "Explore CNNs, Vision Transformers (ViT), diffusion generation, object detection (YOLOv10), and 3D NeRFs.",
      modulesCount: 5
    },
    {
      id: "dom-03",
      name: "Deep Reinforcement Learning & Robotics",
      slug: "robotics-rl",
      badgeColor: "badge-lavender",
      accent: "#8b5cf6",
      level: "Advanced",
      description: "Policy gradient methods, PPO, multi-agent swarms, Isaac Sim physics engines, and sim-to-real quadruped control.",
      modulesCount: 4
    },
    {
      id: "dom-04",
      name: "Production MLOps & Distributed Computing",
      slug: "mlops-edge",
      badgeColor: "badge-emerald",
      accent: "#10b981",
      level: "Intermediate",
      description: "PyTorch FSDP distributed training, Triton inference servers, TensorRT optimization, and Docker/K8s deployment.",
      modulesCount: 4
    },
    {
      id: "dom-05",
      name: "Foundational Machine Learning & Math",
      slug: "foundations",
      badgeColor: "badge-amber",
      accent: "#f59e0b",
      level: "Beginner",
      description: "Linear algebra for AI, multivariable calculus, probability, gradient descent intuition, and PyTorch tensors from scratch.",
      modulesCount: 5
    }
  ],

  learningResources: [
    {
      id: "lrn-01",
      title: "Building Custom LLM Agents with LangGraph & Tool Calling",
      domainId: "dom-01",
      domainName: "Generative AI & LLMs",
      type: "Video & Playlist",
      format: "Video + Code",
      duration: "48 mins (4 Lectures)",
      instructor: "Aarav Sharma",
      videoUrl: "https://www.youtube.com/watch?v=kYJyrh5Kz3I",
      githubUrl: "https://github.com/axion-aiml/langgraph-agents-starter",
      notesPdfUrl: "https://arxiv.org/abs/2303.17580",
      colabUrl: "https://colab.research.google.com",
      description: "Complete step-by-step walkthrough building stateful cyclical agents, conditional routing, and SQLite memory checkpoints.",
      isFeatured: true
    },
    {
      id: "lrn-02",
      title: "LoRA & QLoRA Fine-Tuning Mistral-7B from Scratch",
      domainId: "dom-01",
      domainName: "Generative AI & LLMs",
      type: "Source Code & Notebook",
      format: "Jupyter Notebook",
      duration: "1 hr 15 mins lab",
      instructor: "Dr. Elena Rostova",
      videoUrl: "https://www.youtube.com/watch?v=eC6Hd1hFvos",
      githubUrl: "https://github.com/axion-aiml/unsloth-lora-cookbook",
      notesPdfUrl: "#",
      colabUrl: "https://colab.research.google.com",
      description: "Train a domain-specialized 7B LLM on Google Colab free tier GPU with 4-bit quantization and gradient checkpointing.",
      isFeatured: true
    },
    {
      id: "lrn-03",
      title: "Real-Time Object Tracking with YOLOv10 & ByteTrack",
      domainId: "dom-02",
      domainName: "Computer Vision",
      type: "Video & Playlist",
      format: "Video + Repo",
      duration: "35 mins",
      instructor: "Sophia Chen",
      videoUrl: "https://www.youtube.com/watch?v=WGn7cT2bI-0",
      githubUrl: "https://github.com/axion-aiml/yolov10-edge-tracking",
      notesPdfUrl: "#",
      colabUrl: "https://colab.research.google.com",
      description: "End-to-end tutorial on real-time multi-object visual tracking with sub-15ms inference latency.",
      isFeatured: false
    },
    {
      id: "lrn-04",
      title: "Complete PyTorch Distributed Training (DDP & FSDP) Cheatsheet",
      domainId: "dom-04",
      domainName: "Production MLOps",
      type: "Lecture Notes & Cheatsheet",
      format: "PDF Document (18 Pages)",
      duration: "Reading Guide",
      instructor: "Liam O'Connor",
      videoUrl: "",
      githubUrl: "https://github.com/axion-aiml/pytorch-fsdp-template",
      notesPdfUrl: "https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html",
      colabUrl: "",
      description: "Architecture diagrams, code recipes, and best practices for scaling neural network training across multi-node GPU clusters.",
      isFeatured: true
    },
    {
      id: "lrn-05",
      title: "Proximal Policy Optimization (PPO) Mathematical Derivation & Code",
      domainId: "dom-03",
      domainName: "Deep RL & Robotics",
      type: "Source Code & Notebook",
      format: "Clean PyTorch Code",
      duration: "45 mins",
      instructor: "Sophia Chen",
      videoUrl: "https://www.youtube.com/watch?v=5P7I-xPq8u8",
      githubUrl: "https://github.com/axion-aiml/clean-ppo-pytorch",
      notesPdfUrl: "#",
      colabUrl: "https://colab.research.google.com",
      description: "Clean single-file PyTorch implementation of clipped surrogate objective PPO for continuous robotic control.",
      isFeatured: false
    },
    {
      id: "lrn-06",
      title: "Mathematics for Machine Learning: Linear Algebra & Gradient Calculus",
      domainId: "dom-05",
      domainName: "Foundations",
      type: "Lecture Notes & Cheatsheet",
      format: "Annotated PDF + Slides",
      duration: "Foundational Track",
      instructor: "Dr. Elena Rostova",
      videoUrl: "",
      githubUrl: "https://github.com/axion-aiml/math-for-ml-handbook",
      notesPdfUrl: "#",
      colabUrl: "",
      description: "Essential eigenvalues, matrix decompositions, Jacobians, and backpropagation computational graphs explained visually.",
      isFeatured: true
    }
  ],

  members: [
    {
      id: "mem-01",
      name: "Dr. Elena Rostova",
      email: "elena.rostova@axion-aiml.club",
      role: "Club Mentor",
      status: "Active",
      department: "AI & Data Science",
      joinedDate: "2023-08-15",
      skills: ["PyTorch", "Transformers", "Neural Architecture Search"],
      github: "https://github.com/erostova",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "mem-02",
      name: "Aarav Sharma",
      email: "aarav.s@axion-aiml.club",
      role: "Admin",
      status: "Active",
      department: "Computer Science",
      joinedDate: "2023-09-01",
      skills: ["FastAPI", "LangChain", "Kubernetes", "CUDA"],
      github: "https://github.com/aarav-ml",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "mem-03",
      name: "Sophia Chen",
      email: "sophia.chen@axion-aiml.club",
      role: "Core Lead",
      status: "Active",
      department: "Robotics & Automation",
      joinedDate: "2023-10-10",
      skills: ["ROS 2", "Deep Q-Learning", "Computer Vision", "OpenCV"],
      github: "https://github.com/sophia-chen-ai",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "mem-04",
      name: "Marcus Vance",
      email: "marcus.v@axion-aiml.club",
      role: "ML Researcher",
      status: "Active",
      department: "Electrical Engineering",
      joinedDate: "2024-01-14",
      skills: ["Diffusion Models", "JAX", "Distributed Training"],
      github: "https://github.com/marcusvance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "mem-05",
      name: "Ananya Patel",
      email: "ananya.p@axion-aiml.club",
      role: "Member",
      status: "Active",
      department: "Information Technology",
      joinedDate: "2024-02-20",
      skills: ["Scikit-Learn", "Pandas", "NLP", "Streamlit"],
      github: "https://github.com/ananya-data",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "mem-06",
      name: "Liam O'Connor",
      email: "liam.oc@axion-aiml.club",
      role: "Alumni",
      status: "Alumni",
      department: "Software Engineering (Graduated)",
      joinedDate: "2023-08-15",
      skills: ["MLOps", "ONNX", "TensorRT", "C++"],
      github: "https://github.com/liam-edgeai",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  ],

  events: [
    {
      id: "evt-01",
      title: "Fine-Tuning Open Source LLMs with LoRA & Unsloth",
      type: "Workshop",
      date: "2026-09-05",
      time: "18:00 - 20:30 IST",
      location: "Turing Lab 402 / Hybrid",
      speaker: "Dr. Elena Rostova",
      rsvps: 118,
      capacity: 150,
      status: "Upcoming",
      tags: ["GenAI", "Hands-on", "LLMs"],
      description: "Learn practical quantization, parameter-efficient fine-tuning (PEFT), and evaluation techniques on Llama-3 & Mistral architectures using consumer GPUs.",
      attendees: [
        { name: "Aarav Sharma", email: "aarav.s@axion-aiml.club", checkedIn: true },
        { name: "Sophia Chen", email: "sophia.chen@axion-aiml.club", checkedIn: true },
        { name: "Ananya Patel", email: "ananya.p@axion-aiml.club", checkedIn: false }
      ]
    },
    {
      id: "evt-02",
      title: "AXION AI Annual Hackathon 2026: Multimodal Intelligence",
      type: "Hackathon",
      date: "2026-09-19",
      time: "36 Hours Live",
      location: "Main Auditorium + Discord",
      speaker: "Keynote: OpenAI Research Fellow",
      rsvps: 245,
      capacity: 300,
      status: "Upcoming",
      tags: ["Hackathon", "Prizes", "Vision-Language"],
      description: "Build cutting-edge agentic workflows, vision-language systems, and robotics assistants. Over $5,000 in cloud credits and sponsor bounty prizes!",
      attendees: []
    },
    {
      id: "evt-03",
      title: "Autonomous Navigation with Deep Reinforcement Learning",
      type: "Guest Lecture",
      date: "2026-08-30",
      time: "17:00 - 18:30 IST",
      location: "Virtual (Google Meet)",
      speaker: "Sophia Chen & Guest Robotics Engineer",
      rsvps: 84,
      capacity: 100,
      status: "Upcoming",
      tags: ["Robotics", "RL", "Simulation"],
      description: "From Isaac Sim to physical quadruped robots: tackling sim-to-real gap using domain randomization and proximal policy optimization.",
      attendees: []
    }
  ],

  cmsPages: {
    hero: {
      title: "AXION: Pioneering AI Frontiers",
      badge: "✦ AXION TECHNICAL & AI/ML CLUB",
      subtitle: "Join an elite community of student researchers, engineers, and builders developing open-source models, competitive AI solutions, and state-of-the-art intelligent systems.",
      ctaPrimary: "Join AXION Club",
      ctaSecondary: "Explore Learning Tracks"
    },
    about: {
      heading: "AXION Technical & AI/ML Club",
      narrative: "AXION was founded to bridge the gap between theoretical machine learning curricula and cutting-edge industrial AI applications. We foster hands-on peer collaboration across computer vision, foundation models, reinforcement learning, and ethical AI.",
      statsHighlight: "Over 30+ papers published, 15 hackathon victories, and 1,200+ workshop attendees."
    },
    mission: {
      points: [
        { title: "Open Research & Collaboration", desc: "Collaborate on peer-reviewed papers and open-source PyTorch & JAX implementations." },
        { title: "Production-Ready MLOps", desc: "Train on high-performance compute clusters and learn modern deployment pipelines." },
        { title: "Community & Career Mentorship", desc: "Direct guidance from industry researchers at top tech labs and PhD alumni." }
      ]
    },
    faqs: [
      {
        question: "Who is eligible to join AXION?",
        answer: "Any enrolled student with a passion for math, programming, or AI research. We have tracks from beginner ML fundamentals to advanced research labs."
      },
      {
        question: "Do I need GPU hardware to participate in projects?",
        answer: "No! AXION provides access to cloud compute credits (A100/H100 instances) and local lab workstations for active project teams."
      },
      {
        question: "How are project proposals submitted and funded?",
        answer: "Members can pitch proposals during monthly Open Pitch Days. Approved projects receive compute funding, mentor pairing, and hardware sponsorship."
      }
    ]
  },

  announcements: [
    {
      id: "ann-01",
      title: "Applications Open for AXION Fall 2026 AI Research Cohort!",
      content: "We are recruiting student leads and researchers for our Generative AI and Autonomous Robotics labs. Submissions close Sept 10th.",
      urgency: "High",
      isActive: true,
      createdAt: "2026-08-20"
    },
    {
      id: "ann-02",
      title: "Cloud GPU Compute Grants Distributed",
      content: "All project leads can now claim their allocated NVIDIA H100 cluster hours via the AXION portal dashboard.",
      urgency: "Normal",
      isActive: true,
      createdAt: "2026-08-18"
    }
  ],

  blogPosts: [
    {
      id: "blog-01",
      title: "Understanding Rotary Position Embeddings (RoPE) in Modern LLMs",
      author: "Marcus Vance",
      category: "Deep Learning Theory",
      readTime: "7 min read",
      publishedDate: "2026-08-14",
      status: "Published",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      excerpt: "A mathematical breakdown of relative position encoding in modern transformer architectures like LLaMA and Mistral."
    },
    {
      id: "blog-02",
      title: "Building Real-Time Multi-Agent Debate Systems with LangGraph",
      author: "Aarav Sharma",
      category: "Applied GenAI",
      readTime: "11 min read",
      publishedDate: "2026-08-02",
      status: "Published",
      coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
      excerpt: "How we architected a consensus-driven multi-agent system that reduces hallucination rates in complex coding benchmarks by 42%."
    }
  ],

  resources: [
    {
      id: "res-01",
      title: "AXION Deep Learning Master Roadmap 2026",
      type: "Curriculum Guide",
      size: "PDF (4.2 MB)",
      domain: "Foundational ML",
      link: "#",
      downloads: 489
    },
    {
      id: "res-02",
      title: "PyTorch Distributed Training & FSDP Cheatsheet",
      type: "Code Cheatsheet",
      size: "Markdown & Code",
      domain: "MLOps",
      link: "#",
      downloads: 312
    },
    {
      id: "res-03",
      title: "Medical Vision Segmentation Dataset (Cleaned 50k CTs)",
      type: "Dataset",
      size: "12.8 GB (HuggingFace)",
      domain: "Computer Vision",
      link: "https://huggingface.co/datasets",
      downloads: 650
    }
  ],

  projects: [
    {
      id: "proj-01",
      name: "NeuroVision: Real-Time Drone Obstacle Avoidance",
      authors: ["Sophia Chen", "Liam O'Connor"],
      category: "Computer Vision & Robotics",
      status: "Featured",
      stars: 142,
      github: "https://github.com/axion-aiml/neuro-vision",
      demoUrl: "https://neurovision-demo.axion-aiml.club",
      image: '/project_vision.jpg',
      description: "Sub-10ms latency stereo depth estimation and optical flow segmentation running on edge NVIDIA Jetson Orin Nano modules."
    },
    {
      id: "proj-02",
      name: "MedAxion: Multimodal Clinical Diagnostic Assistant",
      authors: ["Marcus Vance", "Dr. Elena Rostova"],
      category: "Generative AI",
      status: "Featured",
      stars: 285,
      github: "https://github.com/axion-aiml/medaxion-llm",
      demoUrl: "https://medaxion.axion-aiml.club",
      image: '/project_llm.jpg',
      description: "A specialized 8B parameter vision-language model fine-tuned on anonymized radiology reports with rigorous hallucination guardrails."
    },
    {
      id: "proj-03",
      name: "AgentFlow: Distributed Swarm Optimizer for RL",
      authors: ["Aarav Sharma", "Ananya Patel"],
      category: "Reinforcement Learning",
      status: "Approved",
      stars: 98,
      github: "https://github.com/axion-aiml/agent-flow",
      demoUrl: "https://agentflow.axion-aiml.club",
      image: '/project_rl.jpg',
      description: "Scalable asynchronous policy gradient coordinator for complex multi-agent simulation environments."
    }
  ],

  notifications: [
    {
      id: "notif-01",
      title: "Workshop Reminder: LoRA Fine-Tuning Session",
      message: "Scheduled for this Friday at 6:00 PM IST in Turing Lab 402. Don't forget to clone the workshop repository beforehand.",
      audience: "All Active Members",
      channel: "Email & In-App",
      sentAt: "2026-08-21 14:30",
      deliveryRate: "99.2%"
    },
    {
      id: "notif-02",
      title: "Hackathon Registration Nearing Capacity",
      message: "Over 240 spots reserved. Registration closes as soon as 300 capacity is hit.",
      audience: "Registered Attendees",
      channel: "In-App Push",
      sentAt: "2026-08-20 09:15",
      deliveryRate: "100%"
    }
  ],

  activityLog: [
    { id: "act-01", user: "Dr. Elena Rostova", action: "Scheduled new workshop", target: "Fine-Tuning Open Source LLMs", time: "10 mins ago", type: "event" },
    { id: "act-02", user: "Aarav Sharma", action: "Added video & notebook to Learning Hub", target: "Building Custom LLM Agents", time: "20 mins ago", type: "learning" },
    { id: "act-03", user: "Sophia Chen", action: "Uploaded PPO source code", target: "Continuous Robotic Control", time: "1 hour ago", type: "learning" },
    { id: "act-04", user: "Marcus Vance", action: "Published new research article", target: "Understanding RoPE", time: "1 day ago", type: "cms" }
  ]
};
