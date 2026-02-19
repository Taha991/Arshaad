// ── Types ──────────────────────────────────────────────────────────

export interface GroupMember {
  id: number
  name: string
  nameAr: string
  initials: string
  role: string
  roleAr: string
  track: string
  progressPercent: number
  isOnline: boolean
  joinedDate: string
  avatarColor: string
}

export interface MentorProfile {
  id: number
  name: string
  nameAr: string
  bio: string
  bioAr: string
  expertise: string[]
  rating: number
  groupsCount: number
  maxGroups: number
  sessionRate: string
  avatarInitials: string
  avatarColor: string
  yearsExperience: number
}

export interface SalaryDataPoint {
  seniority: string
  seniorityAr: string
  avg: number
  min: number
  max: number
}

export interface TrackSalaryData {
  track: string
  trackAr: string
  data: SalaryDataPoint[]
  demandScore: number
  jobCount: number
  growthPercent: number
}

export interface MarketSkill {
  skill: string
  demandScore: number
  category: string
}

export interface EventItem {
  id: number
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  category: 'Workshop' | 'Webinar' | 'Hackathon' | 'Conference' | 'Meetup'
  categoryAr: string
  date: string
  location: string
  locationAr: string
  isOnline: boolean
  registrationUrl: string
  speaker: string
  speakerAr: string
  tags: string[]
  spotsLeft: number
  totalSpots: number
}

export interface RoadmapStage {
  id: number
  title: string
  titleAr: string
  description: string
  stage_order: number
  estimated_hours: number
  status: 'completed' | 'in_progress' | 'locked'
  progressPercent: number
  skills: string[]
}

// ── Group Members (10) ────────────────────────────────────────────

export const mockGroupMembers: GroupMember[] = [
  { id: 1,  name: 'Ahmed Hassan',    nameAr: 'أحمد حسن',    initials: 'AH', role: 'Frontend Dev',    roleAr: 'مطور واجهات',        track: 'Frontend',    progressPercent: 72, isOnline: true,  joinedDate: '2024-09-01', avatarColor: 'from-blue-500 to-cyan-500'    },
  { id: 2,  name: 'Sara Mohamed',    nameAr: 'سارة محمد',    initials: 'SM', role: 'UI/UX Designer',  roleAr: 'مصممة تجربة مستخدم', track: 'Frontend',    progressPercent: 85, isOnline: true,  joinedDate: '2024-09-01', avatarColor: 'from-violet-500 to-pink-500'  },
  { id: 3,  name: 'Omar Ali',        nameAr: 'عمر علي',      initials: 'OA', role: 'Backend Dev',     roleAr: 'مطور خلفيات',        track: 'Backend',     progressPercent: 61, isOnline: false, joinedDate: '2024-09-03', avatarColor: 'from-green-500 to-teal-500'   },
  { id: 4,  name: 'Fatima Khalid',   nameAr: 'فاطمة خالد',   initials: 'FK', role: 'Data Analyst',    roleAr: 'محللة بيانات',       track: 'Data',        progressPercent: 78, isOnline: true,  joinedDate: '2024-09-01', avatarColor: 'from-orange-500 to-amber-500' },
  { id: 5,  name: 'Youssef Ibrahim', nameAr: 'يوسف إبراهيم', initials: 'YI', role: 'Mobile Dev',      roleAr: 'مطور موبايل',        track: 'Mobile',      progressPercent: 45, isOnline: false, joinedDate: '2024-09-05', avatarColor: 'from-red-500 to-rose-500'     },
  { id: 6,  name: 'Nour Sayed',      nameAr: 'نور سيد',      initials: 'NS', role: 'DevOps Engineer', roleAr: 'مهندس ديف أوبس',     track: 'DevOps',      progressPercent: 58, isOnline: true,  joinedDate: '2024-09-02', avatarColor: 'from-cyan-500 to-blue-500'    },
  { id: 7,  name: 'Karim Mostafa',   nameAr: 'كريم مصطفى',   initials: 'KM', role: 'ML Engineer',     roleAr: 'مهندس تعلم آلي',     track: 'AI/ML',       progressPercent: 90, isOnline: true,  joinedDate: '2024-09-01', avatarColor: 'from-indigo-500 to-violet-500'},
  { id: 8,  name: 'Layla Ahmed',     nameAr: 'ليلى أحمد',    initials: 'LA', role: 'Cybersecurity',   roleAr: 'أمن معلومات',        track: 'Security',    progressPercent: 67, isOnline: false, joinedDate: '2024-09-04', avatarColor: 'from-pink-500 to-rose-500'    },
  { id: 9,  name: 'Ziad Hassan',     nameAr: 'زياد حسن',     initials: 'ZH', role: 'Full Stack Dev',  roleAr: 'مطور فول ستاك',      track: 'Full Stack',  progressPercent: 82, isOnline: true,  joinedDate: '2024-09-01', avatarColor: 'from-teal-500 to-green-500'   },
  { id: 10, name: 'Mona Tarek',      nameAr: 'منى طارق',     initials: 'MT', role: 'Cloud Engineer',  roleAr: 'مهندسة سحابية',      track: 'Cloud',       progressPercent: 55, isOnline: false, joinedDate: '2024-09-06', avatarColor: 'from-sky-500 to-blue-500'     },
]

