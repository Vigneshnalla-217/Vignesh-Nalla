/**
 * Centralized Portfolio Configuration for Vignesh Nalla.
 *
 * Update any personal details, profile photo, skills, projects,
 * education entries, certifications, goals, or social links here
 * without touching UI component files.
 */

export interface SkillItem {
  id: string;
  name: string;
  status: 'Currently Learning' | 'Practicing' | 'Proficient';
  tagline: string;
  focusAreas: string[];
  sampleCode: string;
  codeLanguage: string;
  accentHex: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  stageLabel: 'Starter Concept · Coming Soon' | 'In Progress' | 'Completed';
  summary: string;
  plannedScope: string[];
  technologies: string[];
  visualTheme: 'python' | 'java' | 'portfolio';
  liveUrl: string | null;
  githubUrl: string | null;
}

export interface JourneyStage {
  id: string;
  stepNumber: string;
  phase: string;
  title: string;
  summary: string;
  highlights: string[];
  isCurrent?: boolean;
}

export interface EducationItem {
  id: string;
  level: string;
  stream: string;
  timeframe: string;
  description: string;
  subjects: string[];
  isCurrent: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface GoalItem {
  id: string;
  index: string;
  title: string;
  description: string;
  category: string;
}

export const portfolioConfig = {
  brand: {
    monogram: 'VN',
    domain: 'vigneshnalla.com',
  },

  personal: {
    greeting: "HELLO, WORLD. I'M",
    fullName: 'VIGNESH NALLA',
    displayName: 'Vignesh Nalla',
    title: 'Student & Aspiring Software Developer',
    typingPhrases: [
      'Student & Aspiring Software Developer',
      'Intermediate 2nd Year · MPC Stream',
      'Currently Learning Python & Java',
    ],
    heroIntro:
      'Curious mind. Future-focused. Currently exploring the world of code through Python and Java, one idea at a time.',
    profilePhoto: {
      src: '/assets/aistudio/file_00000000cc3c8207b9dc1f1d0f92e8b1_6157f590.png',
      alt: 'Professional portrait of Vignesh Nalla wearing a dark blazer and white collared shirt',
    },
    floatingHighlights: [
      { label: 'Education', value: 'MPC · 2nd Year' },
      { label: 'Current Stack', value: 'Python & Java' },
    ],
  },

  social: {
    email: 'vigneshnalla28@gmail.com',
    githubUrl: 'https://github.com/Vigneshnalla-217',
    githubHandle: 'Vigneshnalla-217',
    instagramUrl: 'https://www.instagram.com/imvigneshnalla/',
    instagramHandle: '@imvigneshnalla',
    // Set linkedinUrl once available; keep null when not available yet
    linkedinUrl: null as string | null,
  },

  navigation: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ],

  about: {
    heading: 'Building My Future, One Line at a Time.',
    paragraphs: [
      "I'm Vignesh Nalla, an MPC student in my second year with a growing passion for software development and technology.",
      "I'm at the beginning of my coding journey, learning Python and Java while exploring how ideas can become useful digital experiences.",
      'I believe in staying curious, practising consistently, and getting better with every project.',
    ],
    pillars: [
      {
        title: 'Academic Foundation',
        detail: 'Intermediate 2nd Year in MPC (Mathematics, Physics, Chemistry), strengthening analytical reasoning and structured problem solving.',
      },
      {
        title: 'Programming Focus',
        detail: 'Building core fluency in Python and Java syntax, logic flow, functions, and object-oriented thinking from the ground up.',
      },
      {
        title: 'Personal Ambition',
        detail: 'Transitioning steadily from foundational exercises into practical software tools, web applications, and AI exploration.',
      },
      {
        title: 'Developer Mindset',
        detail: 'Committed to honest progress, daily curiosity, clean code habits, and learning deliberately through hands-on practice.',
      },
    ],
  },

