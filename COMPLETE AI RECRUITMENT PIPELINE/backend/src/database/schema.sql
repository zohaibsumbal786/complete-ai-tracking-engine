-- Users (recruiters/admins)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'recruiter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Roles
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    requirements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    cv_file_path VARCHAR(500),
    parsed_data JSONB,
    bias_free_profile JSONB,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    screening_score INTEGER DEFAULT 0,
    notes TEXT,
    UNIQUE(candidate_id, job_id)
);

-- Screening Questions
CREATE TABLE IF NOT EXISTS screening_questions (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options JSONB,
    correct_answer TEXT,
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidate Answers
CREATE TABLE IF NOT EXISTS candidate_answers (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES screening_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    interviewer_id INTEGER REFERENCES users(id),
    meeting_link VARCHAR(500),
    status VARCHAR(50) DEFAULT 'scheduled',
    calendar_event_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log (for fairness tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    candidate_id INTEGER REFERENCES candidates(id),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled ON interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
