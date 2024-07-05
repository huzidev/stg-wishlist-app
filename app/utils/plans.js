export const initialValues = {
    id: null,
    loading: false
}

export const Plans = [
    {
        id: 1,
        title: "Free Plan",
        type: "Basic",
        cost: "$0/month",
        features: [
            "Basic Wishlist Functionality",
            "No guest list features",
            "No discount feature",
            "Basic Support",
        ],
    },
    {
        id: 2,
        title: "Standard Plan",
        type: "Standard",
        cost: "$19/month",
        features: [
            "Advanced Wishlist Functionality",
            "Available guest list feature",
            "20 discounts per-month",
            "Email Notifications",
        ],
    },
    {
        id: 3,
        title: "Advanced Plan",
        type: "Advanced",
        cost: "$49/month",
        features: [
            "Unlimited Wishlist Items",
            "Available guest list feature",
            "Unlimited discounts",
            "Premium Support",
        ],
    },
];
