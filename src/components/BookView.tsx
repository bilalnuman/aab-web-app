

// // import { useEffect, useState } from "react";
// // import { ReactReader } from "react-reader";
// // import JSZip from "jszip";


// // const EPUB_URL =
// //   "https://aab-book-stag.s3.eu-west-2.amazonaws.com/694950a34edc542cd0f83a45/ExternalizationoftheHiearchy_APP.epub";

// // function fixNcx(ncxXml: string) {
// //   const parser = new DOMParser();
// //   const doc = parser.parseFromString(ncxXml, "application/xml");

// //   // remove navPoints that don't have <content src="...">
// //   const navPoints = [
// //     ...Array.from(doc.getElementsByTagName("navPoint")),
// //     ...Array.from(doc.getElementsByTagNameNS("*", "navPoint")),
// //   ];

// //   for (const np of navPoints) {
// //     const contentEl =
// //       np.getElementsByTagName("content")[0] ||
// //       np.getElementsByTagNameNS("*", "content")[0];

// //     const src = contentEl?.getAttribute("src");
// //     if (!contentEl || !src) {
// //       np.parentNode?.removeChild(np);
// //     }
// //   }

// //   return new XMLSerializer().serializeToString(doc);
// // }

// // export default function EpubReader() {
// //   const [location, setLocation] = useState<string | number>(0);
// //   const [bookUrl, setBookUrl] = useState<string | null>(null);
// //   const [err, setErr] = useState<string | null>(null);

// //   useEffect(() => {
// //     let objectUrl: string | null = null;
// //     let cancelled = false;

// //     (async () => {
// //       try {
// //         setErr(null);
// //         setBookUrl(null);

// //         // Fetch with a bit of sanity checking
// //         const res = await fetch(EPUB_URL, { cache: "no-store" });
// //         if (!res.ok) throw new Error(`EPUB fetch failed: ${res.status}`);
// //         const buf = await res.arrayBuffer();

// //         const zip = await JSZip.loadAsync(buf);

// //         // Find .ncx (EPUB2 TOC)
// //         const ncxPath = Object.keys(zip.files).find((p) =>
// //           p.toLowerCase().endsWith(".ncx")
// //         );

// //         if (ncxPath) {
// //           const ncxText = await zip.file(ncxPath)!.async("text");
// //           const fixed = fixNcx(ncxText);
// //           zip.file(ncxPath, fixed);
// //         }

// //         const patchedBlob = await zip.generateAsync({ type: "blob" });
// //         objectUrl = URL.createObjectURL(patchedBlob);

// //         if (!cancelled) setBookUrl(objectUrl);
// //       } catch (e: any) {
// //         if (!cancelled) setErr(e?.message ?? String(e));
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //       if (objectUrl) URL.revokeObjectURL(objectUrl);
// //     };
// //   }, []);

// //   if (err) return <div style={{ padding: 16 }}>Failed: {err}</div>;
// //   if (!bookUrl) return <div style={{ padding: 16 }}>Loading…</div>;

// //   return (
// //     <div style={{ height: "100vh" }}>
// //       <ReactReader
// //         url={bookUrl}
// //         location={location}
// //         locationChanged={(epubcfi: string) => setLocation(epubcfi)}
// //         epubInitOptions={{ openAs: "epub" }} // useful if server mime is weird :contentReference[oaicite:2]{index=2}
// //       />
// //     </div>
// //   );
// // }









// // import React, { useEffect, useState } from "react";
// // import { ReactReader, ReactReaderStyle } from "react-reader";
// // import JSZip from "jszip";
// // import { Spinner } from "./Spinner";
// // import { twMerge } from "tailwind-merge"

// // const EPUB_URL =
// //     "https://aab-book-stag.s3.eu-west-2.amazonaws.com/694950a34edc542cd0f83a45/ExternalizationoftheHiearchy_APP.epub";

// // type ThemeMode = "light" | "dark";

// // const readerStyles = {
// //     ...ReactReaderStyle, // if you import it; otherwise omit
// //     tocArea: { display: "none" },
// //     arrow: { display: "none" },
// //     tocButton: { display: "none" },
// // };

// // function fixNcx(ncxXml: string) {
// //     const parser = new DOMParser();
// //     const doc = parser.parseFromString(ncxXml, "application/xml");

// //     const navPoints = [
// //         ...Array.from(doc.getElementsByTagName("navPoint")),
// //         ...Array.from(doc.getElementsByTagNameNS("*", "navPoint")),
// //     ];

// //     for (const np of navPoints) {
// //         const contentEl =
// //             np.getElementsByTagName("content")[0] ||
// //             np.getElementsByTagNameNS("*", "content")[0];

// //         const src = contentEl?.getAttribute("src");
// //         if (!contentEl || !src) {
// //             np.parentNode?.removeChild(np);
// //         }
// //     }

// //     return new XMLSerializer().serializeToString(doc);
// // }

// // export default function App() {
// //     const [location, setLocation] = useState<string | number>(0);
// //     const [rendition, setRendition] = useState<any>(null);
// //     const [toc, setToc] = useState<any[]>([]);
// //     const [sidebarOpen, setSidebarOpen] = useState(false);
// //     const [fontPct, setFontPct] = useState(110);
// //     const [theme, setTheme] = useState<ThemeMode>("light");
// //     const [bookUrl, setBookUrl] = useState<string | null>(null);
// //     const [err, setErr] = useState<string | null>(null);
// //     const [activeSection, setActiveSection] = useState<string>("");


// //     // ✅ keep the patching step
// //     useEffect(() => {
// //         let objectUrl: string | null = null;
// //         let cancelled = false;

// //         (async () => {
// //             try {
// //                 setErr(null);
// //                 setBookUrl(null);

// //                 const res = await fetch(EPUB_URL, { cache: "no-store" });
// //                 if (!res.ok) throw new Error(`EPUB fetch failed: ${res.status}`);
// //                 const buf = await res.arrayBuffer();

// //                 const zip = await JSZip.loadAsync(buf);

// //                 const ncxPath = Object.keys(zip.files).find((p) =>
// //                     p.toLowerCase().endsWith(".ncx")
// //                 );

// //                 if (ncxPath) {
// //                     const ncxText = await zip.file(ncxPath)!.async("text");
// //                     zip.file(ncxPath, fixNcx(ncxText));
// //                 }

// //                 const patchedBlob = await zip.generateAsync({ type: "blob" });
// //                 objectUrl = URL.createObjectURL(patchedBlob);

// //                 if (!cancelled) setBookUrl(objectUrl);
// //             } catch (e: any) {
// //                 if (!cancelled) setErr(e?.message ?? String(e));
// //             }
// //         })();

// //         return () => {
// //             cancelled = true;
// //             if (objectUrl) URL.revokeObjectURL(objectUrl);
// //         };
// //     }, []);

// //     const applyFont = (pct: number) => {
// //         setFontPct(pct);
// //         rendition?.themes?.fontSize(`${pct}%`);
// //     };

// //     const applyTheme = (mode: ThemeMode) => {
// //         setTheme(mode);
// //         if (!rendition?.themes) return;

// //         rendition.themes.register("light", {
// //             body: { background: "#ffffff", color: "#0f172a" },
// //             a: { color: "#2563eb" },
// //         });
// //         rendition.themes.register("dark", {
// //             body: { background: "#0b1220", color: "#e5e7eb" },
// //             a: { color: "#93c5fd" },
// //         });

// //         rendition.themes.select(mode);
// //     };

// //     const onRendition = (r: any) => {
// //         setRendition(r);
// //         r.themes.fontSize(`${fontPct}%`);
// //         setTimeout(() => applyTheme(theme), 0);
// //         r.themes.default({ body: { padding: "16px" } });
// //     };

// //     if (err) return <div className="p-4">Failed: {err}</div>;
// //     if (!bookUrl) return <div className="h-screen w-screen flex items-center justify-center"><Spinner variant="spinner" size="lg" /></div>;

// //     return (
// //         <div className="h-screen w-screen flex flex-col bg-slate-50">
// //             <header className="flex items-center gap-2 px-3 py-2 border-b bg-white">
// //                 <button
// //                     onClick={() => setSidebarOpen((v) => !v)}
// //                     className="px-3 py-2 rounded-lg border hover:bg-slate-50 active:scale-[0.99] cursor-pointer"
// //                 >
// //                     ☰
// //                 </button>

// //                 <div className="font-semibold text-slate-900 truncate">EPUB Reader</div>

// //                 <div className="ml-auto flex items-center gap-2">
// //                     <button
// //                         onClick={() => {console.log(rendition,"bilal") ;rendition?.prev?.()}}
// //                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                     >
// //                         Prev
// //                     </button>
// //                     <button
// //                         onClick={() => {console.log(rendition,"bilal") ;rendition?.next?.()}}
// //                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                     >
// //                         Next
// //                     </button>

// //                     <div className="hidden sm:flex items-center gap-2 ml-2">
// //                         <button
// //                             onClick={() => applyFont(Math.max(80, fontPct - 10))}
// //                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                         >
// //                             A-
// //                         </button>
// //                         <button
// //                             onClick={() => applyFont(Math.min(180, fontPct + 10))}
// //                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                         >
// //                             A+
// //                         </button>

