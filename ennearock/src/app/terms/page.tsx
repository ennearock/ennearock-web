import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Terms",
  description: "Starter terms governing Ennearock services, templates, and workspaces.",
};

const sections = [
  ["services", "Services and accounts"],
  ["projects", "Client projects"],
  ["templates", "Template licenses"],
  ["fees", "Fees and renewals"],
  ["use", "Acceptable use"],
  ["warranties", "Warranties and liability"],
  ["termination", "Termination"],
  ["contact", "Contact"],
] as const;

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden bg-[#11140f] py-20 text-white sm:py-28">
          <Container>
            <div className="relative max-w-4xl">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#7568f8]/15 blur-[90px]" />
              <p className="relative flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c8f36a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8f36a]" /> Legal
              </p>
              <h1 className="relative mt-7 text-[52px] font-medium leading-[0.95] tracking-[-0.07em] sm:text-[74px]">
                Clear terms for good work.
              </h1>
              <p className="relative mt-7 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                These starter terms cover use of the Ennearock website, studio services, digital templates, and customer workspaces.
              </p>
              <p className="relative mt-8 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">
                Last updated · 30 August 2026
              </p>
            </div>
          </Container>
        </section>

        <section className="bg-[#fffefa] py-16 sm:py-24">
          <Container>
            <div className="mb-14 rounded-[18px] border border-[#b8d779] bg-[#eff8dc] p-5 sm:flex sm:items-start sm:gap-4">
              <span className="mb-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c8f36a] text-sm font-bold text-[#11140f] sm:mb-0">!</span>
              <div>
                <p className="text-sm font-semibold text-[#29331f]">Production review required</p>
                <p className="mt-1.5 max-w-4xl text-xs leading-6 text-[#536245]">
                  These terms are starter copy for this website template, not legal advice. The deployment owner must review, replace, and approve them for the actual legal entity, offer, pricing, licenses, and jurisdictions before production.
                </p>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,720px)] lg:gap-20">
              <aside className="h-fit lg:sticky lg:top-28">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-[#858980]">On this page</p>
                <nav className="mt-5 flex flex-col border-l border-[#d4d0c5]" aria-label="Terms sections">
                  {sections.map(([id, label]) => (
                    <a key={id} href={"#" + id} className="border-l border-transparent px-4 py-2 text-[11px] text-[#6d7168] transition hover:border-[#11140f] hover:text-[#11140f]">
                      {label}
                    </a>
                  ))}
                </nav>
              </aside>

              <article className="space-y-12 text-[13px] leading-7 text-[#5f635b]">
                <section>
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Agreement</h2>
                  <p className="mt-4">By accessing the website, creating an account, purchasing a template, or accepting a project proposal, you agree to these terms and any order form, statement of work, or license presented at purchase. If you act for an organization, you confirm that you can bind it. If you do not agree, do not use the service.</p>
                </section>

                <section id="services" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Services and accounts</h2>
                  <p className="mt-4">Ennearock may provide strategy, design, development, templates, hosting-related support, and workspace software. Exact deliverables, timing, assumptions, and acceptance criteria for custom work should be set out in a signed proposal or statement of work.</p>
                  <p className="mt-3">You must provide accurate account information, keep credentials secure, and promptly report suspected misuse. You are responsible for activity under your account and for ensuring invited users follow these terms.</p>
                </section>

                <section id="projects" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Client projects and ownership</h2>
                  <p className="mt-4">You retain ownership of materials you supply and grant Ennearock the limited rights needed to perform the work. You confirm that those materials can lawfully be used.</p>
                  <p className="mt-3">Ownership and license terms for custom deliverables should be defined in the applicable project agreement. Unless that agreement says otherwise, transfer of final deliverables is conditional on full payment; Ennearock retains ownership of pre-existing tools, reusable methods, libraries, and general know-how. Third-party materials remain subject to their own licenses.</p>
                  <p className="mt-3">Ennearock may display non-confidential completed work in its portfolio unless the project agreement or a written confidentiality commitment says otherwise.</p>
                </section>

                <section id="templates" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Template licenses</h2>
                  <p className="mt-4">A template purchase grants a limited, non-exclusive, non-transferable license for the number of end projects or workspaces stated at checkout. You may customize the template for that licensed use, but may not resell, redistribute, sublicense, publish it as a competing template, or make source files available to others except collaborators working on the licensed project.</p>
                  <p className="mt-3">Brand names, demo copy, photography, fonts, and third-party assets shown in previews may be illustrative and may require replacement or separate licensing. The final store license must state the exact permitted uses, seat limits, support window, and refund terms.</p>
                </section>

                <section id="fees" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Fees, taxes, and renewals</h2>
                  <p className="mt-4">Prices and payment schedules are shown at checkout or in the applicable proposal. Fees exclude taxes unless stated otherwise. Subscription plans renew automatically for the selected period until cancelled before renewal. Changes take effect at the next billing cycle unless otherwise disclosed.</p>
                  <p className="mt-3">Late project payments may pause work and adjust delivery dates. Except where law requires otherwise or a specific refund policy applies, digital downloads and completed service fees are non-refundable.</p>
                </section>

                <section id="use" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Acceptable use</h2>
                  <p className="mt-4">You may not use the service to break the law, infringe rights, distribute malware, send abusive or deceptive content, bypass security or usage limits, scrape or overload systems, reverse engineer protected portions of the service, or interfere with other users. We may investigate suspected misuse and restrict access where reasonably necessary to protect the service or others.</p>
                </section>

                <section id="warranties" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Warranties and liability</h2>
                  <p className="mt-4">Services are provided with reasonable care and skill. Except for express commitments in a project agreement and rights that cannot legally be excluded, the website, workspace, and templates are provided “as is” and “as available.” We do not promise uninterrupted operation, a particular commercial result, or compatibility with every future third-party change.</p>
                  <p className="mt-3">To the extent permitted by law, neither party is liable for indirect or consequential loss. Ennearock&apos;s aggregate liability should be limited in the final terms to an appropriate amount tied to fees paid for the affected service. Nothing excludes liability that cannot lawfully be limited, including fraud or liability for death or personal injury caused by negligence.</p>
                </section>

                <section id="termination" className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Suspension, termination, and changes</h2>
                  <p className="mt-4">You may stop using the service or cancel a subscription through the account controls, subject to existing payment commitments. We may suspend or terminate access for material breach, non-payment, security risk, or unlawful use, normally after reasonable notice where practical. Provisions intended to survive—including payment, ownership, confidentiality, and liability terms—remain effective.</p>
                  <p className="mt-3">We may update these terms to reflect service, legal, or operational changes. Material changes should be communicated before they take effect. Continued use after the effective date constitutes acceptance where permitted by law.</p>
                  <p className="mt-3">The final deployment should specify governing law, dispute venue, legal entity details, and any mandatory consumer cancellation rights. For an Ennearock entity established in France, French law and courts in Paris may be appropriate, subject to mandatory local protections.</p>
                </section>

                <section id="contact" className="scroll-mt-28 border-t border-[#d9d5ca] pt-10">
                  <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#11140f]">Questions</h2>
                  <p className="mt-4">Questions about these terms can be sent to <a className="font-semibold text-[#344c27] underline decoration-[#91ad58] underline-offset-4" href="mailto:hello@ennearock.com">hello@ennearock.com</a>. The final version should also provide the contracting entity&apos;s registered name, address, registration number, and VAT number where applicable.</p>
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
