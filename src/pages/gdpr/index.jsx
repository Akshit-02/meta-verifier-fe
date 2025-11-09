import { useState, useEffect } from "react";

const GDPRPage = () => {
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

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-32 pb-12 relative">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#D4D4D4] p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#2B2B2B]/10 border border-[#2B2B2B]/20 rounded-full text-sm text-[#2B2B2B] font-medium mb-4">
              📋 Legal Information
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
              GDPR and Briggo App
            </h1>
            <p className="text-lg text-[#919191]">
              Your data protection and privacy matters to us
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                What is GDPR?
              </h2>
              <p className="text-[#919191] leading-relaxed mb-4">
                GDPR stands for General Data Protection Regulation. A new law
                enforced by EU to protect end user's personal data. This law
                enforces several aspects of data security. Here we want to
                provide a guideline on how we protect your data, what our
                responsibilities are, and what your responsibilities are.
              </p>
              <p className="text-[#919191] leading-relaxed">
                We strongly suggest you read all our documentation or other
                articles about GDPR and decide whether you want to use our
                application or not. We are not responsible for any negligence or
                fault in data protection on your side or any third party's side.
                Take your time to read the documentation and act wisely, stay
                safe.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                Definition of Personal Data
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Any data owned by an individual is his or her personal data. It
                could be someone's name, image, email address, physical address,
                social media post, location, computer IP address, etc. The
                ownership of user's personal data is absolute. That means
                wherever and however the data is saved, it belongs to the user
                solely.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                Responsibility of Developer
              </h2>
              <p className="text-[#919191] leading-relaxed mb-4">
                The safeguard of user personal data on application back end is
                the responsibility of the developer. Developer is responsible
                for how the user data (name, telephone no., email, etc.) and
                other info (like logs of user interaction with application) is
                stored on database and server.
              </p>
              <p className="text-[#919191] leading-relaxed">
                We will describe in detail how the data you submit directly
                (name, email, etc.) and indirectly (browser name, computer IP,
                etc.) are saved on the database and server. Once any data is
                uploaded to the server, the security of data depends on the
                security of the server and sometimes the admin of the
                application.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                Our Action on GDPR
              </h2>
              <ul className="space-y-3">
                {[
                  "Collect as little data as possible. Tell the user the necessity of collecting specific data.",
                  "Enforce HTTPS",
                  "Destroy all sessions and cookies after logout",
                  "Do not track user activity for commercial purposes",
                  "Inform users of any logs that save computer IP and location",
                  "Provide clear terms and conditions",
                  "Inform users about any data sharing with third parties",
                  "Create clear policies about data breaches",
                  "Delete data on subscription cancellation or account deletion",
                  "Patch web vulnerabilities",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2B2B2B] to-[#919191] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-[#919191] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6 pb-2 border-b-2 border-[#D4D4D4]">
                Supported GDPR Features
              </h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#F1F1F1] to-white p-6 rounded-2xl border border-[#D4D4D4] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👋</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">
                        Adios, Application
                      </h3>
                      <p className="text-[#919191] leading-relaxed">
                        Once you cancel your subscription or delete your
                        account, we give you the option to delete all your data
                        existing or related to your account. Note that this
                        action is irreversible. The moment you say yes to
                        delete, all your data will be erased from the database
                        and server forever. You can back up data before deletion
                        in case of re-subscription or re-registration.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#F1F1F1] to-white p-6 rounded-2xl border border-[#D4D4D4] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#919191] to-[#D4D4D4] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">
                        Secrecy is my right
                      </h3>
                      <p className="text-[#919191] leading-relaxed">
                        We encrypt most of your personal data in the database.
                        If any breach occurs, the hacker will get encrypted
                        hashes, not your personal data in plain text. So your
                        secrecy will remain intact even in case of a data
                        breach. Note that some data cannot be encrypted because
                        we need to show it upon login to the account (like
                        username). We will hide all your personal data as much
                        as possible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#F1F1F1] to-white p-6 rounded-2xl border border-[#D4D4D4] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2B2B2B] via-[#919191] to-[#2B2B2B] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">
                        Bulk Messaging Compliance
                      </h3>
                      <p className="text-[#919191] leading-relaxed mb-3">
                        <strong className="text-[#2B2B2B]">
                          Is sending bulk messages to Facebook leads using our
                          system GDPR compliant?
                        </strong>
                      </p>
                      <p className="text-[#919191] leading-relaxed">
                        Yes, sending bulk messages using our system is GDPR
                        compliant because people OPT-IN to our Facebook page by
                        starting a messenger conversation, and we can prove it.
                        They become our leads in a valid way. All messages we
                        send must have an unsubscribe link (we already have this
                        feature) or another way for people to unsubscribe at any
                        time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#D4D4D4] py-12 bg-white mt-12 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <a href="/">
              <img src="/briggoLogo.svg" alt="" className="h-12 w-28" />
            </a>
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
      `}</style>
    </div>
  );
};

export default GDPRPage;