// //                         <button
// //                             onClick={() => applyTheme("light")}
// //                             className={`px-3 py-2 rounded-lg border hover:bg-slate-50 ${theme === "light" ? "bg-slate-100" : ""
// //                                 }`}
// //                         >
// //                             Light
// //                         </button>
// //                         <button
// //                             onClick={() => applyTheme("dark")}
// //                             className={`px-3 py-2 rounded-lg border hover:bg-slate-50 ${theme === "dark" ? "bg-slate-100" : ""
// //                                 }`}
// //                         >
// //                             Dark
// //                         </button>
// //                     </div>
// //                 </div>
// //             </header>

// //             <main className="flex-1 min-h-0 flex">
// //                 <aside
// //                     className={`${sidebarOpen ? "w-66" : "w-0"
// //                         } transition-[width] duration-500 overflow-hidden border-r bg-white`}
// //                 >
// //                     <div className="h-full flex flex-col">
// //                         <div className="px-4 py-3 border-b font-semibold text-slate-900">
// //                             Contents
// //                         </div>

// //                         <div className="flex-1 overflow-auto">
// //                             {toc.length === 0 ? (
// //                                 <div className="p-4 text-sm text-slate-500">
// //                                     No TOC found (or still loading).
// //                                 </div>
// //                             ) : (
// //                                 toc.map((item: any) => (
// //                                     <button
// //                                         key={item.id}
// //                                         onClick={() => {
// //                                             setActiveSection(item.label)
// //                                             setLocation(item.href);
// //                                             setSidebarOpen(false);
// //                                         }}
// //                                         className={twMerge("w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800", activeSection=== item.label? "bg-gray-100" : "")}

// //                                     >
// //                                         {item.label}
// //                                     </button>
// //                                 ))
// //                             )}
// //                         </div>
// //                     </div>
// //                 </aside>

// //                 <section className="flex-1 min-w-0 bg-white">
// //                     <ReactReader
// //                         url={bookUrl}                // ✅ use patched blob URL
// //                         location={location}
// //                         locationChanged={(epubcfi: string) => setLocation(epubcfi)}
// //                         tocChanged={(t) => setToc(t)}
// //                         getRendition={onRendition}
// //                         epubInitOptions={{ openAs: "epub" }}
// //                         readerStyles={readerStyles}
// //                         loadingView={<div className="p-6 text-slate-600">Loading EPUB…</div>}
// //                     />
// //                 </section>
// //             </main>
// //         </div>
// //     );
// // }



// //  tocChanged={(t) => setToc(t)}
// // getRendition={onRendition}

// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import { ReactReader, ReactReaderStyle } from "react-reader";
// // import JSZip from "jszip";
// // import { Spinner } from "./Spinner";
// // import { twMerge } from "tailwind-merge";

// // const EPUB_URL =
// //     "https://aab-book-stag.s3.eu-west-2.amazonaws.com/694950a34edc542cd0f83a45/ExternalizationoftheHiearchy_APP.epub";

// // type ThemeMode = "light" | "dark";

// // const readerStyles = {
// //     ...ReactReaderStyle,
// //     tocArea: { display: "none" },
// //     arrow: { display: "none" },
// //     tocButton: { display: "none" },
// // };

// // function fixNcx(ncxXml: string) {
// //     const parser = new DOMParser();
// //     const doc = parser.parseFromString(ncxXml, "application/xml");

// //     const navPoints = [
// //         ...Array.from(doc.getElementsByTagName("navPoint")),
// //         ...Array.from(doc.getElementsByTagNameNS("*", "navPoint")),
// //     ];

// //     for (const np of navPoints) {
// //         const contentEl =
// //             np.getElementsByTagName("content")[0] ||
// //             np.getElementsByTagNameNS("*", "content")[0];

// //         const src = contentEl?.getAttribute("src");
// //         if (!contentEl || !src) np.parentNode?.removeChild(np);
// //     }

// //     return new XMLSerializer().serializeToString(doc);
// // }

// // function flattenToc(items: any[] = [], out: any[] = []) {
// //     for (const it of items) {
// //         out.push(it);
// //         if (it.subitems?.length) flattenToc(it.subitems, out);
// //     }
// //     return out;
// // }

// // function normalizeHref(href?: string) {
// //     if (!href) return "";
// //     const noFrag = href.split("#")[0].split("?")[0];
// //     return decodeURIComponent(noFrag).replace(/^\/+/, "");
// // }

// // function findActiveTocItem(tocItems: any[], currentHref?: string) {
// //     const cur = normalizeHref(currentHref);
// //     if (!cur) return null;

// //     let best: any = null;
// //     for (const it of tocItems) {
// //         const t = normalizeHref(it.href);
// //         if (!t) continue;

// //         if (cur === t) return it;
// //         if (cur.endsWith(t)) best = it;
// //     }
// //     return best;
// // }

// // // Escape for regex building
// // function escapeRegExp(s: string) {
// //     return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// // }

// // export default function EpubReader() {
// //     const [location, setLocation] = useState<string | number>(0);
// //     const [rendition, setRendition] = useState<any>(null);

// //     const [toc, setToc] = useState<any[]>([]);
// //     const tocFlat = useMemo(() => flattenToc(toc), [toc]);

// //     const [sidebarOpen, setSidebarOpen] = useState(false);
// //     const [fontPct, setFontPct] = useState(110);
// //     const [theme, setTheme] = useState<ThemeMode>("light");

// //     const [bookUrl, setBookUrl] = useState<string | null>(null);
// //     const [err, setErr] = useState<string | null>(null);

// //     const [activeSection, setActiveSection] = useState<string>("");

// //     // Search state
// //     const [searchQuery, setSearchQuery] = useState("");
// //     const [searching, setSearching] = useState(false);

// //     // Keep last search so we can re-highlight after navigation/next/prev
// //     const lastSearchRef = useRef<string>("");

// //     // Keep track of current rendered href without calling rendition.currentLocation()
// //     const currentHrefRef = useRef<string>("");

// //     // Event binding refs (compatible across epub.js builds)
// //     const boundRenditionRef = useRef<any>(null);
// //     const relocatedHandlerRef = useRef<((loc: any) => void) | null>(null);
// //     const renderedHandlerRef = useRef<((section: any) => void) | null>(null);

// //     // ✅ patch and load epub into Blob URL
// //     useEffect(() => {
// //         let objectUrl: string | null = null;
// //         let cancelled = false;

// //         (async () => {
// //             try {
// //                 setErr(null);
// //                 setBookUrl(null);

// //                 const res = await fetch(EPUB_URL, { cache: "no-store" });
// //                 if (!res.ok) throw new Error(`EPUB fetch failed: ${res.status}`);
// //                 const buf = await res.arrayBuffer();

// //                 const zip = await JSZip.loadAsync(buf);

// //                 const ncxPath = Object.keys(zip.files).find((p) =>
// //                     p.toLowerCase().endsWith(".ncx")
// //                 );

// //                 if (ncxPath) {
// //                     const ncxText = await zip.file(ncxPath)!.async("text");
// //                     zip.file(ncxPath, fixNcx(ncxText));
// //                 }

// //                 const patchedBlob = await zip.generateAsync({ type: "blob" });
// //                 objectUrl = URL.createObjectURL(patchedBlob);

// //                 if (!cancelled) setBookUrl(objectUrl);
// //             } catch (e: any) {
// //                 if (!cancelled) setErr(e?.message ?? String(e));
// //             }
// //         })();

// //         return () => {
// //             cancelled = true;
// //             if (objectUrl) URL.revokeObjectURL(objectUrl);
// //         };
// //     }, []);

// //     const syncActiveFromHref = (href?: string) => {
// //         if (!href) return;
// //         const active = findActiveTocItem(tocFlat, href);
// //         if (active?.label) setActiveSection(active.label);
// //     };

// //     const applyFont = (pct: number) => {
// //         setFontPct(pct);
// //         rendition?.themes?.fontSize?.(`${pct}%`);
// //     };

// //     const applyTheme = (mode: ThemeMode) => {
// //         setTheme(mode);
// //         if (!rendition?.themes) return;

// //         rendition.themes.register?.("light", {
// //             body: { background: "#ffffff", color: "#0f172a" },
// //             a: { color: "#2563eb" },
// //             // highlight style
// //             "mark.__search_hit": {
// //                 background: "#ffe066",
// //                 padding: "0 2px",
// //                 borderRadius: "2px",
// //             },
// //         });
// //         rendition.themes.register?.("dark", {
// //             body: { background: "#0b1220", color: "#e5e7eb" },
// //             a: { color: "#93c5fd" },
// //             "mark.__search_hit": {
// //                 background: "#ffe066",
// //                 color: "#111827",
// //                 padding: "0 2px",
// //                 borderRadius: "2px",
// //             },
// //         });

// //         rendition.themes.select?.(mode);
// //     };

// //     const bindListener = (obj: any, evt: string, fn: any) => {
// //         if (!obj) return;
// //         if (typeof obj.on === "function") obj.on(evt, fn);
// //         else if (typeof obj.addListener === "function") obj.addListener(evt, fn);
// //     };

