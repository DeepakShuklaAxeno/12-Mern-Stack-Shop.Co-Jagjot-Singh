 const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${import.meta.env.VITE_BACKEND_LOCAL_URL}${image.startsWith("/") ? image : `/${image}`}`;
  }

export default getImageUrl;   