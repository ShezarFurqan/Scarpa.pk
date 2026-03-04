"use client"
import { createContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Next 13+ app dir
import { collection, query, where, getDocs, orderBy, doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { ScatterChartIcon } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";



export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [landingPage, setLandingPage] = useState({})
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutMode, setCheckoutMode] = useState("cart"); 
    const [buyNowItem, setBuyNowItem] = useState(null); 


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setToken(currentUser.uid); // optional, if you want token
            } else {
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);



    const fetchCartFromDB = async (userId) => {
        if (!userId) return [];
        try {
            const userRef = doc(db, "users", userId);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists() && docSnap.data().cart) {
                return docSnap.data().cart;
            }
        } catch (error) {
            console.error("❌ Error fetching cart:", error);
        }
        return [];
    };

    const saveCartToDB = async (userId, cartItems) => {
        if (!userId || !cartItems) return;
        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, {
                cart: cartItems,
                updatedAt: serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("❌ Error saving cart:", error);
        }
    };

    const mergeCarts = (dbCart, localCart) => {
        const merged = [...dbCart];
        localCart.forEach((item) => {
            const existing = merged.find(
                (dbItem) => dbItem.id === item.id && dbItem.size === item.size
            );
            if (existing) {
                const stock = Number(item.qty || item.stock || Infinity);
                existing.quantity = Math.min(existing.quantity + item.quantity, stock);
            } else {
                merged.push(item);
            }
        });
        return merged;
    };

    // --- 3. Effects (Safety Checks Added) ---

    // Load Cart: Only runs in the browser
    useEffect(() => {
        const loadCart = async () => {
            // Check if we are in the browser
            if (typeof window !== "undefined") {
                const localData = localStorage.getItem("cart");
                const localCart = localData ? JSON.parse(localData) : [];

                if (user?.uid) {
                    const dbCart = await fetchCartFromDB(user.uid);
                    if (localCart.length > 0) {
                        const merged = mergeCarts(dbCart, localCart);
                        setCart(merged);
                        localStorage.removeItem("cart");
                        saveCartToDB(user.uid, merged);
                    } else {
                        setCart(dbCart);
                    }
                } else {
                    setCart(localCart);
                }
            }
        };
        loadCart();
    }, [user]);

    // Auto-sync: Only runs when cart changes
    useEffect(() => {
        if (typeof window !== "undefined" && cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
            if (user?.uid) {
                saveCartToDB(user.uid, cart);
            }
        }
    }, [cart, user]);

    // --- 4. Main Actions ---

    const addToCart = (product, quantity = 1, size = "") => {
        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id && item.size === size);
            const stock = Number(product.qty || product.stock || Infinity);
            const qtyToAdd = Number(quantity);

            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.size === size)
                        ? { ...item, quantity: Math.min(item.quantity + qtyToAdd, stock) }
                        : item
                );
            }
            return [...prev, { ...product, size, quantity: Math.min(qtyToAdd, stock) }];
        });
    };

    const updateQuantity = (productId, size = "", newQty) => {
        setCart((prev) => {
            return prev.map((item) => {
                if (item.id === productId && item.size === size) {
                    const stock = Number(item.qty || item.stock || Infinity);
                    return { ...item, quantity: Math.min(Math.max(0, newQty), stock) };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };
    const removeFromCart = (productId, size = "") => {
        setCart((prev) => {
            const updatedCart = prev.filter(
                (item) => !(item.id === productId && item.size === size)
            );

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            if (user?.uid) saveCartToDB(user.uid, updatedCart);

            return updatedCart;
        });
    };




    const fetchActiveProducts = async () => {
        try {
            // 1. Reference to products collection
            const productsRef = collection(db, 'products')
            const q = query(
                productsRef,
                where('isActive', '==', true)
            )

            // 3. Execute query
            const querySnapshot = await getDocs(q)

            // 4. Map results to array
            const activeProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            return activeProducts
        } catch (error) {
            console.error("Error fetching active products:", error)
            throw error
        }
    }

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchActiveProducts()
            setProducts(data)
        }
        loadProducts()
    }, [])




    let value = {
        router,
        token,
        setToken,
        user,
        setUser,
        products,
        addToCart,
        removeFromCart,
        updateQuantity,
        cart,
        setCart,
        landingPage,
        setLandingPage,
        checkoutMode,
        setCheckoutMode,
        buyNowItem,
        setBuyNowItem
    }

    if (loading) {
        return null
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
