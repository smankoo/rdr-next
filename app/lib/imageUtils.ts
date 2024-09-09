export function getPlaceholderImage(size: number = 40, text: string = "User"): string {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${
        size / 3
      }px" fill="#a0a0a0" text-anchor="middle" dy=".3em">${text[0].toUpperCase()}</text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
