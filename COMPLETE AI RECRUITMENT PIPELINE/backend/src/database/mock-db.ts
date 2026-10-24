// Mock database for quick testing without PostgreSQL
export const mockDb = {
  users: [
    {
      id: 1,
      email: 'admin@recruitment.ai',
      password_hash: '$2a$10$YourHashedPasswordHere',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date()
    }
  ],
  jobs: [
    {
      id: 1,
      title: 'Senior Software Developer',
      description: 'Looking for an experienced full-stack developer',
      salary_min: 80000,
      salary_max: 120000,
      status: 'active',
      requirements: { skills: ['React', 'Node.js', 'PostgreSQL'], experience: '5+ years' },
      created_at: new Date(),
      created_by: 1,
      applicant_count: 15
    },
    {
      id: 2,
      title: 'Junior Software Engineer',
      description: 'Entry-level position for recent graduates',
      salary_min: 50000,
      salary_max: 70000,
      status: 'active',
      requirements: { skills: ['JavaScript', 'HTML', 'CSS'], experience: '0-2 years' },
      created_at: new Date(),
      created_by: 1,
      applicant_count: 32
    },
    {
      id: 3,
      title: 'Product Designer',
      description: 'Creative designer for our product team',
      salary_min: 70000,
      salary_max: 95000,
      status: 'active',
      requirements: { skills: ['Figma', 'UI/UX', 'Prototyping'], experience: '3+ years' },
      created_at: new Date(),
      created_by: 1,
      applicant_count: 8
    }
  ],
  candidates: [],
  applications: [],
  screening_questions: [],
  candidate_answers: [],
  interviews: [],
  audit_logs: []
};

export const getMockAnalytics = () => ({
  totalApplications: 107,
  applicationsByStatus: [
    { status: 'applied', count: 50 },
    { status: 'screening_completed', count: 24 },
    { status: 'interview_scheduled', count: 18 },
    { status: 'offer', count: 9 },
    { status: 'hired', count: 6 }
  ],
  activeJobs: 3,
  averageTimeToHire: 14.5,
  applicationsByJob: [
    { title: 'Senior Software Developer', count: 45 },
    { title: 'Junior Software Engineer', count: 38 },
    { title: 'Product Designer', count: 24 }
  ],
  recentApplications: []
});