// ── Mentor ────────────────────────────────────────────────────────

export const mockMentor: MentorProfile = {
  id: 1,
  name: 'Dr. Amr Saad',
  nameAr: 'د. عمرو سعد',
  bio: 'Senior Software Engineer at Amazon with 10+ years in full-stack & AI/ML. Passionate about helping the next generation of MENA developers.',
  bioAr: 'مهندس برمجيات أول في أمازون بخبرة أكثر من 10 سنوات في تطوير البرمجيات والذكاء الاصطناعي.',
  expertise: ['React', 'Node.js', 'Python', 'Machine Learning', 'System Design', 'AWS'],
  rating: 4.9,
  groupsCount: 3,
  maxGroups: 5,
  sessionRate: 'Free',
  avatarInitials: 'AS',
  avatarColor: 'from-blue-500 to-violet-500',
  yearsExperience: 10,
}

// ── Salary Data ───────────────────────────────────────────────────

export const mockSalaryData: TrackSalaryData[] = [
  {
    track: 'Frontend', trackAr: 'واجهات المستخدم',
    data: [
      { seniority: 'Junior', seniorityAr: 'مبتدئ',  avg: 45000,  min: 35000,  max: 55000  },
      { seniority: 'Mid',    seniorityAr: 'متوسط',  avg: 75000,  min: 60000,  max: 90000  },
      { seniority: 'Senior', seniorityAr: 'خبير',   avg: 120000, min: 95000,  max: 160000 },
    ],
    demandScore: 82, jobCount: 12400, growthPercent: 18,
  },
  {
    track: 'Backend', trackAr: 'الخوادم',
    data: [
      { seniority: 'Junior', seniorityAr: 'مبتدئ',  avg: 48000,  min: 38000,  max: 58000  },
      { seniority: 'Mid',    seniorityAr: 'متوسط',  avg: 82000,  min: 65000,  max: 100000 },
      { seniority: 'Senior', seniorityAr: 'خبير',   avg: 135000, min: 110000, max: 180000 },
    ],
    demandScore: 88, jobCount: 18700, growthPercent: 22,
  },
  {
    track: 'AI / ML', trackAr: 'الذكاء الاصطناعي',
    data: [
      { seniority: 'Junior', seniorityAr: 'مبتدئ',  avg: 65000,  min: 50000,  max: 80000  },
      { seniority: 'Mid',    seniorityAr: 'متوسط',  avg: 110000, min: 90000,  max: 135000 },
      { seniority: 'Senior', seniorityAr: 'خبير',   avg: 175000, min: 140000, max: 230000 },
    ],
    demandScore: 95, jobCount: 9800, growthPercent: 45,
  },
  {
    track: 'Mobile', trackAr: 'تطبيقات موبايل',
    data: [
      { seniority: 'Junior', seniorityAr: 'مبتدئ',  avg: 42000,  min: 33000,  max: 52000  },
      { seniority: 'Mid',    seniorityAr: 'متوسط',  avg: 70000,  min: 55000,  max: 88000  },
      { seniority: 'Senior', seniorityAr: 'خبير',   avg: 115000, min: 88000,  max: 150000 },
    ],
    demandScore: 76, jobCount: 7200, growthPercent: 14,
  },
  {
    track: 'Cybersecurity', trackAr: 'الأمن السيبراني',
    data: [
      { seniority: 'Junior', seniorityAr: 'مبتدئ',  avg: 55000,  min: 44000,  max: 68000  },
      { seniority: 'Mid',    seniorityAr: 'متوسط',  avg: 95000,  min: 75000,  max: 115000 },
      { seniority: 'Senior', seniorityAr: 'خبير',   avg: 145000, min: 115000, max: 195000 },
    ],
    demandScore: 91, jobCount: 6100, growthPercent: 33,
  },
]

// ── Top Skills ────────────────────────────────────────────────────

export const mockTopSkills: MarketSkill[] = [
  { skill: 'TypeScript',      demandScore: 92, category: 'Language'  },
  { skill: 'React',           demandScore: 89, category: 'Framework' },
  { skill: 'Python',          demandScore: 88, category: 'Language'  },
  { skill: 'AWS',             demandScore: 85, category: 'Cloud'     },
  { skill: 'Docker',          demandScore: 83, category: 'DevOps'    },
  { skill: 'Machine Learning',demandScore: 80, category: 'AI/ML'     },
  { skill: 'Node.js',         demandScore: 79, category: 'Framework' },
  { skill: 'PostgreSQL',      demandScore: 75, category: 'Database'  },
  { skill: 'Kubernetes',      demandScore: 72, category: 'DevOps'    },
  { skill: 'Cybersecurity',   demandScore: 70, category: 'Security'  },
]

