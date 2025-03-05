const validateFields = (formData) => {
  let errors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Email is invalid";
  } else if (formData.email.length > 254) {
    errors.email = "Email is too long";
  } else if (formData.email.split("@")[1].length > 63) {
    errors.email = "Email domain is too long";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (formData.username) {
    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 2) {
      errors.username = "Username must be at least 2 characters";
    } else if (!/^[a-zA-Zа-яА-Я0-9_.]+$/.test(formData.username)) {
      errors.username =
        "Username can only contain letters (Latin or Cyrillic), numbers, underscores (_), and dots (.)";
    } else if ((formData.username.match(/[a-zA-Zа-яА-Я]/g) || []).length < 2) {
      errors.username = "Username must contain at least 2 letters";
    } else if (formData.username.length > 30) {
      errors.username = "Username cannot be longer than 30 characters";
    } else if (formData.username.trim() !== formData.username) {
      errors.username = "Username cannot contain leading or trailing spaces";
    } else if (formData.username.toLowerCase().includes("admin")) {
      errors.username = "Username cannot contain the word 'admin'";
    }
  }

  return errors;
};

module.exports = { validateFields };