// //     const unbindListener = (obj: any, evt: string, fn: any) => {
// //         if (!obj || !fn) return;
// //         if (typeof obj.off === "function") obj.off(evt, fn);
// //         else if (typeof obj.removeListener === "function")
// //             obj.removeListener(evt, fn);
// //         else if (typeof obj.un === "function") obj.un(evt, fn);
// //     };

// //     // ---- Highlight helpers (ALL matches in current visible document) ----

// //     const getActiveDoc = () => {
// //         const r = rendition;
// //         if (!r) return null;

// //         const view =
// //             r.manager?.views?._views?.[0] ||
// //             r.manager?.views?.views?.[0] ||
// //             r.manager?.views?.[0];

// //         const doc =
// //             view?.document ||
// //             view?.iframe?.contentDocument ||
// //             view?.window?.document ||
// //             null;

// //         return doc;
// //     };

// //     const clearAllMarks = (doc: Document) => {
// //         // unwrap mark tags
// //         const marks = Array.from(doc.querySelectorAll("mark.__search_hit"));
// //         for (const m of marks) {
// //             const parent = m.parentNode;
// //             if (!parent) continue;
// //             parent.replaceChild(doc.createTextNode(m.textContent || ""), m);
// //             parent.normalize?.();
// //         }
// //     };

// //     const highlightAllMatchesInDoc = (doc: Document, needle: string) => {
// //         const q = needle.trim();
// //         if (!q) return { count: 0, first: null as HTMLElement | null };

// //         clearAllMarks(doc);

// //         const re = new RegExp(escapeRegExp(q), "gi");

// //         const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
// //         let firstMark: HTMLElement | null = null;
// //         let count = 0;

// //         // Collect text nodes first (because replacing nodes while walking can break walker)
// //         const nodes: Text[] = [];
// //         let n: Text | null;
// //         while ((n = walker.nextNode() as Text | null)) nodes.push(n);

// //         for (const node of nodes) {
// //             const text = node.nodeValue || "";
// //             if (!text) continue;
// //             if (!re.test(text)) continue;
// //             re.lastIndex = 0;

// //             const frag = doc.createDocumentFragment();
// //             let last = 0;
// //             let m: RegExpExecArray | null;

// //             while ((m = re.exec(text))) {
// //                 const start = m.index;
// //                 const end = start + m[0].length;

// //                 if (start > last) frag.appendChild(doc.createTextNode(text.slice(last, start)));

// //                 const mark = doc.createElement("mark");
// //                 mark.className = "__search_hit";
// //                 mark.textContent = text.slice(start, end);
// //                 frag.appendChild(mark);

// //                 if (!firstMark) firstMark = mark;
// //                 count++;

// //                 last = end;
// //             }

// //             if (last < text.length) frag.appendChild(doc.createTextNode(text.slice(last)));

// //             node.parentNode?.replaceChild(frag, node);
// //         }

// //         return { count, first: firstMark };
// //     };

// //     const highlightAllMatchesInCurrentView = (needle: string) => {
// //         const doc = getActiveDoc();
// //         if (!doc?.body) return { count: 0 };

// //         const res = highlightAllMatchesInDoc(doc, needle);

// //         // Scroll to first match
// //         if (res.first) {
// //             res.first.scrollIntoView({ block: "center" });
// //         }

// //         return { count: res.count };
// //     };

// //     const clearHighlightsInCurrentView = () => {
// //         const doc = getActiveDoc();
// //         if (!doc?.body) return;
// //         clearAllMarks(doc);
// //     };

// //     // ---- End highlight helpers ----

// //     const onRendition = (r: any) => {
// //         setRendition(r);

// //         // Guarded theme calls
// //         r?.themes?.fontSize?.(`${fontPct}%`);
// //         r?.themes?.default?.({ body: { padding: "16px" } });

// //         // apply theme after rendition exists
// //         setTimeout(() => applyTheme(theme), 0);

// //         // Bind events only once per rendition instance
// //         if (boundRenditionRef.current !== r) {
// //             const prev = boundRenditionRef.current;

// //             if (prev) {
// //                 unbindListener(prev, "relocated", relocatedHandlerRef.current);
// //                 unbindListener(prev, "rendered", renderedHandlerRef.current);
// //             }

// //             boundRenditionRef.current = r;

// //             const relocatedHandler = (loc: any) => {
// //                 const href = loc?.start?.href;
// //                 if (href) {
// //                     currentHrefRef.current = href;
// //                     syncActiveFromHref(href);

// //                     // If user already searched, re-highlight on navigation
// //                     if (lastSearchRef.current) {
// //                         setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 200);
// //                     }
// //                 }
// //             };

// //             const renderedHandler = (section: any) => {
// //                 const href = section?.href;
// //                 if (href) {
// //                     currentHrefRef.current = href;
// //                     syncActiveFromHref(href);

// //                     // Re-highlight when a section is rendered
// //                     if (lastSearchRef.current) {
// //                         setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 50);
// //                     }
// //                 }
// //             };

// //             relocatedHandlerRef.current = relocatedHandler;
// //             renderedHandlerRef.current = renderedHandler;

// //             bindListener(r, "relocated", relocatedHandler);
// //             bindListener(r, "rendered", renderedHandler);
// //         }
// //     };

// //     const handleTocChanged = (t: any[]) => {
// //         setToc(t);
// //         setTimeout(() => {
// //             if (currentHrefRef.current) syncActiveFromHref(currentHrefRef.current);
// //         }, 0);
// //     };

// //     // Find first chapter that contains query, return {href, cfi?}
// //     async function findFirstHit(q: string) {
// //         const query = q.trim().toLowerCase();
// //         if (!query) return null;

// //         const book = rendition?.book;
// //         const spineItems = book?.spine?.spineItems;
// //         if (!book || !Array.isArray(spineItems)) return null;

// //         const CFI = (book as any).epubcfi;

// //         for (const item of spineItems) {
// //             const href = item?.href;
// //             if (!href) continue;

// //             try {
// //                 const markup = await book.load(href);

// //                 let doc: Document | null = null;
// //                 let text = "";

// //                 if (typeof markup === "string") {
// //                     doc = new DOMParser().parseFromString(markup, "text/html");
// //                     text = (doc.body?.textContent || "").replace(/\s+/g, " ");
// //                 } else {
// //                     doc = markup as Document;
// //                     text = (doc?.body?.textContent || "").replace(/\s+/g, " ");
// //                 }

// //                 if (!doc || !text) continue;

// //                 if (!text.toLowerCase().includes(query)) continue;

// //                 // Optional: create a CFI near first match
// //                 let cfi: string | undefined = undefined;
// //                 if (CFI?.fromNode && doc.body) {
// //                     const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
// //                     let node: Text | null = walker.nextNode() as Text | null;
// //                     while (node) {
// //                         const nodeText = (node.nodeValue || "").toLowerCase();
// //                         const pos = nodeText.indexOf(query);
// //                         if (pos !== -1) {
// //                             cfi = CFI.fromNode(node, pos);
// //                             break;
// //                         }
// //                         node = walker.nextNode() as Text | null;
// //                     }
// //                 }

// //                 return { href, cfi };
// //             } catch (e) {
// //                 console.error("Search load failed for:", href, e);
// //             }
// //         }

// //         return null;
// //     }

// //     if (err) return <div className="p-4">Failed: {err}</div>;
// //     if (!bookUrl)
// //         return (
// //             <div className="h-screen w-screen flex items-center justify-center">
// //                 <Spinner variant="spinner" size="lg" />
// //             </div>
// //         );

// //     return (
// //         <div className="h-screen w-screen flex flex-col bg-slate-50">
// //             <header className="flex items-center gap-2 px-3 py-2 border-b bg-white">
// //                 <button
// //                     onClick={() => setSidebarOpen((v) => !v)}
// //                     className="px-3 py-2 rounded-lg border hover:bg-slate-50 active:scale-[0.99] cursor-pointer"
// //                 >
// //                     ☰
// //                 </button>

// //                 <div className="font-semibold text-slate-900 truncate">
// //                     EPUB Reader
// //                     {activeSection ? (
// //                         <span className="ml-2 text-sm font-normal text-slate-500">
// //                             • {activeSection}
// //                         </span>
// //                     ) : null}
// //                 </div>

// //                 <div className="ml-auto flex items-center gap-2">
// //                     <button
// //                         onClick={() => {
// //                             clearHighlightsInCurrentView();
// //                             rendition?.prev?.();
// //                         }}
// //                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                     >
// //                         Prev
// //                     </button>
// //                     <button
// //                         onClick={() => {
// //                             clearHighlightsInCurrentView();
// //                             rendition?.next?.();
// //                         }}
// //                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                     >
// //                         Next
// //                     </button>

// //                     {/* Search */}
// //                     <div className="hidden md:flex items-center gap-2 ml-2">
// //                         <input
// //                             value={searchQuery}
// //                             onChange={(e) => setSearchQuery(e.target.value)}
// //                             placeholder="Search in book…"
// //                             className="px-3 py-2 border rounded-lg w-64"
// //                         />

