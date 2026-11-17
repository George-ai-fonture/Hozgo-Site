// Labels follow the app's driverDocuments.ts. Keep in step with it.
export interface DocumentInfo {
  label: string;
  plain: string;
  what: string;
  good: string;
  watch?: string;
}

export const ALWAYS_DOCUMENTS: DocumentInfo[] = [
  {
    label: "Driver Licence",
    plain: "Your driver licence",
    what: "Your UK driving licence, covering the vehicle you drive.",
    good: "Front and back, sharp, with every number readable.",
    watch: "The name must match the person driving for the business.",
  },
  {
    label: "Vehicle Registration",
    plain: "The vehicle registration",
    what: "The registration document for the lorry you transport horses in.",
    good: "Every page that shows the registration number and the keeper.",
    watch: "The registration must match the lorry in your photos.",
  },
  {
    label: "Lorry Insurance",
    plain: "Lorry insurance",
    what: "The motor insurance policy for your lorry.",
    good: "The full policy schedule, with the insurer, dates and cover shown.",
    watch: "It must cover carrying horses in transit, on a hire and reward basis.",
  },
  {
    label: "Public Liability",
    plain: "Public liability insurance",
    what: "Cover for injury or damage to other people or their property caused by your business.",
    good: "The current schedule or certificate, with the insurer, dates and level of cover.",
    watch: "It must be in date and in the business name.",
  },
  {
    label: "Care, Custody & Control (CCC)",
    plain: "Care, custody and control (CCC) insurance",
    what: "Cover for horses while they are in your care, on the lorry or being loaded.",
    good: "The current schedule or certificate, all pages, with the cover clearly stated.",
    watch: "It must name your business and be in date.",
  },
  {
    label: "Transporter Authorisation (APHA)",
    plain: "APHA transporter authorisation",
    what: "Your authorisation from the Animal and Plant Health Agency to transport animals.",
    good: "The full authorisation, all pages, showing the authorisation type and your business name.",
    watch: "Type 1 covers journeys up to 8 hours. Type 2 covers journeys over 8 hours. Upload the type you hold.",
  },
  {
    label: "Certificate of Competence",
    plain: "Certificate of competence",
    what: "Proof that you have been assessed as competent to transport horses.",
    good: "The certificate in full, with your name and the issue details readable.",
    watch: "The name must match the person driving.",
  },
  {
    label: "Lorry Photo – External",
    plain: "A photo of the outside of your lorry",
    what: "A clear photo of the outside of the lorry you will use for HOZGO jobs.",
    good: "The whole lorry in daylight, with the registration plate readable.",
    watch: "This one is a photo, not a PDF.",
  },
  {
    label: "Lorry Photo – Internal",
    plain: "A photo of the inside of your lorry",
    what: "A clear photo of the horse area inside the lorry.",
    good: "The partitions, ramp and flooring, in good light.",
    watch: "This one is a photo, not a PDF.",
  },
];

export const HEAVY_DOCUMENTS: DocumentInfo[] = [
  {
    label: "O Licence",
    plain: "Operator (O) Licence",
    what: "The operator licence for vehicles over 3.5t.",
    good: "The full licence, all pages, in the name of the business.",
  },
  {
    label: "Transport Manager Details",
    plain: "Transport manager details",
    what: "Who your transport manager is, as held for your operator licence.",
    good: "A clear document or screenshot showing the manager's name and details.",
  },
  {
    label: "Driver CPC Qualification Card",
    plain: "Driver CPC card",
    what: "Your Driver CPC card, for driving a vehicle over 3.5t.",
    good: "Front and back, sharp, with the dates readable.",
    watch: "It must be in date.",
  },
];

export const GO_ONLINE_CHECKS = [
  "A valid UK phone number",
  "An experience summary",
  "Your base location",
  "Signed transporter terms",
  "Stripe Connect set up, so you can be paid",
];