// ── Events (6) ────────────────────────────────────────────────────

export const mockEvents: EventItem[] = [
  {
    id: 1,
    title: 'React Advanced Patterns Workshop',
    titleAr: 'ورشة React للمستويات المتقدمة',
    description: 'Deep dive into advanced React patterns: compound components, render props, custom hooks, and performance optimization.',
    descriptionAr: 'غوص عميق في أنماط React المتقدمة: المكونات المركبة، خطافات مخصصة، وتحسين الأداء.',
    category: 'Workshop', categoryAr: 'ورشة عمل',
    date: '2026-03-05T18:00:00Z', location: 'Cairo, Egypt', locationAr: 'القاهرة، مصر',
    isOnline: true, registrationUrl: '#',
    speaker: 'Ahmed Mahmoud', speakerAr: 'أحمد محمود',
    tags: ['React', 'TypeScript', 'Performance'], spotsLeft: 34, totalSpots: 100,
  },
  {
    id: 2,
    title: 'AI/ML Career Path Webinar',
    titleAr: 'ندوة مسار مهنة الذكاء الاصطناعي',
    description: 'How to break into AI/ML as a CS graduate from MENA. Tools, roadmap, salaries, and real-world advice.',
    descriptionAr: 'كيف تدخل مجال الذكاء الاصطناعي كخريج حاسبات من منطقة مينا.',
    category: 'Webinar', categoryAr: 'ندوة إلكترونية',
    date: '2026-02-25T16:00:00Z', location: 'Online', locationAr: 'أونلاين',
    isOnline: true, registrationUrl: '#',
    speaker: 'Dr. Sarah El-Masry', speakerAr: 'د. سارة المصري',
    tags: ['AI', 'Machine Learning', 'Career'], spotsLeft: 200, totalSpots: 500,
  },
  {
    id: 3,
    title: 'MENA Dev Hackathon 2026',
    titleAr: 'هاكاثون مطوري منطقة مينا 2026',
    description: '48-hour hackathon building solutions for real MENA challenges. $10,000 in prizes.',
    descriptionAr: 'هاكاثون 48 ساعة لبناء حلول لتحديات منطقة مينا. 10,000 دولار جوائز.',
    category: 'Hackathon', categoryAr: 'هاكاثون',
    date: '2026-04-10T09:00:00Z', location: 'Alexandria, Egypt', locationAr: 'الإسكندرية، مصر',
    isOnline: false, registrationUrl: '#',
    speaker: 'Multiple Mentors', speakerAr: 'عدة مرشدين',
    tags: ['Hackathon', 'Innovation', 'Prize'], spotsLeft: 15, totalSpots: 200,
  },
  {
    id: 4,
    title: 'Cloud & DevOps Summit',
    titleAr: 'قمة السحابة والديف أوبس',
    description: 'Annual gathering of cloud engineers from MENA. AWS, Azure, GCP talks. Infrastructure as Code workshops.',
    descriptionAr: 'تجمع سنوي لمهندسي السحابة من منطقة مينا.',
    category: 'Conference', categoryAr: 'مؤتمر',
    date: '2026-05-20T08:00:00Z', location: 'Dubai, UAE', locationAr: 'دبي، الإمارات',
    isOnline: false, registrationUrl: '#',
    speaker: 'Various Speakers', speakerAr: 'متحدثون متعددون',
    tags: ['AWS', 'DevOps', 'Cloud'], spotsLeft: 85, totalSpots: 300,
  },
  {
    id: 5,
    title: 'Cairo Tech Meetup — Feb 2026',
    titleAr: 'لقاء القاهرة التقني — فبراير 2026',
    description: 'Monthly networking event for Cairo tech community. Lightning talks, networking, and job board.',
    descriptionAr: 'فعالية تواصل شهرية لمجتمع القاهرة التقني.',
    category: 'Meetup', categoryAr: 'لقاء',
    date: '2026-02-27T19:00:00Z', location: 'Cairo, Egypt', locationAr: 'القاهرة، مصر',
    isOnline: false, registrationUrl: '#',
    speaker: 'Community Leads', speakerAr: 'قادة المجتمع',
    tags: ['Networking', 'Community'], spotsLeft: 22, totalSpots: 60,
  },
  {
    id: 6,
    title: 'Cybersecurity Fundamentals Bootcamp',
    titleAr: 'بوتكامب أساسيات الأمن السيبراني',
    description: 'Weekend intensive: network security, ethical hacking basics, CTF intro. Perfect for CS students.',
    descriptionAr: 'مكثف عطلة نهاية الأسبوع في أمان الشبكات وأساسيات الاختراق الأخلاقي.',
    category: 'Workshop', categoryAr: 'ورشة عمل',
    date: '2026-03-14T10:00:00Z', location: 'Online', locationAr: 'أونلاين',
    isOnline: true, registrationUrl: '#',
    speaker: 'Layla Mansour', speakerAr: 'ليلى منصور',
    tags: ['Cybersecurity', 'Ethical Hacking'], spotsLeft: 40, totalSpots: 80,
  },
]

