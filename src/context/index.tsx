// // src/context/BooksContext.tsx
// import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
// import { getPatchedEpubBuffer } from "../utils/epubPatch";
// import ePub, { NavItem } from "epubjs";

// export type Book = {
//     _id: string;
//     bookName: string;
//     authorName?: string;
//     bookVersion?: string;
//     bookPageNumber?: number | null;
//     bookDescription?: string;
//     bookLanguage?: string;
//     bookAddition?: string;
//     order?: number;
//     createdAt?: string;
//     updatedAt?: string;
//     bookLink: string;
// };

// export type BooksApiResponse = {
//     success: boolean;
//     data: Book[];
// };

// type BookAssets = {
//     buffer: ArrayBuffer;
//     toc: NavItem[];
//     tocFlat: NavItem[];
// };

// type BooksContextValue = {
//     // books list
//     allBooks: Book[];
//     setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;

//     // current selection
//     currentBookLink: string;
//     setCurrentBookLink: React.Dispatch<React.SetStateAction<string>>;
//     currentChapterHref: string;
//     setCurrentChapterHref: React.Dispatch<React.SetStateAction<string>>;

//     // load state
//     isBooksLoading: boolean;
//     isBookLoading: boolean;
//     error: string | null;

//     // assets
//     booksTocMap: Record<string, NavItem[]>;
//     booksTocFlatMap: Record<string, NavItem[]>;
//     getBookAssets: (bookLink: string) => Promise<BookAssets>;
//     prefetchBooksAssets: (bookLinks: string[]) => Promise<void>;

//     // helpers
//     selectBook: (bookLink: string) => void;
//     selectChapter: (bookLink: string, href: string) => void;
// };

// const BooksContext = createContext<BooksContextValue | null>(null);

// function flattenToc(items: NavItem[] = [], out: NavItem[] = []) {
//     for (const it of items) {
//         out.push(it);
//         if (it.subitems?.length) flattenToc(it.subitems as NavItem[], out);
//     }
//     return out;
// }

// async function loadBookAssets(bookLink: string): Promise<BookAssets> {
//     const buffer = await getPatchedEpubBuffer(bookLink);

//     // temp book to read TOC
//     const tmp = ePub();
//     await tmp.open(buffer, "binary");
//     await tmp.ready;

//     const nav = await tmp.loaded.navigation;
//     const toc = (nav?.toc || []) as NavItem[];
//     const tocFlat = flattenToc(toc);

//     try {
//         tmp.destroy?.();
//     } catch {
//         // ignore
//     }

//     return { buffer, toc, tocFlat };
// }

// export function BooksProvider({
//     children,
//     /**
//      * Optional: provide initial data so provider doesn't fetch.
//      * If not provided, provider will fetch from `fetchUrl`.
//      */
//     initialBooks,
//     /**
//      * Optional: API endpoint returning your response shape:
//      * { success: true, data: Book[] }
//      */
//     fetchUrl,
// }: {
//     children: React.ReactNode;
//     initialBooks?: Book[];
//     fetchUrl?: string; // e.g. "https://api-dev.lucistrust.org/api/book?bookLanguage=English"
// }) {
//     const [allBooks, setAllBooks] = useState<Book[]>(initialBooks ?? []);
//     const [currentBookLink, setCurrentBookLink] = useState<string>(initialBooks?.[0]?.bookLink ?? "");
//     const [currentChapterHref, setCurrentChapterHref] = useState<string>("");

//     const [isBooksLoading, setIsBooksLoading] = useState<boolean>(false);
//     const [isBookLoading, setIsBookLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     // caches (do not trigger rerenders)
//     const assetsCacheRef = useRef<Map<string, BookAssets>>(new Map());

//     // state maps for sidebar usage
//     const [booksTocMap, setBooksTocMap] = useState<Record<string, NavItem[]>>({});
//     const [booksTocFlatMap, setBooksTocFlatMap] = useState<Record<string, NavItem[]>>({});

