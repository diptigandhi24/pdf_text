import { useEffect, useRef, useState } from "react";
import {
  createNoteAnnotationFromBckend,
  createHightlightAnnotationFromBckend,
} from "./utility";
import { getCurrentUser } from "./lib/auth";
import AddUser from "./adduser";
import Cookies from "js-cookie";
import netlifyIdentity from "netlify-identity-widget";

netlifyIdentity.init();
// import AuthButton from "./components/authButton";
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

  let [displayUi, setDisplayUi] = useState(false);
  const { user, loading, loginWithGoogle } = useAuth(); // ← add loading
  console.log(
    "userName inside app from getUser function directly ",
    getCurrentUser()?.user_metadata.full_name,
    user,
  );

  // let [displayUi, setDisplayUi] = useState(false);
  useEffect(() => {
    console.log("display UI useEffect", displayUi);
  }, [displayUi]);
  console.log(
    "Cookies right now",
    Cookies.get("username"),
    "displayState",
    displayUi,
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
        ui: displayUi ? customUI : defaultUI,
      }).then(async (instance) => {
        instanceRef.current = instance;
        if (Cookies.get("username") == undefined) {
          setDisplayUi(true);
        }

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
        instance.setAnnotationCreatorName(Cookies.get("username"));
      });
    })();

    // return () => NutrientViewer?.unload(container);
    return () => {
      console.log;
      if (NutrientViewer && container) {
        console.log("Nutrient unloading", NutrientViewer && container);
        NutrientViewer.unload(container);
      }
    };
  }, [displayUi, user]);

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
      {displayUi ? <AddUser handleClose={() => setDisplayUi(false)} /> : null}
    </div>
  );
}
