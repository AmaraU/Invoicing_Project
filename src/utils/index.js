export const getImageUrl = (path) => {
    return new URL(`/assets/${path}`, import.meta.url).href;
};

export const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
};

export const formatNumberDecimals = (number) => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

export const formatNumber2Dec = (number) => {
    return number % 1 === 0
        ? new Intl.NumberFormat('en-US').format(number)
        : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
};

export const handleDates = (date) => {
    if (!date) {
        return new Date().toISOString().split('T')[0]
    } else {
        return new Date(date).toISOString().split('T')[0];
    }
}