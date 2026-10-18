export function billboardNavigation(index, count) {
  const lastIndex = Math.max(0, count - 1);
  return {
    showNavigation: count > 1,
    atNewest: index <= 0,
    atOldest: count <= 1 || index >= lastIndex,
    olderIndex: Math.min(index + 1, lastIndex),
    newerIndex: Math.max(index - 1, 0),
  };
}

export function billboardLabel(board) {
  return board?.fallback || board?.active ? "Today's Board" : 'Previous Board';
}
