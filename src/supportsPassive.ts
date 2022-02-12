let supportsPassive = false;

if (typeof document !== "undefined") {
  const options: AddEventListenerOptions = {
    get passive() {
      supportsPassive = true;
      return supportsPassive;
    },
  };

  const listener = () => {};

  window.addEventListener("_", listener, options);
  window.removeEventListener("_", listener, options);
}

export default supportsPassive;
