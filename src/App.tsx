import { useEffect, useRef } from "react";

export default function App() {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let NutrientViewer;

    (async () => {
      NutrientViewer = await import("@nutrient-sdk/viewer");

      NutrientViewer.unload(container); // Ensure that there's only one NutrientViewer instance.

      await NutrientViewer.load({
        // Container where NutrientViewer should be mounted.
        container,
        // The document to open.
        document: "SGNP.pdf",
        // Use the public directory URL as a base URL. NutrientViewer will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${
          import.meta.env.PUBLIC_URL ?? ""
        }`,
      }).then((instance) => {
        instanceRef.current = instance;
        // Listen for new annotations
        instance.addEventListener("annotations.create", (annotations) => {
          annotations.forEach((ann) => {
            console.log("Created:", ann.type, ann.toJS());
          });
        });

        instance.addEventListener("annotations.update", (annotations) => {
          annotations.forEach((ann) => {
            console.log("Updated:", ann.type, ann.toJS());
          });
        });
      });
    })();

    return () => NutrientViewer?.unload(container);
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
