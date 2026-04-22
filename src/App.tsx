import { useEffect, useRef, useState } from "react";
import {
  createNoteAnnotationFromBckend,
  createHightlightAnnotationFromBckend,
} from "./utility";
import { getCurrentUser } from "./lib/auth";
import AddUser from "./adduser";
import Cookies from "js-cookie";

import LoginModal from "./components/loginModal";
import { useAuth } from "./hooks/useAuth";

const customUI = {
  commentThread: (instance, id) => ({
    render: () => {
      const div = document.createElement("div");
      console.log("Custom UI");
      div.innerText = "Custom UI for admins";
      div.style.padding = "10px";
      div.style.backgroundColor = "lightblue";
      return div;
    },
  }),
};

const defaultUI = {}; // Empty = use default Nutrient UI

export default function App() {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const isLoadingFromBackend = useRef(false);

  const { user, loading, loginWithGoogle } = useAuth(); // ← add loading
  console.log(
    "userName inside app from getUser function directly ",
    getCurrentUser()?.user_metadata.full_name,
    user,
  );

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
          let annotationJson = await fetch("/.netlify/functions/getAnnotation");
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
              annotation instanceof NutrientViewer.Annotations.MarkupAnnotation
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

    // return () => NutrientViewer?.unload(container);
    return () => {
      if (NutrientViewer && container) {
        NutrientViewer.unload(container);
      }
    };
  }, [user]);

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
