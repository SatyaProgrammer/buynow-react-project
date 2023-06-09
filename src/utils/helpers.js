export const formatPrice = (number) => {
  const newNumber = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
  return newNumber;
};

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]);
  if (type === "customization") {
    unique = unique.map((item) => item["color"]);
    unique = unique.flat();
  }
  return ["all", ...new Set(unique)];
};
