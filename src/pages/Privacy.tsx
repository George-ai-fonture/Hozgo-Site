import { PageMeta } from "@/components/layout/PageMeta";
import { LegalDocument } from "@/components/marketing/Legal";
import { privacyBlocks } from "@/components/marketing/legalContent";

export default function Privacy() {
  return (
    <>
      <PageMeta title="Privacy policy | HOZGO" description="How HOZGO collects, uses and protects personal information, and the rights you have under UK data protection law." />
      <LegalDocument
        eyebrow="LEGAL"
        title="HOZGO Privacy Policy"
        effective="14 August 2026"
        updated="14 August 2026"
        note={
          <>
            The privacy policy shown in the app is at{" "}
            <a href="https://hozgo.co.uk/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
              hozgo.co.uk/privacy-policy
            </a>
            . Transporters also sign the{" "}
            <a href="https://hozgo.co.uk/transporter-terms" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
              transporter terms
            </a>{" "}
            in the app.
          </>
        }
        blocks={privacyBlocks}
      />
    </>
  );
}
