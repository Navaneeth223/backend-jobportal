import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Building2, ArrowRight, Sparkles } from 'lucide-react';

const PortalSelect = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('access_token', token);
      console.log('Successfully injected access_token from query parameter.');
    }
  }, []);


  const cards = [
    {
      id: 'candidate',
      title: "I'm a Candidate",
      subtitle: 'Search jobs, track applications, and build your profile.',
      icon: UserCircle2,
      buttonText: 'Enter Candidate Portal',
      path: '/candidate/onboarding',
      accent: 'from-sky-500 to-blue-600',
      surface: 'from-sky-50 via-white to-blue-50',
      iconSurface: 'bg-sky-100 text-sky-700',
      borderHover: 'hover:border-sky-200 hover:shadow-sky-100',
    },
    {
      id: 'company',
      title: "I'm a Company",
      subtitle: 'Post jobs, review applicants, and manage your hiring pipeline.',
      icon: Building2,
      buttonText: 'Enter Company Portal',
      path: '/dashboard',
      accent: 'from-amber-500 to-orange-500',
      surface: 'from-amber-50 via-white to-orange-50',
      iconSurface: 'bg-amber-100 text-amber-700',
      borderHover: 'hover:border-amber-200 hover:shadow-amber-100',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.18),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
            <Sparkles size={16} />
            Pick your workspace
          </div>
          <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-200">
            <Building2 size={30} className="text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Welcome to your job portal
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Choose the experience you want to open. This section stays in light mode and scales cleanly from mobile to desktop.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => navigate(card.path)}
                className={`group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br ${card.surface} p-6 text-left shadow-[0_18px_55px_-28px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-32px_rgba(15,23,42,0.45)] sm:p-8 ${card.borderHover}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`} />

                <div className="space-y-5">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconSurface} shadow-sm`}>
                    <Icon size={30} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{card.title}</h2>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">{card.subtitle}</p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between rounded-2xl bg-white/90 px-5 py-4 shadow-sm ring-1 ring-slate-100">
                  <span className="text-sm font-bold text-slate-900 sm:text-base">{card.buttonText}</span>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${card.accent} text-white transition-transform duration-300 group-hover:translate-x-1`}>
                    <ArrowRight size={18} />
                  </span>
                </div>

                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.accent} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
              </button>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-500 lg:mt-10">
          © 2026 JobPortal. Build your next move with clarity.
        </p>
      </div>
    </div>
  );
};

export default PortalSelect;