// //                         <button
// //                             onClick={async () => {
// //                                 if (!rendition) return;
// //                                 const q = searchQuery.trim();
// //                                 if (!q) return;

// //                                 setSearching(true);
// //                                 try {
// //                                     lastSearchRef.current = q;

// //                                     // find first hit chapter, jump to it
// //                                     const hit = await findFirstHit(q);

// //                                     if (hit) {
// //                                         if (hit.cfi) setLocation(hit.cfi);
// //                                         else setLocation(hit.href);

// //                                         // after render, highlight all matches in that chapter
// //                                         setTimeout(() => {
// //                                             highlightAllMatchesInCurrentView(q);
// //                                         }, 350);
// //                                     } else {
// //                                         // no match found: clear highlights
// //                                         clearHighlightsInCurrentView();
// //                                     }
// //                                 } finally {
// //                                     setSearching(false);
// //                                 }
// //                             }}
// //                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                         >
// //                             {searching ? "Searching…" : "Search"}
// //                         </button>

// //                         <button
// //                             onClick={() => {
// //                                 lastSearchRef.current = "";
// //                                 clearHighlightsInCurrentView();
// //                             }}
// //                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                         >
// //                             Clear
// //                         </button>
// //                     </div>

// //                     <div className="hidden sm:flex items-center gap-2 ml-2">
// //                         <button
// //                             onClick={() => applyFont(Math.max(80, fontPct - 10))}
// //                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                         >
// //                             A-
// //                         </button>
// //                         <button
// //                             onClick={() => applyFont(Math.min(180, fontPct + 10))}
// //                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
// //                         >
// //                             A+
// //                         </button>

// //                         <button
// //                             onClick={() => applyTheme("light")}
// //                             className={twMerge(
// //                                 "px-3 py-2 rounded-lg border hover:bg-slate-50",
// //                                 theme === "light" ? "bg-slate-100" : ""
// //                             )}
// //                         >
// //                             Light
// //                         </button>
// //                         <button
// //                             onClick={() => applyTheme("dark")}
// //                             className={twMerge(
// //                                 "px-3 py-2 rounded-lg border hover:bg-slate-50",
// //                                 theme === "dark" ? "bg-slate-100" : ""
// //                             )}
// //                         >
// //                             Dark
// //                         </button>
// //                     </div>
// //                 </div>
// //             </header>

// //             <main className="flex-1 min-h-0 flex">
// //                 <aside
// //                     className={`${sidebarOpen ? "w-80" : "w-0"
// //                         } transition-[width] duration-500 overflow-hidden border-r bg-white`}
// //                 >
// //                     <div className="h-full flex flex-col">
// //                         <div className="flex-1 overflow-auto">
// //                             {toc.map((item: any) => (
// //                                 <button
// //                                     key={item.id}
// //                                     onClick={() => {
// //                                         lastSearchRef.current = "";
// //                                         clearHighlightsInCurrentView();
// //                                         setLocation(item.href);
// //                                         setSidebarOpen(false);
// //                                     }}
// //                                     className={twMerge(
// //                                         "w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800",
// //                                         activeSection === item.label ? "bg-gray-100" : ""
// //                                     )}
// //                                 >
// //                                     {item.label}
// //                                 </button>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </aside>

// //                 <section className="flex-1 min-w-0 bg-white">
// //                     <ReactReader
// //                         url={bookUrl}
// //                         location={location}
// //                         locationChanged={(epubcfi: string) => setLocation(epubcfi)}
// //                         tocChanged={handleTocChanged}
// //                         getRendition={onRendition}
// //                         epubInitOptions={{ openAs: "epub" }}
// //                         readerStyles={readerStyles}
// //                         loadingView={<div className="p-6 text-slate-600">Loading EPUB…</div>}
// //                     />
// //                 </section>
// //             </main>
// //         </div>
// //     );
// // }
















// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { ReactReader, ReactReaderStyle } from "react-reader";
// import JSZip from "jszip";
// import { Spinner } from "./Spinner";
// import { twMerge } from "tailwind-merge";
// import { useLocation, useSearchParams } from "react-router-dom";

// const EPUB_URL =
//     "https://aab-book-stag.s3.eu-west-2.amazonaws.com/694943f14edc542cd0f837a3/ConsciousnessOfTheAtom_APP.epub";

// type ThemeMode = "light" | "dark";

// const readerStyles = {
//     ...ReactReaderStyle,
//     tocArea: { display: "none" },
//     arrow: { display: "none" },
//     tocButton: { display: "none" },
//     readerArea: { ...ReactReaderStyle.readerArea, overflow: "auto" },
//     container: { ...ReactReaderStyle.container, overflow: "hidden" },
// };

// function fixNcx(ncxXml: string) {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(ncxXml, "application/xml");

//     const navPoints = [
//         ...Array.from(doc.getElementsByTagName("navPoint")),
//         ...Array.from(doc.getElementsByTagNameNS("*", "navPoint")),
//     ];

//     for (const np of navPoints) {
//         const contentEl =
//             np.getElementsByTagName("content")[0] ||
//             np.getElementsByTagNameNS("*", "content")[0];

//         const src = contentEl?.getAttribute("src");
//         if (!contentEl || !src) np.parentNode?.removeChild(np);
//     }

//     return new XMLSerializer().serializeToString(doc);
// }

// function flattenToc(items: any[] = [], out: any[] = []) {
//     for (const it of items) {
//         out.push(it);
//         if (it.subitems?.length) flattenToc(it.subitems, out);
//     }
//     return out;
// }

// function normalizeHref(href?: string) {
//     if (!href) return "";
//     const noFrag = href.split("#")[0].split("?")[0];
//     return decodeURIComponent(noFrag).replace(/^\/+/, "");
// }

// function findActiveTocItem(tocItems: any[], currentHref?: string) {
//     const cur = normalizeHref(currentHref);
//     if (!cur) return null;

//     let best: any = null;
//     for (const it of tocItems) {
//         const t = normalizeHref(it.href);
//         if (!t) continue;

//         if (cur === t) return it;
//         if (cur.endsWith(t)) best = it;
//     }
//     return best;
// }

// function escapeRegExp(s: string) {
//     return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

// export default function BookView() {
//     const [location, setLocation] = useState<string | number>(0);
//     const [rendition, setRendition] = useState<any>(null);

//     const [toc, setToc] = useState<any[]>([]);
//     const tocFlat = useMemo(() => flattenToc(toc), [toc]);

//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [fontPct, setFontPct] = useState(110);
//     const [theme, setTheme] = useState<ThemeMode>("light");

//     const [bookUrl, setBookUrl] = useState<string | null>(null);
//     const [err, setErr] = useState<string | null>(null);

//     const [activeSection, setActiveSection] = useState<string>("");

//     // Search state
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searching, setSearching] = useState(false);
//     const lastSearchRef = useRef<string>(""); // re-highlight on navigation

//     // Track current href (avoid rendition.currentLocation)
//     const currentHrefRef = useRef<string>("");

//     // Event binding refs
//     const boundRenditionRef = useRef<any>(null);
//     const relocatedHandlerRef = useRef<((loc: any) => void) | null>(null);
//     const renderedHandlerRef = useRef<((section: any) => void) | null>(null);
//     const [searchParams] = useSearchParams();
//     const url = searchParams.get("url");
//     // ✅ patch and load epub into Blob URL
//     useEffect(() => {
//         let objectUrl: string | null = null;
//         let cancelled = false;

//         (async () => {
//             try {
//                 setErr(null);
//                 setBookUrl(null);

//                 const res = await fetch(url, { cache: "no-store" });
//                 if (!res.ok) throw new Error(`EPUB fetch failed: ${res.status}`);
//                 const buf = await res.arrayBuffer();

//                 const zip = await JSZip.loadAsync(buf);

//                 const ncxPath = Object.keys(zip.files).find((p) =>
//                     p.toLowerCase().endsWith(".ncx")
//                 );

//                 if (ncxPath) {
//                     const ncxText = await zip.file(ncxPath)!.async("text");
//                     zip.file(ncxPath, fixNcx(ncxText));
//                 }

//                 const patchedBlob = await zip.generateAsync({ type: "blob" });
//                 objectUrl = URL.createObjectURL(patchedBlob);

//                 if (!cancelled) setBookUrl(objectUrl);
//             } catch (e: any) {
//                 if (!cancelled) setErr(e?.message ?? String(e));
//             }
//         })();

//         return () => {
//             cancelled = true;
//             if (objectUrl) URL.revokeObjectURL(objectUrl);
//         };
//     }, [url]);

//     const syncActiveFromHref = (href?: string) => {
//         if (!href) return;
//         const active = findActiveTocItem(tocFlat, href);
//         if (active?.label) setActiveSection(active.label);
//     };

//     const safeResize = (r?: any) => {
//         if (!r?.resize) return;
//         setTimeout(() => r.resize?.(), 60);
//     };

//     const applyFont = (pct: number) => {
//         setFontPct(pct);
//         rendition?.themes?.fontSize?.(`${pct}%`);
//         safeResize(rendition);
//         // re-highlight on font change
//         if (lastSearchRef.current) {
//             setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 120);
//         }
//     };

