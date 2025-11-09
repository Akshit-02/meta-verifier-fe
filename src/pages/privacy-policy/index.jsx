import { useState, useEffect } from "react";

const PrivacyPolicyPage = () => {
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
              🔒 Your Privacy Matters
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
              Privacy Policy
            </h1>
          </div>

          <div className="space-y-8">
            <p className="text-[#919191] leading-relaxed">
              Welcome to https://basic.devspunch.net/ (the Site). We understand
              that privacy online is important to users of our Site, especially
              when conducting business. This statement governs our privacy
              policies with respect to those users of the Site (Visitors) who
              visit without transacting business and Visitors who register to
              transact business on the Site and make use of the various services
              offered by This APP (collectively, Services) (Authorized
              Customers).
            </p>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                Personally Identifiable Information
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Refers to any information that identifies or can be used to
                identify, contact, or locate the person to whom such information
                pertains, including, but not limited to, name, address, phone
                number, fax number, email address, financial profiles, social
                security number, and credit card information. Personally
                Identifiable Information does not include information that is
                collected anonymously (that is, without identification of the
                individual user) or demographic information not connected to an
                identified individual.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                What Personally Identifiable Information is collected?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                We may collect basic user profile information from all of our
                Visitors. We collect the following additional information from
                our Authorized Customers: the names, addresses, phone numbers
                and email addresses of Authorized Customers, the nature and size
                of the business, and the nature and size of the advertising
                inventory that the Authorized Customer intends to purchase or
                sell.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                What organizations are collecting the information?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                In addition to our direct collection of information, our third
                party service vendors (such as credit card companies,
                clearinghouses and banks) who may provide such services as
                credit, insurance, and escrow services may collect this
                information from our Visitors and Authorized Customers. We do
                not control how these third parties use such information, but we
                do ask them to disclose how they use personal information
                provided to them from Visitors and Authorized Customers. Some of
                these third parties may be intermediaries that act solely as
                links in the distribution chain, and do not store, retain, or
                use the information given to them.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                How does the Site use Personally Identifiable Information?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                We use Personally Identifiable Information to customize the
                Site, to make appropriate service offerings, and to fulfill
                buying and selling requests on the Site. We may email Visitors
                and Authorized Customers about research or purchase and selling
                opportunities on the Site or information related to the subject
                matter of the Site. We may also use Personally Identifiable
                Information to contact Visitors and Authorized Customers in
                response to specific inquiries, or to provide requested
                information.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                With whom may the information be shared?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Personally Identifiable Information about Authorized Customers
                may be shared with other Authorized Customers who wish to
                evaluate potential transactions with other Authorized Customers.
                We may share aggregated information about our Visitors,
                including the demographics of our Visitors and Authorized
                Customers, with our affiliated agencies and third party vendors.
                We also offer the opportunity to 'opt out' of receiving
                information or being contacted by us or by any agency acting on
                our behalf.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                How is Personally Identifiable Information stored?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Personally Identifiable Information collected by This APP is
                securely stored and is not accessible to third parties or
                employees of This APP except for use as indicated above.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                What choices are available to Visitors regarding collection, use
                and distribution of the information?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Visitors and Authorized Customers may opt out of receiving
                unsolicited information from or being contacted by us and/or our
                vendors and affiliated agencies by responding to emails as
                instructed, or by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                Are Cookies Used on the Site?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Cookies are used for a variety of reasons. We use Cookies to
                obtain information about the preferences of our Visitors and the
                services they select. We also use Cookies for security purposes
                to protect our Authorized Customers. For example, if an
                Authorized Customer is logged on and the site is unused, system
                may automatically log the Authorized Customer off.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                How does This APP use login information?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                This APP uses login information, including, but not limited to,
                IP addresses, ISPs, and browser types, to analyze trends,
                administer the Site, track a user's movement and use, and gather
                broad demographic information.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                What partners or service providers have access to Personally
                Identifiable Information?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                This APP has entered into and will continue to enter into
                partnerships and other affiliations with a number of vendors.
                Such vendors may have access to certain Personally Identifiable
                Information on a need to know basis for evaluating Authorized
                Customers for service eligibility. Our privacy policy does not
                cover their collection or use of this information. Disclosure of
                Personally Identifiable Information to comply with law. We will
                disclose Personally Identifiable Information in order to comply
                with a court order or subpoena or a request from a law
                enforcement agency to release information. We will also disclose
                Personally Identifiable Information when reasonably necessary to
                protect the safety of our Visitors and Authorized Customers.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                How does the Site keep Personally Identifiable Information
                secure?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                All of our employees are familiar with our security policy and
                practices. The Personally Identifiable Information of our
                Visitors and Authorized Customers is only accessible to a
                limited number of qualified employees who are given a password
                in order to gain access to the information. We audit our
                security systems and processes on a regular basis. Sensitive
                information, such as credit card numbers or social security
                numbers, is protected by encryption protocols, in place to
                protect information sent over the Internet. While we take
                commercially reasonable measures to maintain a secure site,
                electronic communications and databases are subject to errors,
                tampering and break-ins, and we cannot guarantee or warrant that
                such events will not take place and we will not be liable to
                Visitors or Authorized Customers for any such occurrences.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                How can Visitors correct any inaccuracies in Personally
                Identifiable Information?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                Visitors and Authorized Customers may contact us to update
                Personally Identifiable Information about them or to correct any
                inaccuracies by emailing us at info@simber.com
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                Can a Visitor delete or deactivate Personally Identifiable
                Information collected by the Site?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                We provide Visitors and Authorized Customers with a mechanism to
                delete/deactivate Personally Identifiable Information from the
                Site's database by contacting us. However, because of backups
                and records of deletions, it may be impossible to delete a
                Visitor's entry without retaining some residual information. An
                individual who requests to have Personally Identifiable
                Information deactivated will have this information functionally
                deleted, and we will not sell, transfer, or use Personally
                Identifiable Information relating to that individual in any way
                moving forward.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                What happens if the Privacy Policy Changes?
              </h2>
              <p className="text-[#919191] leading-relaxed">
                We will let our Visitors and Authorized Customers know about
                changes to our privacy policy by posting such changes on the
                Site. However, if we are changing our privacy policy in a manner
                that might cause disclosure of Personally Identifiable
                Information that a Visitor or Authorized Customer has previously
                requested not be disclosed, we will contact such Visitor or
                Authorized Customer to allow such Visitor or Authorized Customer
                to prevent such disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4 pb-2 border-b-2 border-[#D4D4D4]">
                Links
              </h2>
              <p className="text-[#919191] leading-relaxed">
                https://basic.devspunch.net/ contains links to other web sites.
                Please note that when you click on one of these links, you are
                moving to another web site. We encourage you to read the privacy
                statements of these linked sites as their privacy policies may
                differ from ours.
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

export default PrivacyPolicyPage;