//     // -------- Fetch books list (optional) --------
//     useEffect(() => {
//         if (initialBooks?.length) return;
//         if (!fetchUrl) return;

//         let cancelled = false;

//         (async () => {
//             try {
//                 setIsBooksLoading(true);
//                 setError(null);

//                 const res = await fetch(fetchUrl, { cache: "no-store" });
//                 if (!res.ok) throw new Error(`Books fetch failed: ${res.status}`);
//                 const json = (await res.json()) as BooksApiResponse;

//                 if (!json?.success || !Array.isArray(json.data)) {
//                     throw new Error("Books API response invalid");
//                 }

//                 if (cancelled) return;

//                 // sort by order like your UI
//                 const sorted = [...json.data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
//                 setAllBooks(sorted);

//                 // pick first book if none selected
//                 if (!currentBookLink && sorted[0]?.bookLink) {
//                     setCurrentBookLink(sorted[0].bookLink);
//                 }
//             } catch (e: any) {
//                 if (!cancelled) setError(e?.message ?? String(e));
//             } finally {
//                 if (!cancelled) setIsBooksLoading(false);
//             }
//         })();

//         return () => {
//             cancelled = true;
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [fetchUrl]);

//     // -------- Assets API --------
//     const getBookAssets = async (bookLink: string): Promise<BookAssets> => {
//         if (!bookLink) throw new Error("bookLink is empty");

//         const cached = assetsCacheRef.current.get(bookLink);
//         if (cached) return cached;

//         setIsBookLoading(true);
//         setError(null);

//         try {
//             const assets = await loadBookAssets(bookLink);
//             assetsCacheRef.current.set(bookLink, assets);

//             // publish toc into state maps (sidebar)
//             setBooksTocMap((prev) => ({ ...prev, [bookLink]: assets.toc }));
//             setBooksTocFlatMap((prev) => ({ ...prev, [bookLink]: assets.tocFlat }));

//             return assets;
//         } catch (e: any) {
//             setError(e?.message ?? String(e));
//             throw e;
//         } finally {
//             setIsBookLoading(false);
//         }
//     };

//     const prefetchBooksAssets = async (bookLinks: string[]) => {
//         // sequential to avoid hammering network/memory
//         for (const link of bookLinks) {
//             if (!link) continue;
//             if (assetsCacheRef.current.has(link)) continue;
//             try {
//                 await getBookAssets(link);
//             } catch {
//                 // ignore per-book failures
//             }
//         }
//     };

//     // -------- selection helpers --------
//     const selectBook = (bookLink: string) => {
//         setCurrentBookLink(bookLink);
//         setCurrentChapterHref(""); // reset to first chapter (reader will decide)
//     };

//     const selectChapter = (bookLink: string, href: string) => {
//         setCurrentBookLink(bookLink);
//         setCurrentChapterHref(href);
//     };

//     const value: BooksContextValue = useMemo(
//         () => ({
//             allBooks,
//             setAllBooks,

//             currentBookLink,
//             setCurrentBookLink,
//             currentChapterHref,
//             setCurrentChapterHref,

//             isBooksLoading,
//             isBookLoading,
//             error,

//             booksTocMap,
//             booksTocFlatMap,

//             getBookAssets,
//             prefetchBooksAssets,

//             selectBook,
//             selectChapter,
//         }),
//         [
//             allBooks,
//             currentBookLink,
//             currentChapterHref,
//             isBooksLoading,
//             isBookLoading,
//             error,
//             booksTocMap,
//             booksTocFlatMap,
//         ]
//     );

//     return <BooksContext.Provider value={ value }> { children } </BooksContext.Provider>;
// }

// export function useBooks() {
//     const ctx = useContext(BooksContext);
//     if (!ctx) throw new Error("useBooks must be used within BooksProvider");
//     return ctx;
// }

















