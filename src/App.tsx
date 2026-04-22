import { useEffect } from "react";
import PdfViewer from "./components/pdfViewer";

export default function App() {
  useEffect(() => {
    let NutrientViewer;
    (async () => {
      // Lazy load the SDK module early
      NutrientViewer = await import("@nutrient-sdk/viewer");

      // Then preload the WebAssembly worker in the background
      NutrientViewer.preloadWorker({
        baseUrl: `${window.location.protocol}//${window.location.host}/${
          import.meta.env.PUBLIC_URL ?? ""
        }`,
      });
    })();
  }, []);
  return <PdfViewer />;
}
