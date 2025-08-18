/**
 * Utility functions for handling social media deep links
 * Attempts to open in native app first, falls back to web browser
 */

/**
 * Opens a Facebook post in the native app if available, otherwise in browser
 * @param url - The Facebook post URL
 */
export const openFacebookLink = (url: string) => {
  // Extract post ID from Facebook URL - handles both formats:
  // https://www.facebook.com/POST_ID or https://facebook.com/POST_ID
  const postIdMatch = url.match(/facebook\.com\/(\d+)/);

  if (postIdMatch) {
    const postId = postIdMatch[1];
    // For Facebook app deep link, use the story format which works better for posts
    const fbAppUrl = `fb://story?story_fbid=${postId}`;

    // Try to open in app first
    try {
      window.location.href = fbAppUrl;

      // Fallback to web after a short delay if app doesn't open
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
      }, 1000);
    } catch (error) {
      // If deep link fails, go directly to web
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } else {
    // If we can't extract the ID, just open the web URL
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

/**
 * Opens an Instagram post in the native app if available, otherwise in browser
 * @param url - The Instagram post URL
 */
export const openInstagramLink = (url: string) => {
  // Extract post shortcode from Instagram URL
  const shortcodeMatch = url.match(/instagram\.com\/p\/([^\/]+)/);

  if (shortcodeMatch) {
    const shortcode = shortcodeMatch[1];
    // Try to open in Instagram app first using the post format
    const igAppUrl = `instagram://p/${shortcode}`;

    try {
      window.location.href = igAppUrl;

      // Fallback to web after a short delay if app doesn't open
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
      }, 1000);
    } catch (error) {
      // If deep link fails, go directly to web
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } else {
    // If we can't extract the shortcode, just open the web URL
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

/**
 * Generic function to handle social media links with deep link support
 * @param url - The social media URL
 * @param platform - The platform type ('facebook' | 'instagram')
 */
export const openSocialLink = (
  url: string,
  platform: "facebook" | "instagram"
) => {
  if (platform === "facebook") {
    openFacebookLink(url);
  } else if (platform === "instagram") {
    openInstagramLink(url);
  } else {
    // Fallback for unknown platforms
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
