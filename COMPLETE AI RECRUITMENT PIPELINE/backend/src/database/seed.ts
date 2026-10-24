import pool from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ['admin@recruitment.ai', hashedPassword, 'Admin User', 'admin']
    );
    
    // Create sample jobs
    const jobsData = [
      {
        title: 'Senior Software Developer',
        description: 'Looking for an experienced full-stack developer',
        salary_min: 80000,
        salary_max: 120000,
        requirements: { skills: ['React', 'Node.js', 'PostgreSQL'], experience: '5+ years' }
      },
      {
        title: 'Junior Software Engineer',
        description: 'Entry-level position for recent graduates',
        salary_min: 50000,
        salary_max: 70000,
        requirements: { skills: ['JavaScript', 'HTML', 'CSS'], experience: '0-2 years' }
      },
      {
        title: 'Product Designer',
        description: 'Creative designer for our product team',
        salary_min: 70000,
        salary_max: 95000,
        requirements: { skills: ['Figma', 'UI/UX', 'Prototyping'], experience: '3+ years' }
      }
    ];
    
    for (const job of jobsData) {
      await pool.query(
        `INSERT INTO jobs (title, description, salary_min, salary_max, requirements, created_by) 
         VALUES ($1, $2, $3, $4, $5, 1)`,
        [job.title, job.description, job.salary_min, job.salary_max, JSON.stringify(job.requirements)]
      );
    }
    
    console.log('✅ Database seeded successfully');
    console.log('📧 Admin credentials: admin@recruitment.ai / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
