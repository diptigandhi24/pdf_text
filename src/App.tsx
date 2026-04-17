import { useEffect, useRef, useState } from "react";
import { createNoteAnnotationFromBckend } from "./utility";
import AddUser from "./adduser";
import Cookies from "js-cookie";

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

  let [displayUi, setDisplayUi] = useState(
    Cookies.get("username") == undefined ? true : false,
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
          console.log(
            "isLoadingFromBackend.current",
            isLoadingFromBackend.current,
          );
          if (isLoadingFromBackend.current) return;
          console.log("Created:", annotation.toJS(), isLoadingFromBackend);
          if (Cookies.get("username") == undefined) {
            setDisplayUi(true);
          }
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
        if (Cookies.get("username") != undefined) {
          instance.setAnnotationCreatorName(Cookies.get("username"));
        }
      });
    })();

    return () => NutrientViewer?.unload(container);
  }, []);

  return (
    <div>
      <div ref={containerRef} style={{ height: "100vh" }} />
      {displayUi ? (
        <AddUser
          handleClose={() => {
            setDisplayUi(false);
          }}
          pdfInstance={instanceRef.current}
        />
      ) : null}
    </div>
  );
}
