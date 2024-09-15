export const handleChange =
  (setter, key, validator, setError, errorKey, errorMessage) => (text) => {
    const trimmedText = text.trim();
    setter((prevState) => ({
      ...prevState,
      [key]: trimmedText,
    }));
    if (!validator(trimmedText)) {
      setError((prevState) => ({
        ...prevState,
        [errorKey]: errorMessage,
      }));
    } else {
      setError((prevState) => ({
        ...prevState,
        [errorKey]: "",
      }));
    }
  };
