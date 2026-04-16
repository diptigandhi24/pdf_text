import { useEffect, useRef } from "react";
import { createNoteAnnotationFromBckend } from "./utility";
export default function App() {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const isLoadingFromBackend = useRef(false);
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
      }).then(async (instance) => {
        instanceRef.current = instance;
        let annotationList;
        try {
          let annotationJson = await fetch(
            "http://localhost:8888/.netlify/functions/getAnnotation",
          );
          annotationList = await annotationJson.json();
          console.log("Annotation List", annotationList);
        } catch (error) {
          console.log("getAnnotation List error", error);
        }

        // Listen for new annotations
        instance.addEventListener("annotations.create", (annotation) => {
          if (isLoadingFromBackend.current) return;
          console.log("Created:", annotation.toJS(), isLoadingFromBackend);
        });

        instance.addEventListener("annotations.update", (annotation) => {
          if (isLoadingFromBackend.current) return;
          console.log("Updated:", annotation.toJS()[0]);
          try {
            fetch("/.netlify/functions/addAnotationToDB", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(annotation.toJS()[0]),
            }).then((res) => {
              console.log("Response from server to add Annotation", res);
            });
          } catch (error) {
            console.log("Error while adding Anotation to DB", error);
          }
        });

        createNoteAnnotationFromBckend(
          annotationList,
          instance,
          isLoadingFromBackend,
        );
      });
    })();

    return () => NutrientViewer?.unload(container);
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
