export function componentHasChild(child, ComponentWrapper) {
  for (const property in ComponentWrapper) {
    if (ComponentWrapper.hasOwnProperty(property)) {
      if (child.type === ComponentWrapper[property]) {
        return true;
      }
    }
  }
  return false;
}
