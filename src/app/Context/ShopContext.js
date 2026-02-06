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
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            if (currentUser) {
                setUser(currentUser)
            } else {
                setUser(null)
            }

            setLoading(false)
        })

        return () => unsubscribe()

    }, [])


    const saveCartToDB = async (userId, cartItems) => {
        if (!userId) return;
        try {
            const userRef = doc(db, "users", userId);

            // Firestore me document create ya merge karna
            await setDoc(
                userRef,
                {
                    cart: cartItems,
                    updatedAt: serverTimestamp(),
                },
                { merge: true } // agar document already exist kare to merge
            );

        } catch (error) {
            console.error("❌ Error syncing cart to DB:", error);
        }
    };

    const fetchCartFromDB = async (userId) => {
        if (!userId) return [];
        try {
            const userRef = doc(db, "users", userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists() && docSnap.data().cart) {
                return docSnap.data().cart;
            }
            return [];
        } catch (error) {
            console.error("❌ Error fetching cart from DB:", error);
            return [];
        }
    };

    // ----------------- Load Cart on Start -----------------
    useEffect(() => {
        const loadCart = async () => {
            if (user?.uid) {
                // Logged-in user -> Fetch cart from DB
                const dbCart = await fetchCartFromDB(user.uid);

                // Merge guest cart from localStorage if exists
                const localCart = JSON.parse(localStorage.getItem("cart")) || [];
                const mergedCart = mergeCarts(dbCart, localCart);

                setCart(mergedCart);
                localStorage.setItem("cart", JSON.stringify(mergedCart));
                saveCartToDB(user.uid, mergedCart); // Sync merged cart to DB
            } else {
                // Guest user -> localStorage
                const localCart = JSON.parse(localStorage.getItem("cart")) || [];
                setCart(localCart);
            }
        };
        loadCart();
    }, [user]);

    // ----------------- Helper: Merge Guest + DB Cart -----------------
    const mergeCarts = (dbCart, localCart) => {
        const merged = [...dbCart];

        localCart.forEach((item) => {
            const existing = merged.find(
                (dbItem) => dbItem.id === item.id && dbItem.size === item.size
            );
            if (existing) {
                existing.quantity += item.quantity; // merge quantity
            } else {
                merged.push(item);
            }
        });

        return merged;
    };

    // ----------------- Cart Functions -----------------
    const addToCart = (product, quantity = 1, size = "") => {
        setCart((prev) => {
            const existing = prev.find(
                (item) => item.id === product.id && item.size === size
            );

            const updatedCart = existing
                ? prev.map((item) =>
                    item.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
                : [...prev, { ...product, quantity, size }];

            // Save to localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            // Save to DB if user is logged-in
            if (user?.uid) saveCartToDB(user.uid, updatedCart);

            return updatedCart;
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

    const updateQuantity = (productId, size = "", quantity) => {
        setCart((prev) => {
            const updatedCart =
                quantity <= 0
                    ? prev.filter((item) => !(item.id === productId && item.size === size))
                    : prev.map((item) =>
                        item.id === productId && item.size === size
                            ? { ...item, quantity }
                            : item
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
        location,
        products,
        addToCart,
        removeFromCart,
        updateQuantity,
        cart,
        setCart,
        landingPage,
        setLandingPage
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
