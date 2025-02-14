// Utility function for validations
const validateMenuFields = (fields) => {
  const { name, description, price } = fields;
  if (!name || !description || !price) {
    return "All fields (name, description, price) are required.";
  }
  return null;
};
export default validateMenuFields;