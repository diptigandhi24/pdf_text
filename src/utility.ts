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

export async function createHightlightAnnotationFromBckend(
  instance,
  isLoadingFromBackend,
) {
  isLoadingFromBackend.current = true;
  const backendAnnotation = {
    id: "01KPMYZ7863CD26Q05XNPFJYD7",
    pageIndex: 20,
    boundingBox: {
      left: 72.16239929199219,
      top: 554.53955078125,
      width: 452.209375,
      height: 28.548437499999977,
    },
    rects: [
      {
        left: 72.16239929199219,
        top: 554.53955078125,
        width: 452.209375,
        height: 13.5484375,
      },
      {
        left: 72.40599822998047,
        top: 569.53955078125,
        width: 49.82421875,
        height: 13.5484375,
      },
    ],
    color: { r: 252, g: 238, b: 124 },
    creatorName: "Dipti",
    blendMode: "multiply",
    opacity: 1,
  };

  // Build the rects as an Immutable List of Rect objects
  const rects = NutrientViewer.Immutable.List(
    backendAnnotation.rects.map(
      (r) =>
        new NutrientViewer.Geometry.Rect({
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        }),
    ),
  );

  const annotation = new NutrientViewer.Annotations.HighlightAnnotation({
    id: backendAnnotation.id,
    name: backendAnnotation.id,
    pageIndex: backendAnnotation.pageIndex,
    rects: rects,
    boundingBox: NutrientViewer.Geometry.Rect.union(rects),
    color: new NutrientViewer.Color(backendAnnotation.color),
    opacity: backendAnnotation.opacity,
    blendMode: backendAnnotation.blendMode,
    creatorName: backendAnnotation.creatorName,
  });

  await instance.create(annotation);
  console.log("Highlight annotation restored from backend.");
  isLoadingFromBackend.current = false;
}