// ── Roadmap Stages ────────────────────────────────────────────────

export const mockRoadmapStages: RoadmapStage[] = [
  {
    id: 1, stage_order: 1, title: 'Web Fundamentals', titleAr: 'أساسيات الويب',
    description: 'HTML5 semantics, CSS3, responsive design, accessibility, and browser DevTools.',
    estimated_hours: 60, status: 'completed', progressPercent: 100,
    skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
  },
  {
    id: 2, stage_order: 2, title: 'JavaScript Core', titleAr: 'أساسيات جافاسكريبت',
    description: 'ES6+, async/await, DOM manipulation, fetch API, and TypeScript basics.',
    estimated_hours: 80, status: 'in_progress', progressPercent: 65,
    skills: ['ES6+', 'TypeScript', 'Async/Await', 'DOM API'],
  },
  {
    id: 3, stage_order: 3, title: 'React Ecosystem', titleAr: 'نظام React البيئي',
    description: 'React 18, hooks, Redux Toolkit, React Router, and testing.',
    estimated_hours: 100, status: 'locked', progressPercent: 0,
    skills: ['React 18', 'Redux Toolkit', 'React Router', 'Jest'],
  },
  {
    id: 4, stage_order: 4, title: 'Advanced Frontend', titleAr: 'الواجهات المتقدمة',
    description: 'Performance optimization, accessibility, and CI/CD for frontend.',
    estimated_hours: 60, status: 'locked', progressPercent: 0,
    skills: ['Lighthouse', 'Web Vitals', 'Webpack', 'A11y'],
  },
  {
    id: 5, stage_order: 5, title: 'Portfolio & Job Ready', titleAr: 'محفظة الأعمال والتوظيف',
    description: 'Build 3 portfolio projects, write your resume, ace technical interviews.',
    estimated_hours: 40, status: 'locked', progressPercent: 0,
    skills: ['Portfolio', 'Resume', 'System Design', 'LeetCode'],
  },
]

// ── Dashboard Stats ───────────────────────────────────────────────

export const mockDashboardStats = {
  streakDays: 14,
  overallProgress: 37,
  nextMilestone: 'Complete ES6 Async/Await Module',
  nextMilestoneAr: 'أكمل وحدة ES6 Async/Await',
  totalHoursLearned: 89,
  totalHoursTarget: 340,
  weeklyGoalHours: 10,
  weeklyCompletedHours: 7,
  rank: 'Rising Star',
  rankAr: 'نجم صاعد',
  groupName: 'Frontend Pioneers',
  groupNameAr: 'رواد الواجهات',
  selectedTrack: 'Frontend Development',
  selectedTrackAr: 'تطوير الواجهات',
}

// ── Track Recommendations (onboarding) ───────────────────────────

export const mockTrackRecommendations = [
  {
    track: 'Frontend Development',
    trackAr: 'تطوير الواجهات',
    confidence: 92,
    description: 'You have strong creativity and UI/UX interest. React, TypeScript, and design systems await you.',
    descriptionAr: 'لديك إبداع قوي واهتمام بتجربة المستخدم. مسار React وTypeScript ينتظرك.',
    color: 'from-blue-500 to-cyan-500',
    icon: '🎨',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    salaryRange: '$45K – $160K',
  },
  {
    track: 'Full Stack Development',
    trackAr: 'تطوير متكامل',
    confidence: 78,
    description: 'Balance of frontend and backend. Node.js, databases, and REST APIs.',
    descriptionAr: 'توازن بين الواجهات والخوادم. Node.js وقواعد البيانات وAPIs.',
    color: 'from-violet-500 to-purple-500',
    icon: '⚡',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    salaryRange: '$50K – $170K',
  },
  {
    track: 'UI/UX Design',
    trackAr: 'تصميم تجربة المستخدم',
    confidence: 71,
    description: 'Your creativity and user empathy make you a natural designer. Figma and design systems.',
    descriptionAr: 'إبداعك وتعاطفك مع المستخدم يجعلانك مصمماً طبيعياً.',
    color: 'from-pink-500 to-rose-500',
    icon: '✨',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    salaryRange: '$40K – $140K',
  },
]
