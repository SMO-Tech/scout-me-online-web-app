import { useEffect } from 'react';

interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: 'website' | 'profile' | 'article';
  firstName?: string;
  lastName?: string;
  siteName?: string;
}

/**
 * Custom hook to update SEO metadata dynamically
 */
export function useSEO(data: SEOData) {
  useEffect(() => {
    if (!data.title) return;

    // Update document title
    document.title = data.title;

    // Helper to update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic SEO
    if (data.description) {
      updateMetaTag('description', data.description);
    }
    if (data.keywords) {
      updateMetaTag('keywords', data.keywords);
    }

    // Open Graph
    updateMetaTag('og:type', data.type || 'website', true);
    if (data.url) {
      updateMetaTag('og:url', data.url, true);
    }
    updateMetaTag('og:title', data.title, true);
    if (data.description) {
      updateMetaTag('og:description', data.description, true);
    }
    if (data.image) {
      updateMetaTag('og:image', data.image, true);
    }
    if (data.siteName) {
      updateMetaTag('og:site_name', data.siteName, true);
    }

    // Profile-specific Open Graph tags
    if (data.type === 'profile') {
      if (data.firstName) {
        updateMetaTag('profile:first_name', data.firstName, true);
      }
      if (data.lastName) {
        updateMetaTag('profile:last_name', data.lastName, true);
      }
    }

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    if (data.url) {
      updateMetaTag('twitter:url', data.url);
    }
    updateMetaTag('twitter:title', data.title);
    if (data.description) {
      updateMetaTag('twitter:description', data.description);
    }
    if (data.image) {
      updateMetaTag('twitter:image', data.image);
    }

    // Canonical URL
    if (data.url) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', data.url);
    }

    // Robots
    updateMetaTag('robots', 'index, follow');
  }, [data]);
}

