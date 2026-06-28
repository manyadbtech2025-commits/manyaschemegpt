import type { Profile } from '../../lib/database.types';

interface Props {
  profile?: Profile;
}

export default function PersonalInfoCard({ profile }: Props) {
  const items = [
    { title: 'Full Name', value: profile?.full_name || 'Not set' },
    { title: 'Gender', value: profile?.gender || 'Not set' },
    { title: 'Age', value: profile?.age ? `${profile.age} years` : 'Not set' },
    { title: 'Occupation', value: profile?.occupation || 'Not set' },
    { title: 'State', value: profile?.state || 'Not set' },
    { title: 'District', value: profile?.district || 'Not set' },
    { title: 'Annual Income', value: profile?.annual_income ? `₹${profile.annual_income.toLocaleString('en-IN')}` : 'Not set' },
    { title: 'Category', value: profile?.category || 'Not set' },
    { title: 'Education', value: profile?.education || 'Not set' },
  ];

  const categories: { label: string; active: boolean }[] = [
    { label: 'Student', active: !!profile?.student },
    { label: 'Farmer', active: !!profile?.farmer },
    { label: 'Startup Founder', active: !!profile?.startup_founder },
    { label: 'MSME Owner', active: !!profile?.msme },
    { label: 'Senior Citizen', active: !!profile?.senior_citizen },
    { label: 'Women', active: !!profile?.women },
    { label: 'Widow', active: !!profile?.widow },
    { label: 'Minority', active: !!profile?.minority },
    { label: 'Disability', active: !!profile?.disability },
  ];

  const activeCategories = categories.filter(c => c.active);

  return (
    <div className="rounded-[32px] border border-white/10 bg-[#111827] p-8">

      <h2 className="mb-8 text-3xl font-bold text-white">
        Personal Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-[#0B0F19] p-6"
          >
            <p className="text-sm text-white/40">
              {item.title}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              {item.value}
            </h3>
          </div>
        ))}

      </div>

      {activeCategories.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
            Special Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {activeCategories.map((cat) => (
              <span
                key={cat.label}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium"
              >
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
