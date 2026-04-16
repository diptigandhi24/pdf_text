let NutrientViewer = await import("@nutrient-sdk/viewer");
// annotationArray,
//   pdfInstance,
//   isLoadingFromBackend,

export async function createNoteAnnotationFromBckend(
  annotationArray,
  pdfInstance,
  isLoadingFromBackend,
) {
  isLoadingFromBackend.current = true;
  console.log("Before creating Annotation", isLoadingFromBackend);
  for (const annotationObj of annotationArray) {
    let annotation = new NutrientViewer.Annotations.NoteAnnotation({
      id: annotationObj.id,
      name: annotationObj.name,
      pageIndex: annotationObj.pageIndex,
      boundingBox: new NutrientViewer.Geometry.Rect({
        ...annotationObj.boundingBox,
      }),
      opacity: annotationObj.opacity,
      creatorName: null,
      lockedContents: false,
      readOnly: false,
      isAnonymous: false,
      rotation: 0,
      text: annotationObj.text,
      icon: "COMMENT",
      backgroundColor: new NutrientViewer.Color({
        ...annotationObj.backgroundColor,
      }),
    });
    await pdfInstance.create(annotation);
  }
  //   let annotation = new NutrientViewer.Annotations.NoteAnnotation({
  //     id: "02KP8J59B0ZCNP325JSYM7DG3J",
  //     name: "02KP8J59B0ZCNP325JSYM7DG3J",
  //     pageIndex: 26,
  //     boundingBox: new NutrientViewer.Geometry.Rect({
  //       width: 36,
  //       height: 36,
  //       left: 54.33125000000001,
  //       top: 472.960595703125,
  //     }),
  //     opacity: 1,
  //     creatorName: null,
  //     lockedContents: false,
  //     readOnly: false,
  //     isAnonymous: false,
  //     rotation: 0,
  //     text: {
  //       format: "plain",
  //       value: "this is just a second note",
  //     },
  //     icon: "COMMENT",
  //     backgroundColor: new NutrientViewer.Color({
  //       r: 255,
  //       g: 216,
  //       b: 63,
  //       transparent: false,
  //     }),
  //   });
  //   await pdfInstance.create(annotation);
  isLoadingFromBackend.current = false;
  console.log("after Annotation array", isLoadingFromBackend);
}

// function addAnnotationToDB(annoationObj) {}