//     const applyTheme = (mode: ThemeMode) => {
//         setTheme(mode);
//         if (!rendition?.themes) return;

//         rendition.themes.register?.("light", {
//             body: { background: "#ffffff", color: "#0f172a" },
//             a: { color: "#2563eb" },
//             "mark.__search_hit": {
//                 background: "#ffe066",
//                 padding: "0 2px",
//                 borderRadius: "2px",
//             },
//         });
//         rendition.themes.register?.("dark", {
//             body: { background: "#0b1220", color: "#e5e7eb" },
//             a: { color: "#93c5fd" },
//             "mark.__search_hit": {
//                 background: "#ffe066",
//                 color: "#111827",
//                 padding: "0 2px",
//                 borderRadius: "2px",
//             },
//         });

//         rendition.themes.select?.(mode);
//         safeResize(rendition);

//         // re-highlight on theme change
//         if (lastSearchRef.current) {
//             setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 120);
//         }
//     };

//     const bindListener = (obj: any, evt: string, fn: any) => {
//         if (!obj) return;
//         if (typeof obj.on === "function") obj.on(evt, fn);
//         else if (typeof obj.addListener === "function") obj.addListener(evt, fn);
//     };

//     const unbindListener = (obj: any, evt: string, fn: any) => {
//         if (!obj || !fn) return;
//         if (typeof obj.off === "function") obj.off(evt, fn);
//         else if (typeof obj.removeListener === "function")
//             obj.removeListener(evt, fn);
//         else if (typeof obj.un === "function") obj.un(evt, fn);
//     };

//     // ---------- Highlight ALL matches in current visible chapter ----------
//     const getActiveDoc = () => {
//         const r = rendition;
//         if (!r) return null;

//         const view =
//             r.manager?.views?._views?.[0] ||
//             r.manager?.views?.views?.[0] ||
//             r.manager?.views?.[0];

//         const doc =
//             view?.document ||
//             view?.iframe?.contentDocument ||
//             view?.window?.document ||
//             null;

//         return doc as Document | null;
//     };

//     const clearAllMarks = (doc: Document) => {
//         const marks = Array.from(doc.querySelectorAll("mark.__search_hit"));
//         for (const m of marks) {
//             const parent = m.parentNode;
//             if (!parent) continue;
//             parent.replaceChild(doc.createTextNode(m.textContent || ""), m);
//             parent.normalize?.();
//         }
//     };

//     const highlightAllMatchesInDoc = (doc: Document, needle: string) => {
//         const q = needle.trim();
//         if (!q) return { count: 0, first: null as HTMLElement | null };

//         clearAllMarks(doc);

//         const re = new RegExp(escapeRegExp(q), "gi");
//         const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

//         // collect nodes first
//         const nodes: Text[] = [];
//         let n: Text | null;
//         while ((n = walker.nextNode() as Text | null)) nodes.push(n);

//         let firstMark: HTMLElement | null = null;
//         let count = 0;

//         for (const node of nodes) {
//             const text = node.nodeValue || "";
//             if (!text) continue;

//             if (!re.test(text)) continue;
//             re.lastIndex = 0;

//             const frag = doc.createDocumentFragment();
//             let last = 0;
//             let m: RegExpExecArray | null;

//             while ((m = re.exec(text))) {
//                 const start = m.index;
//                 const end = start + m[0].length;

//                 if (start > last) frag.appendChild(doc.createTextNode(text.slice(last, start)));

//                 const mark = doc.createElement("mark");
//                 mark.className = "__search_hit";
//                 mark.textContent = text.slice(start, end);
//                 frag.appendChild(mark);

//                 if (!firstMark) firstMark = mark;
//                 count++;

//                 last = end;
//             }

//             if (last < text.length) frag.appendChild(doc.createTextNode(text.slice(last)));

//             node.parentNode?.replaceChild(frag, node);
//         }

//         return { count, first: firstMark };
//     };

//     const highlightAllMatchesInCurrentView = (needle: string) => {
//         const doc = getActiveDoc();
//         if (!doc?.body) return { count: 0 };

//         const res = highlightAllMatchesInDoc(doc, needle);
//         if (res.first) res.first.scrollIntoView({ block: "center" });
//         return { count: res.count };
//     };

//     const clearHighlightsInCurrentView = () => {
//         const doc = getActiveDoc();
//         if (!doc?.body) return;
//         clearAllMarks(doc);
//     };
//     // --------------------------------------------------------------------

//     const onRendition = (r: any) => {
//         setRendition(r);

//         // ✅ Force vertical scroll (fix hidden/clipped columns)
//         r.flow?.("scrolled-doc"); // or "scrolled"
//         r.spread?.("none");

//         // Theme + font
//         r?.themes?.fontSize?.(`${fontPct}%`);
//         r?.themes?.default?.({ body: { padding: "16px" } });
//         setTimeout(() => applyTheme(theme), 0);

//         // Always resize after first attach
//         safeResize(r);

//         // Bind events once per rendition instance
//         if (boundRenditionRef.current !== r) {
//             const prev = boundRenditionRef.current;

//             if (prev) {
//                 unbindListener(prev, "relocated", relocatedHandlerRef.current);
//                 unbindListener(prev, "rendered", renderedHandlerRef.current);
//             }

//             boundRenditionRef.current = r;

//             const relocatedHandler = (loc: any) => {
//                 const href = loc?.start?.href;
//                 if (href) {
//                     currentHrefRef.current = href;
//                     syncActiveFromHref(href);

//                     // If searched, re-highlight after navigation
//                     if (lastSearchRef.current) {
//                         setTimeout(
//                             () => highlightAllMatchesInCurrentView(lastSearchRef.current),
//                             200
//                         );
//                     }
//                 }
//             };

//             const renderedHandler = (section: any) => {
//                 const href = section?.href;
//                 if (href) {
//                     currentHrefRef.current = href;
//                     syncActiveFromHref(href);

//                     if (lastSearchRef.current) {
//                         setTimeout(
//                             () => highlightAllMatchesInCurrentView(lastSearchRef.current),
//                             60
//                         );
//                     }
//                 }
//             };

//             relocatedHandlerRef.current = relocatedHandler;
//             renderedHandlerRef.current = renderedHandler;

//             bindListener(r, "relocated", relocatedHandler);
//             bindListener(r, "rendered", renderedHandler);
//         }
//     };

//     // Resize on sidebar open/close (container width changes)
//     useEffect(() => {
//         if (!rendition) return;
//         safeResize(rendition);
//     }, [sidebarOpen, rendition]);

//     // Resize on window resize
//     useEffect(() => {
//         if (!rendition) return;
//         const handler = () => safeResize(rendition);
//         window.addEventListener("resize", handler);
//         return () => window.removeEventListener("resize", handler);
//     }, [rendition]);

//     const handleTocChanged = (t: any[]) => {
//         setToc(t);
//         setTimeout(() => {
//             if (currentHrefRef.current) syncActiveFromHref(currentHrefRef.current);
//         }, 0);
//     };

//     // Find first chapter that contains query, return {href, cfi?}
//     async function findFirstHit(q: string) {
//         const query = q.trim().toLowerCase();
//         if (!query) return null;

//         const book = rendition?.book;
//         const spineItems = book?.spine?.spineItems;
//         if (!book || !Array.isArray(spineItems)) return null;

//         const CFI = (book as any).epubcfi;

//         for (const item of spineItems) {
//             const href = item?.href;
//             if (!href) continue;

//             try {
//                 const markup = await book.load(href);

//                 let doc: Document | null = null;
//                 let text = "";

//                 if (typeof markup === "string") {
//                     doc = new DOMParser().parseFromString(markup, "text/html");
//                     text = (doc.body?.textContent || "").replace(/\s+/g, " ");
//                 } else {
//                     doc = markup as Document;
//                     text = (doc?.body?.textContent || "").replace(/\s+/g, " ");
//                 }

//                 if (!doc || !text) continue;
//                 if (!text.toLowerCase().includes(query)) continue;

//                 // optional CFI near first match
//                 let cfi: string | undefined = undefined;
//                 if (CFI?.fromNode && doc.body) {
//                     const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
//                     let node: Text | null = walker.nextNode() as Text | null;
//                     while (node) {
//                         const nodeText = (node.nodeValue || "").toLowerCase();
//                         const pos = nodeText.indexOf(query);
//                         if (pos !== -1) {
//                             cfi = CFI.fromNode(node, pos);
//                             break;
//                         }
//                         node = walker.nextNode() as Text | null;
//                     }
//                 }

//                 return { href, cfi };
//             } catch (e) {
//                 console.error("Search load failed for:", href, e);
//             }
//         }

//         return null;
//     }

//     if (err) return <div className="p-4">Failed: {err}</div>;
//     if (!bookUrl)
//         return (
//             <div className="h-screen w-screen flex items-center justify-center">
//                 <Spinner variant="spinner" size="lg" />
//             </div>
//         );

//     return (
//         <div className="h-screen w-screen flex flex-col bg-slate-50">
//             <header className="flex items-center gap-2 px-3 py-2 border-b bg-white">
//                 <button
//                     onClick={() => setSidebarOpen((v) => !v)}
//                     className="px-3 py-2 rounded-lg border hover:bg-slate-50 active:scale-[0.99] cursor-pointer"
//                 >
//                     ☰
//                 </button>

