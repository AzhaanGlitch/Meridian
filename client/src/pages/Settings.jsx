import React, { useState } from 'react';
import { User, Save, Check } from 'lucide-react';

const Settings = () => {
  const [name, setName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('meridian_user') || '{}');
      return u.name || '';
    } catch {
      return '';
    }
  });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white min-h-full pb-12">
      <main className="px-8 py-8 space-y-6 max-w-4xl">
        {/* Uniform Page Heading */}
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Settings
        </h1>

        {/* Profile Settings Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] soft-shadow space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
            <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white">
              <User className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm">User Profile & Preferences</h3>
              <p className="text-xs text-[#64748B]">Update display name and system notifications</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-[#0F172A] mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-2.5 font-medium text-[#0F172A]"
              />
            </div>

            <div className="pt-2 space-y-3">
              <span className="block text-[#0F172A] font-bold">Notifications & Digest</span>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0F172A]"
                />
                <span className="text-xs text-[#0F172A] font-medium">Send reminders for upcoming goal deadlines</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0F172A]"
                />
                <span className="text-xs text-[#0F172A] font-medium">Weekly productivity summary report</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-[#86EFAC]" />
                    <span>Saved Changes</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Settings;
