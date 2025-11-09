import { useState, useEffect } from "react";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#D4D4D4] overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2B2B2B]/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#919191]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#2B2B2B]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FFFFFF]/95 backdrop-blur-lg shadow-xl shadow-[#2B2B2B]/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
                B
              </div>
              <span className="text-2xl font-bold text-[#2B2B2B]">briggo</span>
            </div> */}
            <a href="/">
              <img src="/briggoLogo.svg" alt="" className="h-12 w-28" />
            </a>
            <div className="flex items-center space-x-6">
              <a
                href="/login"
                className="px-6 py-2.5 rounded-full bg-[#2B2B2B] text-white hover:bg-[#919191] transition-all duration-300 font-medium shadow-lg shadow-[#2B2B2B]/30 hover:shadow-xl hover:scale-105"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-[#2B2B2B]/10 border border-[#2B2B2B]/20 rounded-full text-sm text-[#2B2B2B] font-medium mb-4">
              🚀 Automate Your Instagram Growth
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[#2B2B2B]">
              Grow Instagram on
              <span className="block relative">
                <span className="relative z-10">Autopilot</span>
              </span>
            </h1>
            <p className="text-xl text-[#919191] leading-relaxed">
              Automate comments, story replies, DMs, and more. Let Briggo handle
              engagement while you create amazing content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/login"
                className="group px-8 py-4 bg-[#2B2B2B] text-white rounded-full font-semibold hover:bg-[#919191] hover:shadow-2xl transition-all duration-300 text-center transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Hero Animation */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B2B2B] to-[#919191] rounded-3xl opacity-10 blur-3xl animate-pulse"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-[#D4D4D4]">
                <div className="space-y-4">
                  {/* Animated metrics */}
                  <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-xl border border-[#D4D4D4] animate-slide-up hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div>
                        <div className="text-sm text-[#919191] font-medium">
                          Comments Today
                        </div>
                        <div className="text-2xl font-bold text-[#2B2B2B]">
                          247
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded">
                      +23%
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-xl border border-[#D4D4D4] animate-slide-up hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#919191] to-[#D4D4D4] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">📩</span>
                      </div>
                      <div>
                        <div className="text-sm text-[#919191] font-medium">
                          DMs Sent
                        </div>
                        <div className="text-2xl font-bold text-[#2B2B2B]">
                          143
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded">
                      +45%
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-xl border border-[#D4D4D4] animate-slide-up hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#2B2B2B] via-[#919191] to-[#2B2B2B] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">📸</span>
                      </div>
                      <div>
                        <div className="text-sm text-[#919191] font-medium">
                          Story Replies
                        </div>
                        <div className="text-2xl font-bold text-[#2B2B2B]">
                          89
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded">
                      +67%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2B2B2B]">
              Powerful Features
            </h2>
            <p className="text-xl text-[#919191] max-w-2xl mx-auto">
              Everything you need to automate and scale your Instagram presence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Comments",
                description:
                  "AI-powered comment automation that engages authentically with your target audience",
                icon: "💬",
                gradient: "from-[#2B2B2B] to-[#919191]",
              },
              {
                title: "Story Replies",
                description:
                  "Automatically respond to story mentions and engage with your community",
                icon: "📸",
                gradient: "from-[#919191] to-[#D4D4D4]",
              },
              {
                title: "Auto DM Campaigns",
                description:
                  "Send personalized direct messages to grow your audience on autopilot",
                icon: "📩",
                gradient: "from-[#2B2B2B] to-[#D4D4D4]",
              },
              {
                title: "Analytics Dashboard",
                description:
                  "Track your growth with detailed insights and performance metrics",
                icon: "📊",
                gradient: "from-[#D4D4D4] to-[#919191]",
              },
              {
                title: "Smart Scheduling",
                description:
                  "Post at optimal times when your audience is most active",
                icon: "⏰",
                gradient: "from-[#919191] to-[#2B2B2B]",
              },
              {
                title: "Safe & Compliant",
                description:
                  "Stay within Instagram's guidelines with our smart rate limiting",
                icon: "🛡️",
                gradient: "from-[#2B2B2B] via-[#919191] to-[#2B2B2B]",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-[#F1F1F1] to-white p-8 rounded-2xl border border-[#D4D4D4] hover:border-[#919191] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className={`text-5xl mb-4 inline-block p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#2B2B2B]">
                  {feature.title}
                </h3>
                <p className="text-[#919191] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 relative bg-gradient-to-br from-[#F1F1F1] to-[#D4D4D4]"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2B2B2B]">
              How It Works
            </h2>
            <p className="text-xl text-[#919191]">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Connect Account",
                desc: "Securely link your Instagram account",
              },
              {
                step: "2",
                title: "Set Preferences",
                desc: "Choose your automation settings",
              },
              {
                step: "3",
                title: "Watch Growth",
                desc: "Sit back and watch your engagement soar",
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#2B2B2B]">
                  {item.title}
                </h3>
                <p className="text-[#919191] text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="relative bg-gradient-to-r from-[#2B2B2B] via-[#919191] to-[#2B2B2B] rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Automate Your Growth?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-[#F1F1F1]">
                Join 10,000+ creators using Briggo to save time and grow their
                Instagram presence
              </p>
              <a
                href="/login"
                className="inline-block px-10 py-5 bg-white text-[#2B2B2B] rounded-full font-bold hover:bg-[#F1F1F1] transition-all duration-300 shadow-2xl hover:scale-105"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4D4D4] py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <a href="/">
              <img src="/briggoLogo.svg" alt="" className="h-12 w-28" />
            </a>
            {/* <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-lg shadow-lg"></div>
              <span className="font-bold text-[#2B2B2B]">briggo</span>
            </div> */}
            <div className="text-[#919191] text-sm">
              © {new Date().getFullYear()} Briggo. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="/privacy-policy"
                className="text-[#919191] hover:text-[#2B2B2B] transition-colors font-medium"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-[#919191] hover:text-[#2B2B2B] transition-colors font-medium"
              >
                Terms
              </a>
              <a
                href="/gdpr"
                className="text-[#919191] hover:text-[#2B2B2B] transition-colors font-medium"
              >
                GDPR
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
