export function generateImageFromString(str: string, width = 1024, height = 1024) {
  // Create a deterministic color based on string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;

  // Create a canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx != null) {
    // Background

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, width / 2, height / 2);
  }

  // Return image as data URL
  return canvas.toDataURL('image/png');
}
