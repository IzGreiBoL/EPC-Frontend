/**
 * Utility functions for scroll management
 */
export class ScrollUtils {
  
  /**
   * Scrolls to the top of the page smoothly
   * Safe for SSR environments
   */
  static scrollToTop(behavior: 'auto' | 'smooth' = 'smooth'): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    }
  }

  /**
   * Forces immediate scroll to top - useful for navigation scenarios
   * Safe for SSR environments
   */
  static forceScrollToTop(): void {
    if (typeof window !== 'undefined') {
      // Immediate scroll without animation
      window.scrollTo(0, 0);
      // Also set on document body and documentElement for maximum compatibility
      if (document.body) {
        document.body.scrollTop = 0;
      }
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
    }
  }

  /**
   * Scrolls to a specific element by ID
   * @param elementId - The ID of the element to scroll to
   * @param behavior - Scroll behavior ('auto' | 'smooth')
   * @param offset - Optional offset from the top of the element
   */
  static scrollToElement(elementId: string, behavior: 'auto' | 'smooth' = 'smooth', offset: number = 0): void {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(elementId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior
        });
      }
    }
  }

  /**
   * Scrolls to a specific Y position
   * @param top - Y position to scroll to
   * @param behavior - Scroll behavior ('auto' | 'smooth')
   */
  static scrollToPosition(top: number, behavior: 'auto' | 'smooth' = 'smooth'): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top,
        left: 0,
        behavior
      });
    }
  }

  /**
   * Gets current scroll position
   * @returns Object with x and y scroll positions, or {x: 0, y: 0} if not in browser
   */
  static getCurrentScrollPosition(): { x: number; y: number } {
    if (typeof window !== 'undefined') {
      return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
      };
    }
    return { x: 0, y: 0 };
  }
}