//                 <div className="font-semibold text-slate-900 truncate">
//                     EPUB Reader
//                     {activeSection ? (
//                         <span className="ml-2 text-sm font-normal text-slate-500">
//                             • {activeSection}
//                         </span>
//                     ) : null}
//                 </div>

//                 <div className="ml-auto flex items-center gap-2">
//                     <button
//                         onClick={() => {
//                             rendition?.prev?.();
//                         }}
//                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
//                     >
//                         Prev
//                     </button>
//                     <button
//                         onClick={() => {
//                             rendition?.next?.();
//                         }}
//                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
//                     >
//                         Next
//                     </button>

//                     {/* Search */}
//                     <div className="hidden md:flex items-center gap-2 ml-2">
//                         <input
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Search in book…"
//                             className="px-3 py-2 border rounded-lg w-64"
//                         />

//                         <button
//                             onClick={async () => {
//                                 if (!rendition) return;
//                                 const q = searchQuery.trim();
//                                 if (!q) return;

//                                 setSearching(true);
//                                 try {
//                                     lastSearchRef.current = q;

//                                     const hit = await findFirstHit(q);

//                                     if (hit) {
//                                         // Jump to chapter (or near match)
//                                         if (hit.cfi) setLocation(hit.cfi);
//                                         else setLocation(hit.href);

//                                         // Highlight all matches in that visible chapter
//                                         setTimeout(() => {
//                                             highlightAllMatchesInCurrentView(q);
//                                         }, 350);
//                                     } else {
//                                         clearHighlightsInCurrentView();
//                                     }
//                                 } finally {
//                                     setSearching(false);
//                                 }
//                             }}
//                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
//                         >
//                             {searching ? "Searching…" : "Search"}
//                         </button>

//                         <button
//                             onClick={() => {
//                                 lastSearchRef.current = "";
//                                 clearHighlightsInCurrentView();
//                             }}
//                             className="px-3 py-2 rounded-lg border hover:bg-slate-50"
//                         >
//                             Clear
//                         </button>
//                     </div>

//                     <button
//                         onClick={() => applyFont(Math.max(80, fontPct - 10))}
//                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
//                     >
//                         A-
//                     </button>
//                     <button
//                         onClick={() => applyFont(Math.min(180, fontPct + 10))}
//                         className="px-3 py-2 rounded-lg border hover:bg-slate-50"
//                     >
//                         A+
//                     </button>

//                     <button
//                         onClick={() => applyTheme("light")}
//                         className={twMerge(
//                             "px-3 py-2 rounded-lg border hover:bg-slate-50",
//                             theme === "light" ? "bg-slate-100" : ""
//                         )}
//                     >
//                         Light
//                     </button>
//                     <button
//                         onClick={() => applyTheme("dark")}
//                         className={twMerge(
//                             "px-3 py-2 rounded-lg border hover:bg-slate-50",
//                             theme === "dark" ? "bg-slate-100" : ""
//                         )}
//                     >
//                         Dark
//                     </button>
//                 </div>
//             </header>

//             <main className="flex-1 min-h-0 flex">
//                 <aside
//                     className={`${sidebarOpen ? "w-80" : "w-0"
//                         } transition-[width] duration-500 overflow-hidden border-r bg-white`}
//                 >
//                     <div className="h-full flex flex-col">
//                         <div className="flex-1 overflow-auto">
//                             {toc.map((item: any) => (
//                                 <button
//                                     key={item.id}
//                                     onClick={() => {
//                                         // keep search active if you want: remove the next 2 lines
//                                         lastSearchRef.current = "";
//                                         clearHighlightsInCurrentView();

//                                         setLocation(item.href);
//                                         setSidebarOpen(false);
//                                     }}
//                                     className={twMerge(
//                                         "w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800",
//                                         activeSection === item.label ? "bg-gray-100" : ""
//                                     )}
//                                 >
//                                     {item.label}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </aside>

//                 <section className="flex-1 min-w-0 bg-white">
//                     <ReactReader
//                         url={bookUrl}
//                         location={location}
//                         locationChanged={(epubcfi: string) => setLocation(epubcfi)}
//                         tocChanged={handleTocChanged}
//                         getRendition={onRendition}
//                         epubInitOptions={{
//                             openAs: "epub",
//                             // flow: "scrolled-doc",
//                             // spread: "none",
//                         }}
//                         readerStyles={readerStyles}
//                         loadingView={<div className="p-6 text-slate-600">Loading EPUB…</div>}
//                     />
//                 </section>
//             </main>
//         </div>
//     );
// }







// BookView.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import JSZip from "jszip";
import { useNavigate, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Spinner } from "./Spinner";
import { useAppContext } from "../context";

type ThemeMode = "light" | "dark";

const readerStyles = {
    ...ReactReaderStyle,
    tocArea: { display: "none" },
    arrow: { display: "none" },
    tocButton: { display: "none" },
    readerArea: { ...ReactReaderStyle.readerArea, overflow: "auto" },
    container: { ...ReactReaderStyle.container, overflow: "hidden" },
};

// --- EPUB patch helpers ------------------------------------------------------

function fixNcx(ncxXml: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(ncxXml, "application/xml");

    const navPoints = [
        ...Array.from(doc.getElementsByTagName("navPoint")),
        ...Array.from(doc.getElementsByTagNameNS("*", "navPoint")),
    ];

    // remove navPoints that don't have <content src="...">
    for (const np of navPoints) {
        const contentEl =
            np.getElementsByTagName("content")[0] ||
            np.getElementsByTagNameNS("*", "content")[0];

        const src = contentEl?.getAttribute("src");
        if (!contentEl || !src) np.parentNode?.removeChild(np);
    }

    return new XMLSerializer().serializeToString(doc);
}

function flattenToc(items: any[] = [], out: any[] = []) {
    for (const it of items) {
        out.push(it);
        if (it.subitems?.length) flattenToc(it.subitems, out);
    }
    return out;
}

function normalizeHref(href?: string) {
    if (!href) return "";
    const noFrag = href.split("#")[0].split("?")[0];
    return decodeURIComponent(noFrag).replace(/^\/+/, "");
}

function findActiveTocItem(tocItems: any[], currentHref?: string) {
    const cur = normalizeHref(currentHref);
    if (!cur) return null;

    let best: any = null;
    for (const it of tocItems) {
        const t = normalizeHref(it.href);
        if (!t) continue;

        if (cur === t) return it;
        if (cur.endsWith(t)) best = it;
    }
    return best;
}

function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- Component ---------------------------------------------------------------

