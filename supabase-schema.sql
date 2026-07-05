-- 1. portfolio_achievements (بدلًا من certificates)
CREATE TABLE IF NOT EXISTS public.portfolio_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  issuer text,
  issue_date date,
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. training_programs (بدلًا من courses)
CREATE TABLE IF NOT EXISTS public.training_programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  instructor text,
  duration text,
  level text,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. published_books (بدلًا من novels)
CREATE TABLE IF NOT EXISTS public.published_books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  publish_date date,
  summary text,
  cover_image text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. user_enrollments (بدلًا من registrations)
CREATE TABLE IF NOT EXISTS public.user_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name text NOT NULL,
  user_email text NOT NULL,
  program_id uuid REFERENCES public.training_programs(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. app_configurations (بدلًا من settings)
CREATE TABLE IF NOT EXISTS public.app_configurations (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. professional_competencies (بدلًا من skills)
CREATE TABLE IF NOT EXISTS public.professional_competencies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text,
  proficiency_level integer CHECK (proficiency_level >= 1 AND proficiency_level <= 100),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- تفعيل الأمان RLS
ALTER TABLE public.portfolio_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_competencies ENABLE ROW LEVEL SECURITY;
