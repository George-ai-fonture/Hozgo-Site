import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Home from "@/pages/Home";
import Quote from "@/pages/Quote";
import QuoteSent from "@/pages/QuoteSent";
import HowItWorks from "@/pages/HowItWorks";
import Transporters from "@/pages/Transporters";
import TransporterDocuments from "@/pages/TransporterDocuments";
import TransporterSetup from "@/pages/TransporterSetup";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Support from "@/pages/Support";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/quote/sent" element={<QuoteSent />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/transporters" element={<Transporters />} />
          <Route path="/transporters/documents" element={<TransporterDocuments />} />
          <Route path="/transporters/setup" element={<TransporterSetup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
