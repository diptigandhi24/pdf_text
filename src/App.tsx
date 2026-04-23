import PdfViewer from "./components/pdfViewer";

// export default function App() {
//   // useEffect(() => {
//   //   let NutrientViewer;
//   //   console.log("nutrient viewer Before");
//   //   (async () => {
//   //     // Lazy load the SDK module early
//   //     NutrientViewer = await import("@nutrient-sdk/viewer");

//   //     // Then preload the WebAssembly worker in the background
//   //     NutrientViewer.preloadWorker({
//   //       baseUrl: `${window.location.protocol}//${window.location.host}/${
//   //         import.meta.env.PUBLIC_URL ?? ""
//   //       }`,
//   //     });
//   //   })();
//   //   console.log("nutrient viewer After");
//   // }, []);
//   return <PdfViewer />;
// }

// ParentComponent.jsx
import { useEffect, useRef, useState } from "react";
import NutrientViewer from "@nutrient-sdk/viewer";

const BASE_URL = `${window.location.protocol}//${window.location.host}/${
  import.meta.env.PUBLIC_URL ?? ""
}`;
const PDF_URL = "SGNP.pdf";

export default function ParentComponent() {
  const [pdfBuffer, setPdfBuffer] = useState(null);
  const [error, setError] = useState(null);

  // Guard against double-invocation in React StrictMode
  const hasStartedRef = useRef(false);

  useEffect(() => {
    console.log("inside App useEffect", hasStartedRef.current);
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let cancelled = false;

    // Kick off both in parallel — neither blocks the other
    const workerPromise = NutrientViewer.preloadWorker({
      baseUrl: BASE_URL,
      document: "SGNP.pdf",
      container: "",
    }).catch((err) => {
      // Non-fatal: load() will fall back to initializing on its own
      console.warn("[Nutrient] preloadWorker failed:", err);
    });

    const pdfPromise = fetch(PDF_URL, { credentials: "include" }).then(
      (res) => {
        if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
        return res.arrayBuffer();
      },
    );

    Promise.all([workerPromise, pdfPromise])
      .then(([, buffer]) => {
        if (!cancelled) setPdfBuffer(buffer);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // if (error) {
  //   return (
  //     <div role="alert" style={{ padding: 24 }}>
  //       Couldn't load the document: {error.message}
  //     </div>
  //   );
  // }

  // if (!pdfBuffer) {
  //   return <div style={{ padding: 24 }}>Preparing your document…</div>;
  // }

  return <PdfViewer documentBuffer={pdfBuffer} baseUrl={BASE_URL} />;
}
