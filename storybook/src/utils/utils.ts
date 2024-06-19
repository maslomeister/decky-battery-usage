export function findNewDimensions(dimensions: {
  width: number;
  height: number;
}): {
  width: number;
  height: number;
} {
  const maxWidth = Math.floor(0.85 * dimensions.width);
  const maxHeight = Math.floor(0.75 * dimensions.height);

  const minInnerWidth = 16; // Padding inside the new width

  let newWidth = maxWidth;
  let newHeight = maxHeight;

  // Find a new width that meets the conditions
  while (newWidth > minInnerWidth) {
    if ((newWidth - minInnerWidth) % 6 === 0) {
      break;
    }
    newWidth--;
  }

  // Find a new height that meets the conditions
  while (newHeight > 0) {
    if (newHeight % 4 === 0) {
      break;
    }
    newHeight--;
  }

  return { width: newWidth, height: newHeight };
}
