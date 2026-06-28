import { useState } from "react";
import { saveProfile } from "../../services/profile.service";

export default function ProfileForm() {
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    state: "",
    district: "",
    category: "",
    annualIncome: "",
    occupation: "",
    education: "",
    disability: false,
    farmer: false,
    startupFounder: false,
    student: false,
    widow: false,
    minority: false,
    seniorCitizen: false,
    msme: false,
    women: false,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(
    key: string,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    setSaving(true);
    const success = await saveProfile({
      fullName: form.fullName,
      age: Number(form.age),
      gender: form.gender,
      state: form.state,
      district: form.district,
      category: form.category,
      annualIncome: Number(form.annualIncome),
      occupation: form.occupation,
      education: form.education,
      disability: form.disability,
      farmer: form.farmer,
      startupFounder: form.startupFounder,
      student: form.student,
      widow: form.widow,
      minority: form.minority,
      seniorCitizen: form.seniorCitizen,
      msme: form.msme,
      women: form.women,
    });

    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const inputClass = "w-full rounded-2xl bg-[#0B0F19] border border-white/10 p-4 text-white placeholder:text-white/30 outline-none focus:border-cyan-500/50 transition";

  const checkboxClass = "flex items-center gap-3 text-white cursor-pointer rounded-xl border border-white/10 p-4 hover:border-white/20 transition";

  return (
    <div className="rounded-[32px] border border-cyan-500/20 bg-[#111827] p-8">

      <h2 className="text-3xl font-bold text-white">
        AI Welfare Profile
      </h2>

      <p className="mt-2 text-white/50">
        Complete your profile to receive personalized
        government scheme recommendations.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className={inputClass}
        />

        <input
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) => updateField("age", e.target.value)}
          className={inputClass}
        />

        <select
          value={form.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          className={inputClass}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => updateField("state", e.target.value)}
          className={inputClass}
        />

        <input
          placeholder="District"
          value={form.district}
          onChange={(e) => updateField("district", e.target.value)}
          className={inputClass}
        />

        <select
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          className={inputClass}
        >
          <option value="">Select Category</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="EWS">EWS</option>
        </select>

        <input
          placeholder="Annual Income (₹)"
          type="number"
          value={form.annualIncome}
          onChange={(e) => updateField("annualIncome", e.target.value)}
          className={inputClass}
        />

        <input
          placeholder="Occupation"
          value={form.occupation}
          onChange={(e) => updateField("occupation", e.target.value)}
          className={inputClass}
        />

        <input
          placeholder="Education"
          value={form.education}
          onChange={(e) => updateField("education", e.target.value)}
          className={inputClass}
        />

      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
          Special Categories
        </h3>
        <div className="grid gap-4 md:grid-cols-3">

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.student}
              onChange={(e) => updateField("student", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Student
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.farmer}
              onChange={(e) => updateField("farmer", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Farmer
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.disability}
              onChange={(e) => updateField("disability", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Person with Disability
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.startupFounder}
              onChange={(e) => updateField("startupFounder", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Startup Founder
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.msme}
              onChange={(e) => updateField("msme", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            MSME Owner
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.seniorCitizen}
              onChange={(e) => updateField("seniorCitizen", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Senior Citizen
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.women}
              onChange={(e) => updateField("women", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Women
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.widow}
              onChange={(e) => updateField("widow", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Widow
          </label>

          <label className={checkboxClass}>
            <input
              type="checkbox"
              checked={form.minority}
              onChange={(e) => updateField("minority", e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            Minority
          </label>

        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="mt-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 font-semibold text-white transition hover:scale-105 disabled:opacity-50"
      >
        {saving ? "Saving..." : saved ? "✅ Profile Saved!" : "Save AI Profile"}
      </button>

    </div>
  );
}
