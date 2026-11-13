import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { Faq, type FaqEntry } from "@/components/marketing/Faq";
import { CONTACT_EMAIL } from "@/lib/site";

const mail = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
    {CONTACT_EMAIL}
  </a>
);

const GROUPS: { title: string; items: FaqEntry[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "Getting the app",
        a: "HOZGO is on the Apple App Store and on Google Play. Search for HOZGO, or use the links on this website. It is free to download, and you can look around before you book anything.",
      },
      {
        q: "Creating an account",
        a: "Open the app and register. You can use an email address and password, Continue with Google, or Continue with Apple. Use whichever you will remember, because that is how you sign back in.",
      },
      {
        q: "Getting a price and making a booking",
        a: "Enter the collection postcode, the delivery postcode, the date and how many horses are travelling. You get a guide price in seconds. If you accept it in the app, your job goes out to HOZGO Approved transporters.",
      },
    ],
  },
  {
    title: "Money",
    items: [
      {
        q: "When your card is charged",
        a: "A hold is placed on your card when you book. That is not a payment and the money stays with you. It is taken on the day of the trip. The transporter is paid after the job is completed.",
      },
      {
        q: "If nobody accepts your job",
        a: (
          <>
            <p>
              If no approved transporter will take the job at the price you were given, they can send you their own offers instead.
              You will see those offers in the app and you can choose one, or choose none.
            </p>
            <p className="mt-3">
              If nobody accepts and you take no offer, the hold on your card is released and nothing is taken. There is nothing to
              refund, because nothing was charged.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Your journey",
    items: [
      {
        q: "Seeing who is coming, and tracking the journey",
        a: "Once a transporter accepts, you can see their profile in the app. Every transporter on HOZGO has passed our document checks before being offered any work. On the day, the app shows live updates through the journey, so you can see where the lorry is without having to telephone and ask.",
      },
      {
        q: "Where your booking documents live",
        a: "The documents and details for a journey are kept with the job in the app. Open it in your jobs list and they are there, before, during and after the trip.",
      },
      {
        q: "Changing or cancelling a booking",
        a: (
          <>
            <p>Do it in the app, or email {mail}, as early as you can.</p>
            <p className="mt-3">
              If no transporter has been allocated yet, the hold on your card is released and nothing is taken. Once one has been
              allocated, they have set aside a lorry for your date, so what happens depends on how close to the
              travel date it is. We will tell you where you stand before anything is taken.
            </p>
          </>
        ),
      },
      {
        q: "Getting in touch about a job in progress",
        a: <>Use the messages tab in the app to speak to the transporter carrying your job. That keeps everything with the booking. If something is going wrong and you need us, email {mail} with the postcodes and the date, and mark it urgent.</>,
      },
    ],
  },
  {
    title: "Your account",
    items: [
      {
        q: "Resetting your password",
        a: "On the sign-in screen, choose the forgotten password option and enter your email address, then follow the link we send you. If you signed up with Continue with Google or Continue with Apple, you have no HOZGO password. Reset it with Google or Apple instead.",
      },
      {
        q: "Deleting your account",
        a: (
          <>
            <p>
              You can ask us to delete your account at any time. Use the{" "}
              <a href="https://hozgo.co.uk/delete-account" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
                delete account page
              </a>{" "}
              in the app, or email {mail} from the address on your account and say you want it deleted.
            </p>
            <p className="mt-3">
              Your profile, your contact details and your sign-in are removed. Messages and job records linked to you are deleted or
              made anonymous. We have to keep records of completed and paid jobs, because payment and tax law requires it, and a
              transporter&rsquo;s approval documents are kept for as long as we need them to show a check was properly made. We will tell
              you what is kept and why. Deletion does not cancel a job already under way.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Help for transporters",
    items: [
      {
        q: "How to apply",
        a: (
          <>
            Download the app, create a transporter profile and upload your documents. You cannot receive jobs until you are
            approved. Prefer us to do the typing? <Link to="/transporters/setup" className="font-medium text-foreground underline underline-offset-4">We will set it up for you</Link>.
          </>
        ),
      },
      {
        q: "The documents we check",
        a: (
          <>
            Nine documents for every transporter, and three more if your vehicle is over 3.5t. See{" "}
            <Link to="/transporters/documents" className="font-medium text-foreground underline underline-offset-4">what we check, and why</Link>.
          </>
        ),
      },
      {
        q: "How approval works",
        a: "Michelle and George check the documents themselves, and we may come back to you with a question. Once approved and online, jobs arrive by notification. You can accept at the price shown, and the first to accept takes the job, or you can send the customer your own offer if you cannot do it for that price. A contract is signed in the app on every job.",
      },
      {
        q: "Keeping your approval",
        a: "If a policy, a licence or an authorisation lapses or changes, tell us straight away and stop accepting work until it is back in place. We may ask for updated documents at any time. An expired document takes you offline until it is replaced.",
      },
      {
        q: "Getting paid",
        a: "You are paid after the job is completed. Payments run through Stripe. HOZGO's service fee is taken out of the job price, so the figure you see on a job is your figure, with nothing to invoice us for afterwards.",
      },
    ],
  },
  {
    title: "Something wrong",
    items: [
      {
        q: "Reporting a problem with a transporter or a customer",
        a: <>Email {mail} with the postcodes, the date and what happened. Tell us even if it has been sorted out between you, because it affects whether somebody stays on HOZGO. If a horse or a person is at risk, contact the emergency services first, then tell us.</>,
      },
      {
        q: "Reporting a bug",
        a: <>Email {mail} with what you were doing, what you expected and what happened instead. Tell us whether you are on iPhone or Android, and send a screenshot if you can. We built this from inside the industry, and we would rather hear it than not.</>,
      },
    ],
  },
];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export default function Support() {
  return (
    <>
      <PageMeta
        title="App support | HOZGO"
        description="Help with the HOZGO app: accounts, bookings, card holds, offers, deleting your account and help for transporters."
      />
      <PageHero
        eyebrow="SUPPORT"
        title="HOZGO app support"
        intro={<>Last updated 19 September 2026.</>}
      />
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl">
          <Group title="How to get help">
            <div className="space-y-3 text-muted-foreground">
              <p>
                Email {mail}. Tell us your name, the email address on your account and, if it is about a job, the collection and
                delivery postcodes and the travel date. That gets you a useful answer the first time.
              </p>
              <p>
                HOZGO is run by two working horse transporters. Michelle and George still drive, so a reply may not be instant, but
                every email is read and answered.
              </p>
            </div>
          </Group>
          {GROUPS.map((g) => (
            <Group key={g.title} title={g.title}>
              <Faq items={g.items} />
            </Group>
          ))}
        </div>
      </Container>
    </>
  );
}
