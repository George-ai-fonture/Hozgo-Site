import { PageMeta } from "@/components/layout/PageMeta";
import { LegalDocument } from "@/components/marketing/Legal";
import { termsBlocks } from "@/components/marketing/legalContent";

export default function Terms() {
  return (
    <>
      <PageMeta title="Terms and conditions | HOZGO" description="The terms and conditions that govern use of the HOZGO app, website and related services." />
      <LegalDocument
        eyebrow="LEGAL"
        title="HOZGO Terms and Conditions"
        effective="14 August 2026"
        updated="14 August 2026"
        privacyHref="https://hozgo.co.uk/privacy-policy"
        note={
          <>
            Transporters also agree to the{" "}
            <a href="https://hozgo.co.uk/transporter-terms" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
              transporter terms
            </a>{" "}
            they sign in the app. The privacy policy shown in the app is at{" "}
            <a href="https://hozgo.co.uk/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
              hozgo.co.uk/privacy-policy
            </a>
            .
          </>
        }
        blocks={termsBlocks}
      />
    </>
  );
}
