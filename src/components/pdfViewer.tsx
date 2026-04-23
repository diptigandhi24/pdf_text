import { useEffect, useRef } from "react";
import {
  createNoteAnnotationFromBckend,
  createHightlightAnnotationFromBckend,
} from "../utility";
import LoginModal from "./loginModal";
import { useAuth } from "../hooks/useAuth";
import NutrientViewer from "@nutrient-sdk/viewer";

export default function PdfViewer() {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const isLoadingFromBackend = useRef(false);

  const { user, loading, loginWithGoogle } = useAuth(); // ← add loading

  useEffect(() => {
    const container = containerRef.current;

    if (!user || !container) return;

    if (user) {
      (async () => {
        if (container) {
          NutrientViewer.unload(container);
        }
        await NutrientViewer.load({
          // Container where NutrientViewer should be mounted.
          container,
          // The document to open.
          document: "SGNP.pdf",
          // Use the public directory URL as a base URL. NutrientViewer will download its library assets from here.
          baseUrl: `${window.location.protocol}//${window.location.host}/${
            import.meta.env.PUBLIC_URL ?? ""
          }`,
          initialViewState: new NutrientViewer.ViewState({
            sidebarMode: NutrientViewer.SidebarMode.ANNOTATIONS,
            sidebarOptions: {
              [NutrientViewer.SidebarMode.ANNOTATIONS]: {
                includeContent: [
                  ...NutrientViewer.defaultAnnotationsSidebarContent,
                  NutrientViewer.Comment,
                ],
              },
            },
          }),
        }).then(async (instance) => {
          instance !== null ? (instanceRef.current = instance) : null;

          let annotationList;

          try {
            let annotationJson = await fetch(
              "/.netlify/functions/getAnnotation",
            );
            annotationList = await annotationJson.json();
            console.log("Annotation List", annotationList);
          } catch (error) {
            console.log("getAnnotation List error", error);
          }

          // Listen for new annotations
          instance.addEventListener("annotations.create", (annotation) => {
            if (isLoadingFromBackend.current) return;

            annotation.forEach((annotation) => {
              if (
                annotation instanceof
                NutrientViewer.Annotations.HighlightAnnotation
              ) {
                console.log("Highlight annotation", annotation.toJS());
              } else if (
                annotation instanceof NutrientViewer.Annotations.NoteAnnotation
              ) {
                console.log("Note annotation", annotation);
              } else if (
                annotation instanceof NutrientViewer.Annotations.TextAnnotation
              ) {
                console.log("Text annotation", annotation);
              } else if (
                annotation instanceof NutrientViewer.Annotations.InkAnnotation
              ) {
                console.log("Ink annotation", annotation);
              } else if (
                annotation instanceof
                NutrientViewer.Annotations.MarkupAnnotation
              ) {
                console.log("Other markup annotation", annotation);
              }
            });
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

          instance.addEventListener(
            "annotations.delete",
            (deletedAnnotations) => {
              console.log(deletedAnnotations.toJS()); // Array of deleted annotation objects
            },
          );
          // createHightlightAnnotationFromBckend(instance, isLoadingFromBackend);
          createNoteAnnotationFromBckend(
            annotationList,
            instance,
            isLoadingFromBackend,
          );
          instance.setAnnotationCreatorName(user?.user_metadata.full_name);
        });
      })();

      return () => {
        if (NutrientViewer && container) {
          NutrientViewer.unload(container);
        }
      };
    }
  }, []);

  // ✅ Correct order
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginModal loginWithGoogle={loginWithGoogle} />;
  }

  return (
    <div>
      <div ref={containerRef} style={{ height: "100vh" }} />
    </div>
  );
}
