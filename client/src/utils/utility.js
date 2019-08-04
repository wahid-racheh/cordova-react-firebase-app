export const initials = str => {
  const initials = str.match(/\b\w/g) || [];
  return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

export const isSmart = () => {
  return (
    !(
      document.URL.indexOf("http://") > -1 ||
      document.URL.indexOf("https://") > -1
    ) && !!window.cordova
  );
};