  journey: [
    {
      id: 'stage-mpc',
      stepNumber: '01',
      phase: 'Current Stage',
      title: 'Intermediate 2nd Year — MPC',
      summary:
        'Developing strong mathematical intuition and scientific reasoning through Mathematics, Physics, and Chemistry.',
      highlights: ['Analytical Thinking', 'Quantitative Reasoning', 'Consistent Study Discipline'],
      isCurrent: true,
    },
    {
      id: 'stage-learning',
      stepNumber: '02',
      phase: 'Current Learning',
      title: 'Python and Java',
      summary:
        'Exploring two complementary programming languages to understand both rapid scripting logic and structured object-oriented design.',
      highlights: ['Control Flow & Functions', 'Data Fundamentals', 'Object-Oriented Concepts'],
      isCurrent: true,
    },
    {
      id: 'stage-projects',
      stepNumber: '03',
      phase: 'Next Goal',
      title: 'Build practical programming projects',
      summary:
        'Applying classroom logic and syntax exercises to build small, complete tools and publish clean repositories on GitHub.',
      highlights: ['Python Playground', 'Java Console Utilities', 'First GitHub Repositories'],
      isCurrent: false,
    },
    {
      id: 'stage-career',
      stepNumber: '04',
      phase: 'Future Goal',
      title: 'Become a professional software developer',
      summary:
        'Growing into a versatile engineer capable of designing reliable software, modern web platforms, and intelligent systems.',
      highlights: ['Real-World Software', 'Web Architecture', 'Artificial Intelligence'],
      isCurrent: false,
    },
  ] satisfies JourneyStage[],

  skills: {
    heading: 'Foundations in Progress',
    subheading:
      'Every expert started at line one. Here are the programming languages I am actively learning right now—honestly represented without inflated percentages.',
    items: [
      {
        id: 'python',
        name: 'Python',
        status: 'Currently Learning',
        tagline: 'Readable syntax, algorithmic thinking, and foundational scripting.',
        focusAreas: [
          'Variables, data types, and control structures',
          'Functions, loops, and modular problem solving',
          'Lists, dictionaries, and file-handling basics',
        ],
        codeLanguage: 'python',
        sampleCode: `def greet_builder(name: str) -> str:\n    return f"Keep building, {name}."\n\nprint(greet_builder("Vignesh"))`,
        accentHex: '#FF557F',
      },
      {
        id: 'java',
        name: 'Java',
        status: 'Currently Learning',
        tagline: 'Strong typing, structured logic, and object-oriented fundamentals.',
        focusAreas: [
          'Classes, objects, and core OOP principles',
          'Static typing, methods, and clean control flow',
          'Console input/output and foundational algorithms',
        ],
        codeLanguage: 'java',
        sampleCode: `public class Journey {\n    public static void main(String[] args) {\n        System.out.println("One line at a time.");\n    }\n}`,
        accentHex: '#9272FF',
      },
    ] satisfies SkillItem[],
    // Add upcoming or new languages here as your skill set expands
    upcomingTopics: ['HTML & CSS', 'JavaScript & TypeScript', 'Git & GitHub', 'Data Structures'],
  },

