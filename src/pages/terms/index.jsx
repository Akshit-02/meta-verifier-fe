import { useState, useEffect } from "react";

const TermsPage = () => {
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
              📜 Legal Agreement
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
              Terms of Use
            </h1>
          </div>

          <div className="space-y-8">
            {/* Important Notice Box */}
            <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] p-6 rounded-2xl">
              <p className="text-white leading-relaxed font-medium">
                BY ACCESSING OR USING https://social.briggo.in/ YOU REPRESENT
                THAT YOU HAVE THE FULL AUTHORITY TO ACT TO BIND YOURSELF, ANY
                THIRD PARTY, COMPANY, OR LEGAL ENTITY, AND THAT YOUR USE AND/OR
                INTERACTION, AS WELL AS CONTINUING TO USE OR INTERACT, WITH THE
                SITE CONSTITUTES YOUR HAVING READ AND AGREED TO THESE TERMS OF
                USE AS WELL AS OTHER AGREEMENTS THAT WE MAY POST ON THE SITE.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-[#919191] leading-relaxed">
                BY VIEWING, VISITING, USING, OR INTERACTING WITH
                https://social.briggo.in/ OR WITH ANY BANNER, POP-UP, OR
                ADVERTISING THAT APPEARS ON IT, YOU ARE AGREEING TO ALL THE
                PROVISIONS OF THIS TERMS OF USE POLICY AND THE PRIVACY POLICY OF
                https://social.briggo.in/.
              </p>

              <p className="text-[#919191] leading-relaxed">
                https://social.briggo.in/ SPECIFICALLY DENIES ACCESS TO ANY
                INDIVIDUAL THAT IS COVERED BY THE CHILDREN'S ONLINE PRIVACY
                PROTECTION ACT (COPPA) OF 1998.
              </p>

              <p className="text-[#919191] leading-relaxed">
                https://social.briggo.in/ RESERVES THE RIGHT TO DENY ACCESS TO
                ANY PERSON OR VIEWER FOR ANY LAWFUL REASON. UNDER THE TERMS OF
                THE PRIVACY POLICY, WHICH YOU ACCEPT AS A CONDITION FOR VIEWING,
                https://social.briggo.in/ IS ALLOWED TO COLLECT AND STORE DATA
                AND INFORMATION FOR THE PURPOSE OF EXCLUSION AND FOR MANY OTHER
                USES.
              </p>

              <p className="text-[#919191] leading-relaxed">
                THIS TERMS OF USE AGREEMENT MAY CHANGE FROM TIME TO TIME.
                VISITORS HAVE AN AFFIRMATIVE DUTY, AS PART OF THE CONSIDERATION
                FOR PERMISSION TO ACCESS https://social.briggo.in/, TO KEEP
                THEMSELVES INFORMED OF SUCH CHANGES BY REVIEWING THIS TERMS OF
                USE PAGE EACH TIME THEY VISIT https://social.briggo.in/.
              </p>
            </div>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                PARTIES TO THE TERMS OF USE AGREEMENT
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Visitors, viewers, users, subscribers, members, affiliates, or
                customers, collectively referred to herein as "Visitors," are
                parties to this agreement. The website and its owners and/or
                operators are parties to this agreement, herein referred to as
                "Website."
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                USE OF INFORMATION FROM THIS WEBSITE
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Unless you have entered into an express written contract with
                this website to the contrary, visitors, viewers, subscribers,
                members, affiliates, or customers have no right to use this
                information in a commercial or public setting; they have no
                right to broadcast it, copy it, save it, print it, sell it, or
                publish any portions of the content of this website. By
                accessing the contents of this website, you agree to this
                condition of access and you acknowledge that any unauthorized
                use is unlawful and may subject you to civil or criminal
                penalties. Again, Visitor has no rights whatsoever to use the
                content of, or portions thereof, including its databases,
                invisible pages, linked pages, underlying code, or other
                intellectual property the site may contain, for any reason or
                for any use whatsoever. In recognition of the fact that it may
                be difficult to quantify the exact damages arising from
                infringement of this provision, Visitor agrees to compensate the
                owners of https://social.briggo.in/ with liquidated damages in
                the amount of U.S. $100,000, or, if it can be calculated, the
                actual costs and actual damages for breach of this provision,
                whichever is greater. Visitor warrants that he or she
                understands that accepting this provision is a condition of
                accessing https://social.briggo.in/ and that accessing
                https://social.briggo.in/ constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                OWNERSHIP OF WEBSITE OR RIGHT TO USE, SELL, PUBLISH CONTENTS OF
                THIS WEBSITE
              </h2>
              <p className="text-[#919191] leading-relaxed">
                The website and its contents are owned or licensed by the
                website's owner. Material contained on the website must be
                presumed to be proprietary and copyrighted. Visitors have no
                rights whatsoever in the site content. Use of website content
                for any reason is unlawful unless it is done with express
                contract or permission of the website.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                HYPERLINKING TO SITE, CO-BRANDING, "FRAMING" AND REFERENCING
                SITE PROHIBITED
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Unless expressly authorized by website, no one may hyperlink
                https://social.briggo.in/, or portions thereof, (including, but
                not limited to, logotypes, trademarks, branding or copyrighted
                material) to theirs for any reason. Furthermore, you are not
                permitted to reference the URL (website address) of this website
                or any page of this website in any commercial or non-commercial
                media without express permission from us, nor are you allowed to
                'frame' the site. You specifically agree to cooperate with the
                Website to remove or de-activate any such activities, and be
                liable for all damages arising from violating this provision. In
                recognition of the fact that it may be difficult to quantify the
                exact damages arising from infringement of this provision, you
                agree to compensate the owners of https://social.briggo.in/ with
                liquidated damages in the amount of U.S. $100,000, or, if it can
                be calculated, the actual costs and actual damages for breach of
                this provision, whichever is greater. You warrant that you
                understand that accepting this provision is a condition of
                accessing https://social.briggo.in/ and that accessing
                https://social.briggo.in/ constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                DISCLAIMER FOR CONTENTS OF SITE
              </h2>
              <div className="space-y-4">
                <p className="text-[#919191] leading-relaxed">
                  https://social.briggo.in/ disclaims any responsibility for the
                  accuracy of the content appearing at, linked to on, or
                  mentioned on https://social.briggo.in/. Visitors assume all
                  risk relating to viewing, reading, using, or relying upon this
                  information. Unless you have otherwise formed an express
                  contract to the contrary with us, you have no right to rely on
                  any information contained herein as accurate. We make no such
                  warranty.
                </p>
                <div className="bg-[#F1F1F1] p-4 rounded-xl border border-[#D4D4D4]">
                  <p className="text-[#2B2B2B] font-semibold mb-2">
                    DISCLAIMER FOR HARM CAUSED TO YOUR COMPUTER OR SOFTWARE FROM
                    INTERACTING WITH THIS WEBSITE OR ITS CONTENTS.
                  </p>
                  <p className="text-[#919191] leading-relaxed">
                    VISITOR ASSUMES ALL RISK OF VIRUSES, WORMS, OR OTHER
                    CORRUPTING FACTORS. We assume no responsibility for damage
                    to computers or software of the visitor or any person the
                    visitor subsequently communicates with from corrupting code
                    or data that is inadvertently passed to the visitor's
                    computer. Again, visitor views and interacts with
                    https://social.briggo.in/, or banners or pop-ups or
                    advertising displayed thereon, at his own risk.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                DISCLAIMER FOR HARM CAUSED BY DOWNLOADS
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Visitor downloads information from https://social.briggo.in/ at
                his own risk. Website makes no warranty that downloads are free
                of corrupting computer codes, including, but not limited to,
                viruses and worms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                LIMITATION OF LIABILITY
              </h2>
              <p className="text-[#919191] leading-relaxed">
                By viewing, using, or interacting in any manner with
                https://social.briggo.in/, including banners, advertising, or
                pop-ups, downloads, and as a condition of the website to allow
                his lawful viewing, Visitor forever waives all right to claims
                of damage of any and all description based on any causal factor
                resulting in any possible harm, no matter how heinous or
                extensive, whether physical or emotional, foreseeable or
                unforeseeable, whether personal or commercial in nature. For any
                jurisdictions that may now allow for these exclusions our
                maximum liability will not exceed the amount paid by you, if
                any, for using our website or service. Additionally, you agree
                not to hold us liable for any damages related to issues beyond
                our control, including but not limited to, acts of God, war,
                terrorism, insurrection, riots, criminal activity, natural
                disasters, disruption of communications or infrastructure, labor
                shortages or disruptions (including unlawful strikes), shortages
                of materials, and any other events which are not within our
                control.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                INDEMNIFICATION
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Visitor agrees that in the event he causes damage to us or a
                third party as a result of or relating to the use of
                https://social.briggo.in/, Visitor will indemnify us for, and,
                if applicable, defend us against, any claims for damages.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                SUBMISSIONS
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Visitor agrees as a condition of viewing, that any communication
                between Visitor and Website is deemed a submission. All
                submissions, including portions thereof, graphics contained
                thereon, or any of the content of the submission, shall become
                the exclusive property of the Website and may be used, without
                further permission, for commercial use without additional
                consideration of any kind. Visitor agrees to only communicate
                that information to the Website, which it wishes to forever
                allow the Website to use in any manner as it sees fit.
                "Submissions" is also a provision of the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                NOTICE
              </h2>
              <p className="text-[#919191] leading-relaxed">
                No additional notice of any kind for any reason is required to
                be given to Visitor and Visitor expressly warrants an
                understanding that the right to notice is waived as a condition
                for permission to view or interact with the website.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                DISPUTES
              </h2>
              <p className="text-[#919191] leading-relaxed">
                As part of the consideration that the Website requires for
                viewing, using or interacting with this website, Visitor agrees
                to use binding arbitration for any claim, dispute, or
                controversy ("CLAIM") of any kind (whether in contract, tort or
                otherwise) arising out of or relating to this purchase, this
                product, including solicitation issues, privacy issues, and
                terms of use issues. Arbitration shall be conducted pursuant to
                the rules of the American Arbitration Association which are in
                effect on the date a dispute is submitted to the American
                Arbitration Association. Information about the American
                Arbitration Association, its rules, and its forms are available
                from the American Arbitration Association, 335 Madison Avenue,
                Floor 10, New York, New York, 10017-4605. Hearing will take
                place in the city or county of the owner of
                https://social.briggo.in/. In no case shall the viewer, visitor,
                member, subscriber or customer have the right to go to court or
                have a jury trial. Viewer, visitor, member, subscriber or
                customer will not have the right to engage in pre-trial
                discovery except as provided in the rules; you will not have the
                right to participate as a representative or member of any class
                of claimants pertaining to any claim subject to arbitration; the
                arbitrator's decision will be final and binding with limited
                rights of appeal. The prevailing party shall be reimbursed by
                the other party for any and all costs associated with the
                dispute arbitration, including attorney fees, collection fees,
                investigation fees, travel expenses.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                JURISDICTION AND VENUE
              </h2>
              <p className="text-[#919191] leading-relaxed">
                If any matter concerning this purchase shall be brought before a
                court of law, pre- or post-arbitration, Viewer, visitor, member,
                subscriber or customer agrees to that the sole and proper
                jurisdiction to be the state and city declared in the contact
                information of the web owner unless otherwise here specified. In
                the event that litigation is in a federal court, the proper
                court shall be the closest federal court to the owner of
                https://social.briggo.in/'s address.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                APPLICABLE LAW
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Viewer, visitor, member, subscriber or customer agrees that the
                applicable law to be applied shall, in all cases, be that of the
                state of the owner of https://social.briggo.in/.
              </p>
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

export default TermsPage;
