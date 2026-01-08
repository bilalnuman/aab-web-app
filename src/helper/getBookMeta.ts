import JSZip from "jszip";

export type TocItem = {
    id: string;
    label: string;
    href: string;
    subitems?: TocItem[];
};

const textOf = (el: Element | null | undefined) => (el?.textContent || "").trim();

function joinPath(baseDir: string, href: string) {
    if (!href) return "";
    if (/^https?:\/\//i.test(href)) return href;

    const cleanBase = baseDir.replace(/\/?$/, "/");
    const cleanHref = href.replace(/^\/+/, "");
    const full = cleanBase + cleanHref;

    const parts: string[] = [];
    for (const p of full.split("/")) {
        if (!p || p === ".") continue;
        if (p === "..") parts.pop();
        else parts.push(p);
    }
    return parts.join("/");
}

async function getOpfPath(zip: JSZip) {
    const containerFile = zip.file("META-INF/container.xml");
    if (!containerFile) throw new Error("container.xml not found");

    const xml = await containerFile.async("text");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const rootfile = doc.querySelector("rootfile");
    const fullPath = rootfile?.getAttribute("full-path");
    if (!fullPath) throw new Error("OPF path not found in container.xml");

    return fullPath;
}

function parseNavToc(navHtml: string, baseDir: string): TocItem[] {
    const doc = new DOMParser().parseFromString(navHtml, "text/html");

    const nav =
        doc.querySelector('nav[epub\\:type="toc"]') ||
        doc.querySelector('nav[role="doc-toc"]') ||
        doc.querySelector("nav");

    if (!nav) return [];

    const ol = nav.querySelector("ol");
    if (!ol) return [];

    let autoId = 0;

    const walkLi = (li: Element): TocItem | null => {
        const a = li.querySelector(":scope > a");
        const span = li.querySelector(":scope > span");

        const label = textOf(a) || textOf(span);
        const rawHref = a?.getAttribute("href") || "";
        if (!label) return null;

        const item: TocItem = {
            id: `toc_${autoId++}`,
            label,
            href: joinPath(baseDir, rawHref),
        };

        const childOl = li.querySelector(":scope > ol");
        if (childOl) {
            const kids = Array.from(childOl.querySelectorAll(":scope > li"))
                .map(walkLi)
                .filter(Boolean) as TocItem[];
            if (kids.length) item.subitems = kids;
        }

        return item;
    };

    return Array.from(ol.querySelectorAll(":scope > li"))
        .map(walkLi)
        .filter(Boolean) as TocItem[];
}

function parseNcxToc(ncxXml: string, baseDir: string): TocItem[] {
    const doc = new DOMParser().parseFromString(ncxXml, "application/xml");

    let autoId = 0;

    const walkNavPoint = (np: Element): TocItem | null => {
        const label = textOf(np.querySelector("navLabel > text"));
        const src = np.querySelector("content")?.getAttribute("src") || "";
        if (!label || !src) return null;

        const item: TocItem = {
            id: `toc_${autoId++}`,
            label,
            href: joinPath(baseDir, src),
        };

        const children = Array.from(np.querySelectorAll(":scope > navPoint"))
            .map(walkNavPoint)
            .filter(Boolean) as TocItem[];

        if (children.length) item.subitems = children;
        return item;
    };

    const navMap = doc.querySelector("navMap");
    if (!navMap) return [];

    return Array.from(navMap.querySelectorAll(":scope > navPoint"))
        .map(walkNavPoint)
        .filter(Boolean) as TocItem[];
}

export async function extractTocFromEpubUrl(epubUrl: string): Promise<TocItem[]> {
    const safeUrl = encodeURI(epubUrl);

    const res = await fetch(safeUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`EPUB fetch failed: ${res.status}`);

    const buf = await res.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    const opfPath = await getOpfPath(zip);
    const opfText = await zip.file(opfPath)!.async("text");
    const opfDoc = new DOMParser().parseFromString(opfText, "application/xml");

    const baseDir = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1) : "";

    // EPUB3 nav
    const navItem = Array.from(opfDoc.querySelectorAll("manifest > item")).find((it) =>
        (it.getAttribute("properties") || "").split(/\s+/).includes("nav")
    );

    if (navItem) {
        const navHref = navItem.getAttribute("href") || "";
        const navPath = joinPath(baseDir, navHref);
        const navHtml = await zip.file(navPath)!.async("text");
        const toc = parseNavToc(navHtml, baseDir);
        if (toc.length) return toc;
    }

    // EPUB2 ncx
    const ncxItem = Array.from(opfDoc.querySelectorAll("manifest > item")).find(
        (it) =>
            (it.getAttribute("media-type") || "").toLowerCase() === "application/x-dtbncx+xml"
    );

    if (ncxItem) {
        const ncxHref = ncxItem.getAttribute("href") || "";
        const ncxPath = joinPath(baseDir, ncxHref);
        const ncxXml = await zip.file(ncxPath)!.async("text");
        const toc = parseNcxToc(ncxXml, baseDir);
        if (toc.length) return toc;
    }

    // fallback: any .ncx
    const anyNcx = Object.keys(zip.files).find((p) => p.toLowerCase().endsWith(".ncx"));
    if (anyNcx) {
        const ncxXml = await zip.file(anyNcx)!.async("text");
        const fallbackBase = anyNcx.includes("/") ? anyNcx.slice(0, anyNcx.lastIndexOf("/") + 1) : "";
        const toc = parseNcxToc(ncxXml, fallbackBase);
        if (toc.length) return toc;
    }

    return [];
}
