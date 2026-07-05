import { supabase } from './supabase';

// ======================================
//  READ
// ======================================

export async function getSira() {
  const { data, error } = await supabase
    .from('app_configurations')
    .select('value')
    .eq('key', 'sira')
    .single();

  if (error || !data) return defaultSira();
  
  const row = data.value as any;
  return {
    firstName:  row.firstName || '',
    lastName:   row.lastName || '',
    title:      row.title || '',
    subtitle:   row.subtitle || '',
    bio:        row.bio || '',
    email:      row.email || '',
    phone:      row.phone || '',
    location:   row.location || '',
    instagram:  row.instagram || '',
    linkedin:   row.linkedin || '',
    photo:      row.photo || '',
    projectsCompleted: row.projectsCompleted || '',
    pagesProofread: row.pagesProofread || '',
    yearsExperience: row.yearsExperience || '',
    customerSatisfaction: row.customerSatisfaction || '',
  };
}

export async function getKafaat() {
  const { data, error } = await supabase.from('app_configurations').select('value').eq('key', 'skills').single();
  if (error || !data) return [];
  return data.value || [];
}

export async function getMakhtutat() {
  const { data, error } = await supabase.from('app_configurations').select('value').eq('key', 'works').single();
  if (error || !data) return [];
  return data.value || [];
}

export async function getKitabat() {
  const { data, error } = await supabase.from('app_configurations').select('value').eq('key', 'articles').single();
  if (error || !data) return [];
  return data.value || [];
}

export async function getImtihanat() {
  const { data, error } = await supabase.from('app_configurations').select('value').eq('key', 'tests').single();
  if (error || !data) return [];
  return data.value || [];
}

export async function getAllData() {
  const [siteOwner, skills, proofreadingWorks, articles, tests] = await Promise.all([
    getSira(),
    getKafaat(),
    getMakhtutat(),
    getKitabat(),
    getImtihanat(),
  ]);

  return { siteOwner, skills, proofreadingWorks, articles, tests };
}

// ======================================
//  WRITE
// ======================================

export async function saveSira(data: any) {
  const { error } = await supabase.from('app_configurations').upsert({ key: 'sira', value: data });
  if (error) console.error('Error saving sira:', error);
}

export async function saveKafaat(skills: any[]) {
  const { error } = await supabase.from('app_configurations').upsert({ key: 'skills', value: skills });
  if (error) console.error('Error saving kafaat:', error);
}

export async function saveMakhtutat(works: any[]) {
  const { error } = await supabase.from('app_configurations').upsert({ key: 'works', value: works });
  if (error) console.error('Error saving makhtutat:', error);
}

export async function saveKitabat(articles: any[]) {
  const { error } = await supabase.from('app_configurations').upsert({ key: 'articles', value: articles });
  if (error) console.error('Error saving kitabat:', error);
}

export async function saveImtihanat(tests: any[]) {
  const { error } = await supabase.from('app_configurations').upsert({ key: 'tests', value: tests });
  if (error) console.error('Error saving imtihanat:', error);
}

export async function migrateFromJson(jsonData: any) {
  // Logic removed
}

function defaultSira() {
  return {
    firstName: 'إخلاص', lastName: 'بوعلام',
    title: 'معلمة اللغة العربية للتعليم الابتدائي',
    subtitle: 'طالبة في المدرسة العليا للتعليم',
    bio: '', email: '', phone: '', location: 'الجزائر',
    instagram: '', linkedin: '', photo: '',
    projectsCompleted: '',
    pagesProofread: '',
    yearsExperience: '',
    customerSatisfaction: '',
  };
}
