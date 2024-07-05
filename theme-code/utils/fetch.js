export const LOCAL_HOST = 'http://localhost:59946';
export const themeListURL = `${LOCAL_HOST}/theme/list`;
export const themeProductURL = `${LOCAL_HOST}/theme/product`;
const themePlanURL = `${LOCAL_HOST}/theme/plan`;

// Get All Wishlist Added By LoggedIn User
export async function getLists(HOST) {
    try {
        const res = await fetch(HOST, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const response = await res.json();
        return response.data;
    } catch (e) {
        console.log("Error", e);
    }
}

// Get All Products According To Wishlist
export async function getProducts(HOST) {
    try {
        const res = await fetch(HOST, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const response = await res.json();
        return response.data;
    } catch (e) {
        console.log("Error", e);
    }
}

export async function getStorePlan() {
    try {
        const res = await fetch(themePlanURL, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const response = await res.json();
        return response.data;
    } catch (e) {
        console.log("Error", e);
    }
}

// Update/Delete
export async function updateMethod(HOST, method, config) {
    try {
        const res = await fetch(HOST, {
            method,
            headers: {
                Accept: "application/json",
            },
            body: JSON.stringify(config),
        });
        const response = await res.json();
        return response;
    } catch (e) {
        console.log("Error", e);
    }
}

// Add Product To Cart From Wishlist
export async function addToCart(shopURL, config) {
    try {
        const res = await fetch(`https://${shopURL}/cart/add.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: [config] }),
        });
        const response = await res.json();
        return response;
    } catch (e) {
        console.log("Error", e);
    }
}

// Get Single Product Details
export async function getProduct(url) {
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const response = await res.json();
        return response;
    } catch (e) {
        console.log("Error", e);
    }
}

// Get Each Products Img Source
export async function fetchProductsImages(products) {
    const updatedProducts = await Promise.all(
        products.map(async (product) => {
            const { product_url } = product;
            const productData = await getProduct(product_url);
            const { variants, title, image } = productData.product;
            const imageSrc = image?.src;
            const price = variants[0]?.price;
            return { ...product, title, imageSrc, variants, price };
        }),
    );
    return updatedProducts;
}