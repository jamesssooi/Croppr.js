
/**
 * Default list of handles to create.
 */
export const DEFAULT_HANDLES = [
  { position: [0.0, 0.0], constraints: [1, 0, 0, 1], cursor: 'nw-resize' },
  { position: [0.5, 0.0], constraints: [1, 0, 0, 0], cursor: 'n-resize' },
  { position: [1.0, 0.0], constraints: [1, 1, 0, 0], cursor: 'ne-resize' },
  { position: [1.0, 0.5], constraints: [0, 1, 0, 0], cursor: 'e-resize' },
  { position: [1.0, 1.0], constraints: [0, 1, 1, 0], cursor: 'se-resize' },
  { position: [0.5, 1.0], constraints: [0, 0, 1, 0], cursor: 's-resize' },
  { position: [0.0, 1.0], constraints: [0, 0, 1, 1], cursor: 'sw-resize' },
  { position: [0.0, 0.5], constraints: [0, 0, 0, 1], cursor: 'w-resize' }
];