export default function BookView() {
    const [searchParams] = useSearchParams();
    const { books } = useAppContext()
    const url = searchParams.get("url"); // already decoded properly by URLSearchParams
    const bookId = searchParams.get("id")


    const [location, setLocation] = useState<string | number>(0);

    const [toc, setToc] = useState<any[]>([]);
    const tocFlat = useMemo(() => flattenToc(toc), [toc]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fontPct, setFontPct] = useState(110);
    const [theme, setTheme] = useState<ThemeMode>("light");

    const [bookUrl, setBookUrl] = useState<string | null>(null); // blob url
    const [err, setErr] = useState<string | null>(null);

    const [activeSection, setActiveSection] = useState<string>("");

    // Search
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const lastSearchRef = useRef<string>("");

    // Track current href (avoid calling rendition.currentLocation)
    const currentHrefRef = useRef<string>("");

    // Rendition refs (avoid timing issues)
    const renditionRef = useRef<any>(null);
    const isReadyRef = useRef(false); // becomes true after first "rendered"

    // Event binding refs (so we can unbind safely)
    const boundRenditionRef = useRef<any>(null);
    const relocatedHandlerRef = useRef<((loc: any) => void) | null>(null);
    const renderedHandlerRef = useRef<((section: any) => void) | null>(null);

    // Resize throttle
    const resizeTimerRef = useRef<number | null>(null);

    // --- Load + patch epub into Blob URL --------------------------------------

    // useEffect(() => {
    //     let objectUrl: string | null = null;
    //     let cancelled = false;

    //     // reset for each new book
    //     setErr(null);
    //     setBookUrl(null);
    //     setLocation(0);
    //     setToc([]);
    //     setActiveSection("");
    //     currentHrefRef.current = "";
    //     lastSearchRef.current = "";
    //     renditionRef.current = null;
    //     isReadyRef.current = false;

    //     if (!url) {
    //         setErr("Missing epub url (query param 'url').");
    //         return () => { };
    //     }

    //     (async () => {
    //         try {
    //             if (!url) throw new Error("Missing url param");
    //             const safeUrl = encodeURI(url); // encodes spaces etc.
    //             const res = await fetch(safeUrl, { cache: "no-store" });

    //             if (!res.ok) throw new Error(`EPUB fetch failed: ${res.status}`);
    //             const buf = await res.arrayBuffer();

    //             const zip = await JSZip.loadAsync(buf);

    //             // Patch .ncx (EPUB2 TOC) if present
    //             const ncxPath = Object.keys(zip.files).find((p) =>
    //                 p.toLowerCase().endsWith(".ncx")
    //             );

    //             if (ncxPath) {
    //                 const ncxText = await zip.file(ncxPath)!.async("text");
    //                 zip.file(ncxPath, fixNcx(ncxText));
    //             }

    //             const patchedBlob = await zip.generateAsync({ type: "blob" });
    //             objectUrl = URL.createObjectURL(patchedBlob);

    //             if (!cancelled) setBookUrl(objectUrl);
    //         } catch (e: any) {
    //             if (!cancelled) setErr(e?.message ?? String(e));
    //         }
    //     })();

    //     return () => {
    //         cancelled = true;
    //         if (objectUrl) URL.revokeObjectURL(objectUrl);
    //     };
    // }, [url]);

    useEffect(() => {
        let objectUrl: string | null = null;
        let cancelled = false;

        (async () => {
            try {
                setErr(null);
                setBookUrl(null);

                if (!url) throw new Error("Missing url query param");

                // Important: make URL safe (spaces etc.)
                const safeUrl = encodeURI(url);

                const res = await fetch(safeUrl, { cache: "no-store" });
                if (!res.ok) throw new Error(`EPUB fetch failed: ${res.status}`);
                const buf = await res.arrayBuffer();

                const zip = await JSZip.loadAsync(buf);

                // ✅ 1) Remove scripts from all chapter HTML/XHTML files
                for (const path of Object.keys(zip.files)) {
                    if (!/\.(xhtml|html)$/i.test(path)) continue;

                    const file = zip.file(path);
                    if (!file) continue;

                    const text = await file.async("text");
                    const cleaned = text.replace(
                        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                        ""
                    );

                    zip.file(path, cleaned);
                }

                // ✅ 2) Patch .ncx (EPUB2 TOC) if present
                const ncxPath = Object.keys(zip.files).find((p) =>
                    p.toLowerCase().endsWith(".ncx")
                );

                if (ncxPath) {
                    const ncxText = await zip.file(ncxPath)!.async("text");
                    zip.file(ncxPath, fixNcx(ncxText));
                }

                // ✅ 3) Create blob URL from patched epub
                const patchedBlob = await zip.generateAsync({ type: "blob" });
                objectUrl = URL.createObjectURL(patchedBlob);

                if (!cancelled) setBookUrl(objectUrl);
            } catch (e: any) {
                if (!cancelled) setErr(e?.message ?? String(e));
            }
        })();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [url]);


    // --- Small helpers ---------------------------------------------------------

    const bindListener = (obj: any, evt: string, fn: any) => {
        if (!obj) return;
        if (typeof obj.on === "function") obj.on(evt, fn);
        else if (typeof obj.addListener === "function") obj.addListener(evt, fn);
    };

    const unbindListener = (obj: any, evt: string, fn: any) => {
        if (!obj || !fn) return;
        if (typeof obj.off === "function") obj.off(evt, fn);
        else if (typeof obj.removeListener === "function") obj.removeListener(evt, fn);
        else if (typeof obj.un === "function") obj.un(evt, fn);
    };

    const syncActiveFromHref = (href?: string) => {
        if (!href) return;
        const active = findActiveTocItem(tocFlat, href);
        if (active?.label) setActiveSection(active.label);
    };

    // ✅ robust resize (prevents: Cannot read properties of undefined (reading 'resize'))
    const safeResize = () => {
        const r = renditionRef.current;

        // only resize after first section rendered
        if (!isReadyRef.current) return;

        // these exist when epub.js is fully mounted; some books are slower
        if (!r?.manager?.stage) return;

        if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);

        resizeTimerRef.current = window.setTimeout(() => {
            try {
                r.resize();
            } catch (e) {
                // swallow races (some EPUBs still have transient states)
                console.warn("resize skipped:", e);
            }
        }, 60);
    };

    useEffect(() => {
        return () => {
            if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
        };
    }, []);

    // --- Highlight ALL matches in current visible chapter ----------------------

    const getActiveDoc = () => {
        const r = renditionRef.current;
        if (!r) return null;

        const view =
            r.manager?.views?._views?.[0] ||
            r.manager?.views?.views?.[0] ||
            r.manager?.views?.[0];

        const doc =
            view?.document ||
            view?.iframe?.contentDocument ||
            view?.window?.document ||
            null;

        return doc as Document | null;
    };

    const clearAllMarks = (doc: Document) => {
        const marks = Array.from(doc.querySelectorAll("mark.__search_hit"));
        for (const m of marks) {
            const parent = m.parentNode;
            if (!parent) continue;
            parent.replaceChild(doc.createTextNode(m.textContent || ""), m);
            parent.normalize?.();
        }
    };

    const highlightAllMatchesInDoc = (doc: Document, needle: string) => {
        const q = needle.trim();
        if (!q) return { count: 0, first: null as HTMLElement | null };

        clearAllMarks(doc);

        const re = new RegExp(escapeRegExp(q), "gi");
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

        const nodes: Text[] = [];
        let n: Text | null;
        while ((n = walker.nextNode() as Text | null)) nodes.push(n);

        let firstMark: HTMLElement | null = null;
        let count = 0;

        for (const node of nodes) {
            const text = node.nodeValue || "";
            if (!text) continue;

            if (!re.test(text)) continue;
            re.lastIndex = 0;

            const frag = doc.createDocumentFragment();
            let last = 0;
            let m: RegExpExecArray | null;

            while ((m = re.exec(text))) {
                const start = m.index;
                const end = start + m[0].length;

                if (start > last) frag.appendChild(doc.createTextNode(text.slice(last, start)));

                const mark = doc.createElement("mark");
                mark.className = "__search_hit";
                mark.textContent = text.slice(start, end);
                frag.appendChild(mark);

                if (!firstMark) firstMark = mark;
                count++;

                last = end;
            }

            if (last < text.length) frag.appendChild(doc.createTextNode(text.slice(last)));

            node.parentNode?.replaceChild(frag, node);
        }

        return { count, first: firstMark };
    };

    const highlightAllMatchesInCurrentView = (needle: string) => {
        const doc = getActiveDoc();
        if (!doc?.body) return { count: 0 };

        const res = highlightAllMatchesInDoc(doc, needle);
        if (res.first) res.first.scrollIntoView({ block: "center" });

        return { count: res.count };
    };

    const clearHighlightsInCurrentView = () => {
        const doc = getActiveDoc();
        if (!doc?.body) return;
        clearAllMarks(doc);
    };

    // --- Theme + font ----------------------------------------------------------

    const applyFont = (pct: number) => {
        setFontPct(pct);

        const r = renditionRef.current;
        r?.themes?.fontSize?.(`${pct}%`);

        safeResize();

        if (lastSearchRef.current) {
            setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 120);
        }
    };

    const applyTheme = (mode: ThemeMode) => {
        setTheme(mode);

        const r = renditionRef.current;
        if (!r?.themes) return;

        r.themes.register?.("light", {
            body: { background: "#ffffff", color: "#0f172a" },
            a: { color: "#2563eb" },
            "mark.__search_hit": {
                background: "#ffe066",
                padding: "0 2px",
                borderRadius: "2px",
            },
        });

        r.themes.register?.("dark", {
            body: { background: "#0b1220", color: "#e5e7eb" },
            a: { color: "#93c5fd" },
            "mark.__search_hit": {
                background: "#ffe066",
                color: "#111827",
                padding: "0 2px",
                borderRadius: "2px",
            },
        });

        r.themes.select?.(mode);

        safeResize();

        if (lastSearchRef.current) {
            setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 120);
        }
    };

    // --- Rendition init --------------------------------------------------------

    const onRendition = (r: any) => {
        renditionRef.current = r;
        isReadyRef.current = false;

        // layout (your choices)
        r.flow?.("scrolled-doc"); // vertical scroll
        r.spread?.("none");

        // base styles
        r?.themes?.default?.({ body: { padding: "16px" } });
        r?.themes?.fontSize?.(`${fontPct}%`);

        // theme after attach
        setTimeout(() => applyTheme(theme), 0);

        // Bind events once per rendition instance
        if (boundRenditionRef.current !== r) {
            const prev = boundRenditionRef.current;

            if (prev) {
                unbindListener(prev, "relocated", relocatedHandlerRef.current);
                unbindListener(prev, "rendered", renderedHandlerRef.current);
            }

            boundRenditionRef.current = r;

            const relocatedHandler = (loc: any) => {
                const href = loc?.start?.href;
                if (!href) return;

                currentHrefRef.current = href;
                syncActiveFromHref(href);

                // keep highlights across navigation
                if (lastSearchRef.current) {
                    setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 180);
                }
            };

            const renderedHandler = (section: any) => {
                // this is when rendition is truly ready for resize
                isReadyRef.current = true;

                safeResize();

                const href = section?.href;
                if (href) {
                    currentHrefRef.current = href;
                    syncActiveFromHref(href);
                }

                if (lastSearchRef.current) {
                    setTimeout(() => highlightAllMatchesInCurrentView(lastSearchRef.current), 80);
                }
            };

            relocatedHandlerRef.current = relocatedHandler;
            renderedHandlerRef.current = renderedHandler;

            bindListener(r, "relocated", relocatedHandler);
            bindListener(r, "rendered", renderedHandler);
        }
    };

    // Resize when sidebar changes width
    useEffect(() => {
        safeResize();
    }, [sidebarOpen]);

    // Resize on window resize
    useEffect(() => {
        const handler = () => safeResize();
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    const handleTocChanged = (t: any[]) => {
        setToc(t);
        setTimeout(() => {
            if (currentHrefRef.current) syncActiveFromHref(currentHrefRef.current);
        }, 0);
    };

    // --- Search across spine ---------------------------------------------------

    async function findFirstHit(q: string) {
        const query = q.trim().toLowerCase();
        if (!query) return null;

        const r = renditionRef.current;
        const book = r?.book;
        const spineItems = book?.spine?.spineItems;
        if (!book || !Array.isArray(spineItems)) return null;

        const CFI = (book as any).epubcfi;

        for (const item of spineItems) {
            const href = item?.href;
            if (!href) continue;

            try {
                const markup = await book.load(href);

                let doc: Document | null = null;
                let text = "";

                if (typeof markup === "string") {
                    doc = new DOMParser().parseFromString(markup, "text/html");
                    text = (doc.body?.textContent || "").replace(/\s+/g, " ");
                } else {
                    doc = markup as Document;
                    text = (doc?.body?.textContent || "").replace(/\s+/g, " ");
                }

                if (!doc || !text) continue;
                if (!text.toLowerCase().includes(query)) continue;

                // optional CFI near first match
                let cfi: string | undefined;
                if (CFI?.fromNode && doc.body) {
                    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
                    let node: Text | null = walker.nextNode() as Text | null;
                    while (node) {
                        const nodeText = (node.nodeValue || "").toLowerCase();
                        const pos = nodeText.indexOf(query);
                        if (pos !== -1) {
                            cfi = CFI.fromNode(node, pos);
                            break;
                        }
                        node = walker.nextNode() as Text | null;
                    }
                }

                return { href, cfi };
            } catch (e) {
                console.error("Search load failed for:", href, e);
            }
        }

        return null;
    }

    // --- UI states -------------------------------------------------------------

    if (err) return <div className="p-4">Failed: {err}</div>;

    if (!url) {
        return <div className="p-4">Missing query param: <code>?url=</code></div>;
    }
    const isInitiatedRef = useRef<boolean>(false)
    type Toc = any; // replace with your real type
    const [selectedId, setSelectedId] = useState<any>(null)
    const cachedTocRef = useRef<Map<string, Toc>>(new Map());
    const navigate = useNavigate()
    const handleBook = (book: any, toc: Toc) => {
        const id = String(book?._id);

        if (cachedTocRef.current.has(id)) {
            const found = books.find((b) => String(b?._id) === id);
            // const cachedToc = cachedTocRef.current.get(id);
            // found["tocs"] = cachedToc

            setSelectedId((prev:any) => (prev === book?._id ? null : book?._id))
            return;
        }

        cachedTocRef.current.set(id, toc);
        navigate(`/book-view?id=${id}&url=${encodeURIComponent(book.bookLink)}`);
    };
    useEffect(() => {
        if (toc?.length && bookId) {
            setToc([])
            const found = books.find((b) => String(b?._id) === bookId);
            found["tocs"] = toc
            setSelectedId(bookId)
        }

    }, [toc, bookId])

    if (!bookUrl && !isInitiatedRef.current) {
        isInitiatedRef.current = true
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Spinner variant="spinner" size="lg" />
            </div>
        );
    }



    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50">
            <header className="flex items-center gap-2 px-3 py-2 border-b bg-white">
                <button
                    onClick={() => setSidebarOpen((v) => !v)}
                    className="px-3 py-2 rounded-lg border hover:bg-slate-50 active:scale-[0.99] cursor-pointer"
                >
                    ☰
                </button>

                <div className="font-semibold text-slate-900 truncate">
                    EPUB Reader
                    {activeSection ? (
                        <span className="ml-2 text-sm font-normal text-slate-500">• {activeSection}</span>
                    ) : null}
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => {
                            // optional: clear to avoid old marks staying visible during transition
                            if (lastSearchRef.current) clearHighlightsInCurrentView();
                            renditionRef.current?.prev?.();
                        }}
                        className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                    >
                        Prev
                    </button>

                    <button
                        onClick={() => {
                            if (lastSearchRef.current) clearHighlightsInCurrentView();
                            renditionRef.current?.next?.();
                        }}
                        className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                    >
                        Next
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 ml-2">
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search in book…"
                            className="px-3 py-2 border rounded-lg w-64"
                        />

                        <button
                            onClick={async () => {
                                const q = searchQuery.trim();
                                if (!q) return;

                                setSearching(true);
                                try {
                                    lastSearchRef.current = q;

                                    const hit = await findFirstHit(q);

                                    if (hit) {
                                        // Jump to chapter (or near match)
                                        if (hit.cfi) setLocation(hit.cfi);
                                        else setLocation(hit.href);

                                        // Highlight in visible chapter
                                        setTimeout(() => highlightAllMatchesInCurrentView(q), 350);
                                    } else {
                                        clearHighlightsInCurrentView();
                                    }
                                } finally {
                                    setSearching(false);
                                }
                            }}
                            className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                        >
                            {searching ? "Searching…" : "Search"}
                        </button>

                        <button
                            onClick={() => {
                                lastSearchRef.current = "";
                                clearHighlightsInCurrentView();
                            }}
                            className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                        >
                            Clear
                        </button>
                    </div>

                    <button
                        onClick={() => applyFont(Math.max(80, fontPct - 10))}
                        className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                    >
                        A-
                    </button>
                    <button
                        onClick={() => applyFont(Math.min(180, fontPct + 10))}
                        className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                    >
                        A+
                    </button>

                    <button
                        onClick={() => applyTheme("light")}
                        className={twMerge(
                            "px-3 py-2 rounded-lg border hover:bg-slate-50",
                            theme === "light" ? "bg-slate-100" : ""
                        )}
                    >
                        Light
                    </button>
                    <button
                        onClick={() => applyTheme("dark")}
                        className={twMerge(
                            "px-3 py-2 rounded-lg border hover:bg-slate-50",
                            theme === "dark" ? "bg-slate-100" : ""
                        )}
                    >
                        Dark
                    </button>
                </div>
            </header>

            <main className="flex-1 min-h-0 flex">
                <aside
                    className={twMerge(
                        sidebarOpen ? "w-80" : "w-0",
                        "transition-[width] duration-500 overflow-hidden border-r bg-white"
                    )}
                >
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-auto">
                            {/* {toc.map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        // if you want search to persist, remove the next 2 lines
                                        // lastSearchRef.current = "";
                                        // clearHighlightsInCurrentView();

                                        setLocation(item.href);
                                        setSidebarOpen(false);
                                    }}
                                    className={twMerge(
                                        "w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800",
                                        activeSection === item.label ? "bg-gray-100" : ""
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))} */}
                            <ul>
                                {books?.map((book) => (
                                    <>
                                        <li key={book._id}>
                                            <button
                                                className={twMerge(
                                                    "w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 cursor-pointer flex items-center justify-between gap-2",
                                                    bookId == book?.label ? "bg-gray-100" : ""
                                                )}
                                                onClick={() => { handleBook(book) }}
                                            >
                                                {book.bookName}
                                                <span className={book?._id == selectedId ? "rotate-180" : ""}>
                                                    <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 15 15" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor"></path></svg>
                                                </span>
                                            </button>
                                        </li>
                                        <ul className={twMerge('ps-5', book?._id == selectedId ? "" : "hidden")}>
                                            {book?.tocs?.map((item: any) => (
                                                <li key={item._id}>
                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            // if you want search to persist, remove the next 2 lines
                                                            lastSearchRef.current = "";
                                                            clearHighlightsInCurrentView();

                                                            setLocation(item.href);
                                                            setSidebarOpen(false);
                                                        }}
                                                        className={twMerge(
                                                            "w-full text-left text-xs px-4 py-2 hover:bg-slate-50 text-slate-800",
                                                            activeSection === item.label ? "bg-gray-100" : ""
                                                        )}
                                                    >
                                                        {item.label}
                                                    </button>
                                                </li>))}
                                        </ul>
                                    </>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>

                <section className="flex-1 min-w-0 bg-white">
                    <ReactReader
                        url={bookUrl}
                        location={location}
                        locationChanged={(epubcfi: string) => { setLocation(epubcfi); console.log(epubcfi, 'epubcfi') }}
                        tocChanged={handleTocChanged}
                        getRendition={onRendition}
                        epubInitOptions={{ openAs: "epub" }}
                        readerStyles={readerStyles}
                        loadingView={<div className="p-6 text-slate-600">Loading EPUB…</div>}
                    />
                </section>
            </main>
            {!bookUrl && isInitiatedRef.current && <div className="z-[999] flex items-center justify-center fixed top-0 start-0 bottom-0 end-0 h-full w-full bg-black/70">
                <Spinner variant="spinner" size="lg" />
            </div>}
        </div>
    );
}













