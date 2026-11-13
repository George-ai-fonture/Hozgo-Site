import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";

export default function Contact() {
  return (
    <>
      <PageMeta title="Contact" description="Get in touch with the HOZGO team." />
      <Container className="py-16 sm:py-24">
        <h1 className="text-4xl">Contact</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Placeholder for the Contact page. Content to follow.</p>
      </Container>
    </>
  );
}
