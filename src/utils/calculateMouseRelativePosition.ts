
/**
 * Calculate the mouse's position in relative to the given element.
 */
export default function calculateMouseRelativePosition(mouseX: number, mouseY: number, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: mouseX - rect.left,
    y: mouseY - rect.top,
  }
}
