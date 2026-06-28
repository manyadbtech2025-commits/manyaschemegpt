import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/database.types';

export interface ProfileInput {
  fullName: string;
  age: number;
  gender: string;
  state: string;
  district: string;
  category: string;
  annualIncome: number;
  occupation: string;
  education: string;
  disability: boolean;
  farmer: boolean;
  startupFounder: boolean;
  student: boolean;
  widow: boolean;
  minority: boolean;
  seniorCitizen: boolean;
  msme: boolean;
  women: boolean;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function saveProfile(input: ProfileInput): Promise<boolean> {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error('No authenticated user:', userError);
    return false;
  }

  const { error } = await supabase.from('profiles').upsert({
    user_id: userData.user.id,
    email: userData.user.email || '',
    full_name: input.fullName,
    age: input.age,
    gender: input.gender,
    state: input.state,
    district: input.district,
    category: input.category,
    annual_income: input.annualIncome,
    occupation: input.occupation,
    education: input.education,
    disability: input.disability,
    farmer: input.farmer,
    startup_founder: input.startupFounder,
    student: input.student,
    widow: input.widow,
    minority: input.minority,
    senior_citizen: input.seniorCitizen,
    msme: input.msme,
    women: input.women,
  });

  if (error) {
    console.error('Error saving profile:', error);
    return false;
  }

  return true;
}
