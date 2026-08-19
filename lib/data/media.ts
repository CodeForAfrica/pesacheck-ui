/** Public media-host base, e.g. `https://media-staging.pesacheck.org/media/`. */
export const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? "";

/** Build the public URL for a media asset. */
export function mediaAssetUrl(assetId: string, ext: string): string {
  return `${MEDIA_URL}${assetId}.${ext}`;
}
