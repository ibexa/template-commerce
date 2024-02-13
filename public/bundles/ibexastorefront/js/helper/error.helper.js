export const errorHandler = (error) => {
    if (error.message) {
        console.warn(error.message);
    }
};
