import type { Profile } from '../../lib/database.types';

interface Props {
  profile: Profile;
}

export default function ProfileHeader({ profile }: Props) {
  const initials = (profile.full_name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const categories: string[] = [];
  if (profile.student) categories.push('Student');
  if (profile.farmer) categories.push('Farmer');
  if (profile.startup_founder) categories.push('Entrepreneur');
  if (profile.senior_citizen) categories.push('Senior Citizen');
  if (profile.women) categories.push('Women');
  if (profile.msme) categories.push('MSME');
  if (profile.disability) categories.push('Disability');
  if (profile.widow) categories.push('Widow');
  if (profile.minority) categories.push('Minority');

  const categoryLabel = categories.length > 0 ? categories.join(' • ') : profile.occupation || 'Member';
  const locationLabel = [profile.district, profile.state].filter(Boolean).join(', ');

  const filledFields = [
    profile.full_name, profile.age, profile.gender, profile.state,
    profile.district, profile.category, profile.occupation, profile.education,
    profile.annual_income, profile.farmer, profile.student, profile.disability,
    profile.startup_founder, profile.widow, profile.minority, profile.senior_citizen,
    profile.msme, profile.women,
  ].filter((v) => v !== undefined && v !== null && v !== '' && v !== 0 && v !== false).length;

  const totalFields = 18;
  const completion = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="rounded-[32px] border border-white/10 bg-[#111827] p-8">

      <div className="flex items-center gap-6">

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl font-bold text-white">
          {initials}
        </div>

        <div>

          <h1 className="text-4xl font-bold text-white">
            {profile.full_name || 'User'}
          </h1>

          <p className="mt-2 text-white/40">
            {categoryLabel}{locationLabel ? ` • ${locationLabel}` : ''}
          </p>

          <p className="mt-3 text-cyan-400">
            Profile Completion : {completion}%
          </p>

        </div>

      </div>

    </div>
  )
}