// // src/context/AppContextValue.tsx
// import React, { createContext, useContext, useMemo, useState } from "react";

// type AppContextValueType = {
//     books: any[];
//     complitionBooks: any;
//     setBooksMeta: (data: any) => void;
// };

// const AppContextValue = createContext<AppContextValueType | undefined>(undefined);

// export function AppProvider({ children }: { children: React.ReactNode }) {
//     const [books, setBooks] = useState<any[]>([]);
//     const [complitionBooks, setComplitionBooks] = useState<any[]>([]);

//     const value = useMemo<AppContextValueType>(
//         () => ({
//             books,
//             complitionBooks,
//             setBooksMeta: (data: any) => {
//                 setBooks(data?.all)
//                 setComplitionBooks(data?.complition)
//             },
//         }),
//         [books]
//     );


//     return (
//         <AppContextValue.Provider value={value} >
//             {children}
//         </AppContextValue.Provider>
//     );

// }

// export function useAppContext() {
//     const ctx = useContext(AppContextValue);
//     if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
//     return ctx;
// }






// src/context/AppContextValue.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TocItem = {
    id: string;
    label: string;
    href: string;
    subitems?: TocItem[];
};

type AppContextValueType = {
    // data
    books: any[];
    complitionBooks: any[];

    // loading / error
    loadingBooks: boolean;
    booksError: string | null;

    // actions
    fetchBooks: () => Promise<void>;
    setBooksMeta: (data: any) => void;

    // TOCs
    bookTocsById: Record<string, TocItem[]>;
    setBookTocsById: React.Dispatch<React.SetStateAction<Record<string, TocItem[]>>>;
};

const AppContextValue = createContext<AppContextValueType | undefined>(undefined);

// ✅ If you use Vite, env is available here too
const base_url = import.meta.env.VITE_BASE_URL;

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [books, setBooks] = useState<any[]>([]);
    const [complitionBooks, setComplitionBooks] = useState<any[]>([]);

    const [loadingBooks, setLoadingBooks] = useState(false);
    const [booksError, setBooksError] = useState<string | null>(null);

    const [bookTocsById, setBookTocsById] = useState<Record<string, TocItem[]>>({});

    const setBooksMeta = (data: any) => {
        setBooks(data?.all || []);
        setComplitionBooks(data?.complition || []);
    };

    const fetchBooks = async (opts?: { force?: boolean }) => {
        const force = opts?.force ?? false;

        // ✅ Skip if already have data
        if (!force && (books?.length || complitionBooks?.length)) return;

        setLoadingBooks(true);
        setBooksError(null);

        try {
            const [allRes, compRes] = await Promise.all([
                fetch(`${base_url}/book?bookLanguage=English`),
                fetch(`${base_url}/ebook?bookLanguage=English`),
            ]);

            if (!allRes.ok) throw new Error(`Books API failed: ${allRes.status}`);
            if (!compRes.ok) throw new Error(`Compilation API failed: ${compRes.status}`);

            const allBooks = await allRes.json();
            const allCompBooks = await compRes.json();

            setBooksMeta({ all: allBooks?.data, complition: allCompBooks?.data });
        } catch (err: any) {
            setBooksError(err?.message ?? String(err));
        } finally {
            setLoadingBooks(false);
        }
    };


    // ✅ Fetch once when app loads (Provider mounts)
    useEffect(() => {
        fetchBooks();
    }, []);

    const value = useMemo<AppContextValueType>(
        () => ({
            books,
            complitionBooks,
            loadingBooks,
            booksError,
            fetchBooks,
            setBooksMeta,
            bookTocsById,
            setBookTocsById,
        }),
        [books, complitionBooks, loadingBooks, booksError, bookTocsById]
    );

    return <AppContextValue.Provider value={value}>{children}</AppContextValue.Provider>;
}

export function useAppContext() {
    const ctx = useContext(AppContextValue);
    if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
    return ctx;
}