  projects: {
    heading: 'Starter Project Ideas',
    subheading:
      'I have not published independent projects yet. These starter concepts outline the first builds I am planning as I progress in Python, Java, and web development.',
    items: [
      {
        id: 'python-playground',
        title: 'Python Playground',
        stageLabel: 'Starter Concept · Coming Soon',
        summary:
          'A curated collection of beginner-to-intermediate Python scripts, logic puzzles, and command-line mini-utilities built while practising core programming concepts.',
        plannedScope: [
          'Number & pattern logic exercises from MPC math concepts',
          'Interactive command-line calculator & unit converter',
          'Clean modular functions with documented test cases',
        ],
        technologies: ['Python', 'CLI', 'Problem Solving'],
        visualTheme: 'python',
        liveUrl: null,
        githubUrl: null,
      },
      {
        id: 'java-fundamentals',
        title: 'Java Fundamentals',
        stageLabel: 'Starter Concept · Coming Soon',
        summary:
          'Structured Java practice programs focused on mastering classes, methods, conditionals, and object-oriented problem solving.',
        plannedScope: [
          'Object-oriented student & task management console models',
          'Array and string manipulation practice exercises',
          'Readable Java code structure with clear method design',
        ],
        technologies: ['Java', 'OOP Concepts', 'Algorithms'],
        visualTheme: 'java',
        liveUrl: null,
        githubUrl: null,
      },
      {
        id: 'personal-portfolio-website',
        title: 'Personal Portfolio Website',
        stageLabel: 'Starter Concept · Coming Soon',
        summary:
          'My personal digital identity at vigneshnalla.com—designed to document my educational path, programming skills, and upcoming software projects.',
        plannedScope: [
          'Centralized configuration for effortless updates',
          'Interactive 3D hero stage and responsive dark aesthetic',
          'Direct contact gateway and live GitHub integration as repos launch',
        ],
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        visualTheme: 'portfolio',
        liveUrl: null,
        githubUrl: null,
      },
    ] satisfies ProjectItem[],
  },

  education: {
    heading: 'Academic Path',
    subheading:
      'Building quantitative rigour in Mathematics and Sciences while laying the groundwork for computer science and software engineering.',
    // Note: Intentionally omits institution/college name per personal preference.
    items: [
      {
        id: 'intermediate-mpc',
        level: 'Intermediate 2nd Year',
        stream: 'Stream: MPC (Mathematics, Physics, Chemistry)',
        timeframe: 'Current Academic Stage',
        description:
          'Focused on higher-secondary mathematics, mechanics, electromagnetism, and chemical principles—developing the analytical discipline that translates directly into programming logic.',
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        isCurrent: true,
      },
    ] satisfies EducationItem[],
    // Add future certifications here as you earn them
    certifications: [] as CertificationItem[],
  },

  goals: {
    heading: 'Where I Am Headed',
    subheading:
      'A clear roadmap of the skills, habits, and milestones guiding my transition from student to software developer.',
    items: [
      {
        id: 'goal-1',
        index: '01',
        title: 'Improve Python programming',
        description: 'Move beyond syntax basics into clean functions, data structures, and everyday automation scripts.',
        category: 'Core Language',
      },
      {
        id: 'goal-2',
        index: '02',
        title: 'Learn Java deeply',
        description: 'Master object-oriented architecture, memory concepts, and reliable application structure.',
        category: 'Core Language',
      },
      {
        id: 'goal-3',
        index: '03',
        title: 'Develop problem-solving skills',
        description: 'Pair MPC mathematical reasoning with algorithmic thinking to break complex challenges into simple steps.',
        category: 'Engineering Craft',
      },
      {
        id: 'goal-4',
        index: '04',
        title: 'Build real-world software projects',
        description: 'Turn starter ideas into complete, documented applications published openly on GitHub.',
        category: 'Execution',
      },
      {
        id: 'goal-5',
        index: '05',
        title: 'Explore web development',
        description: 'Learn how modern frontends, APIs, and responsive interfaces connect into seamless products.',
        category: 'Web & Systems',
      },
      {
        id: 'goal-6',
        index: '06',
        title: 'Understand artificial intelligence',
        description: 'Study how machine learning models, data, and intelligent tools work beneath the surface.',
        category: 'Future Frontier',
      },
      {
        id: 'goal-7',
        index: '07',
        title: 'Become a professional software developer',
        description: 'Earn my place in the software industry through consistent practice, integrity, and meaningful work.',
        category: 'North Star',
      },
    ] satisfies GoalItem[],
  },

  contact: {
    heading: "Have an Idea? Let's Connect.",
    subheading:
      'Whether you want to talk about Python, Java, student projects, or future software collaborations, I would be glad to hear from you.',
  },
} as const;
