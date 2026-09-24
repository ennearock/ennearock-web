import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Ennearock collects, uses, and protects personal information.",
};

const sections = [
  ["information", "Information we collect"],
  ["use", "How we use information"],
  ["legal-bases", "Legal bases"],
  ["sharing", "Sharing and processors"],
  ["retention", "Retention and security"],
  ["rights", "Your rights"],
  ["contact", "Contact"],
] as const;

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden bg-[#131418] py-20 text-white sm:py-28">
          <Container>
            <div className="relative max-w-4xl">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#e2e5eb]/10 blur-[90px]" />
              <p className="relative flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e2e5eb]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e2e5eb]" /> Legal
              </p>
              <h1 className="relative mt-7 text-[52px] font-medium leading-[0.95] tracking-[-0.07em] sm:text-[74px]">
                Privacy, in plain language.
              </h1>
              <p className="relative mt-7 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                This policy explains what information Ennearock may collect when you use our website, contact the studio, purchase a template, or use a workspace.
              </p>
              <p className="relative mt-8 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">
                Last updated · 30 August 2026
              </p>
            </div>
          </Container>
        </section>

        <section className="bg-[#ffffff] py-16 sm:py-24">
          <Container>
            <div className="mb-14 rounded-[18px] border border-[#c9ced7] bg-[#f5f6f8] p-5 sm:flex sm:items-start sm:gap-4">
              <span className="mb-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e2e5eb] text-sm font-bold text-[#131418] sm:mb-0">!</span>
              <div>
                <p className="text-sm font-semibold text-[#292c33]">Production review required</p>
                <p className="mt-1.5 max-w-4xl text-xs leading-6 text-[#50555f]">
                  This is starter copy for this website template, not legal advice. The deployment owner must review, replace, and approve it for their actual business, data practices, vendors, and jurisdictions before production.
                </p>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,720px)] lg:gap-20">
              <aside className="h-fit lg:sticky lg:top-28">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-[#898f9b]">On this page</p>
                <nav className="mt-5 flex flex-col border-l border-[#d7dae0]" aria-label="Privacy policy sections">
                  {sections.map(([id, label]) => (
                    <a key={id} href={"#" + id} className="border-l border-transparent px-4 py-2 text-[11px] text-[#747985] transition hover:border-[#131418] hover:text-[#131418]">
                      {label}
                    </a>
                  ))}
                </nav>
              </aside>

              <article className="space-y-12 text-[13px] leading-7 text-[#626670]">
                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">Who is responsible</h2>
                  <p className="mt-4">
                    Ennearock is the controller of personal information described in this policy unless a project agreement states otherwise. When we process data inside a client workspace solely on that client&apos;s instructions, the client may be the controller and Ennearock may act as its processor.
                  </p>
                </section>

                <section id="information" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">Information we collect</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[#898f9b]">
                    <li><strong className="font-semibold text-[#292c33]">Account and transaction details:</strong> name, work email, organization, billing address, plan, purchase, and invoice information. Payment card details should be handled by the payment provider rather than stored by Ennearock.</li>
                    <li><strong className="font-semibold text-[#292c33]">Project and communication data:</strong> messages, briefs, uploaded files, feedback, and support requests you choose to provide.</li>
                    <li><strong className="font-semibold text-[#292c33]">Technical data:</strong> IP address, device and browser details, approximate location, referral page, cookie identifiers, and product usage events.</li>
                  </ul>
                </section>

                <section id="use" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">How we use information</h2>
                  <p className="mt-4">We may use information to provide and secure the service, manage accounts and purchases, deliver projects, respond to enquiries, prevent abuse, understand product performance, meet legal obligations, and—where permitted—send relevant product or studio updates.</p>
                  <p className="mt-3">We do not sell personal information. We do not use private project materials to train public artificial-intelligence models unless the relevant customer has expressly agreed.</p>
                </section>

                <section id="legal-bases" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">Legal bases</h2>
                  <p className="mt-4">Where the GDPR or similar law applies, processing may rely on performance of a contract, legitimate interests such as operating and securing the service, consent for optional communications or cookies, and compliance with legal obligations. You may withdraw consent at any time without affecting earlier processing.</p>
                </section>

                <section id="sharing" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">Sharing and processors</h2>
                  <p className="mt-4">Information may be shared with vetted providers that support hosting, authentication, analytics, email delivery, payments, customer support, and professional advice. They may process information only for the agreed service and subject to appropriate safeguards. Information may also be disclosed when required by law, to protect rights and safety, or as part of a properly managed business transaction.</p>
                  <p className="mt-3">If information is transferred internationally, the deployment owner should document and use an applicable transfer mechanism, such as adequacy decisions or standard contractual clauses.</p>
                </section>

                <section id="retention" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">Retention and security</h2>
                  <p className="mt-4">Information is retained only as long as reasonably needed for the purposes above, contractual commitments, dispute resolution, and tax or other legal requirements. Account data should be deleted or anonymized after the applicable retention period.</p>
                  <p className="mt-3">We use reasonable organizational and technical safeguards, but no online service can promise absolute security. Please use a strong, unique password and notify us promptly if you suspect unauthorized access.</p>
                </section>

                <section id="rights" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">Your rights</h2>
                  <p className="mt-4">Depending on your location, you may have rights to access, correct, delete, restrict, or port your information; object to certain processing; withdraw consent; and complain to a supervisory authority. We may need to verify your identity before fulfilling a request.</p>
                  <p className="mt-3">This service is intended for business users and is not directed to children under 16. If you believe a child has provided personal information, contact us so it can be addressed.</p>
                </section>

                <section id="contact" className="scroll-mt-28 border-t border-[#d7dae0] pt-10">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#131418]">Questions or requests</h2>
                  <p className="mt-4">Contact the privacy owner at <a className="font-semibold text-[#3c4049] underline decoration-[#a1a7b2] underline-offset-4" href="mailto:hello@ennearock.com">hello@ennearock.com</a>. Include “Privacy request” in the subject line. The final deployed policy should also identify the legal entity, postal address, and relevant supervisory authority.</p>
                </section>
              </article>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
