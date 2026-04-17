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
      creatorName: annotationObj.creatorName,
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
    console.log("Adding");
  }
  isLoadingFromBackend.current = false;
  console.log("after Annotation array", isLoadingFromBackend);
}
