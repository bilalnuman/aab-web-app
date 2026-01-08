import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProvider } from './context/index.tsx';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.tsx';
// main.tsx
const NativeDOMParser = window.DOMParser;

class PatchedDOMParser {
  parseFromString(markup: string, mime: DOMParserSupportedType) {
    // Patch NCX (EPUB2 TOC) if it uses namespaced tags like <ncx:content>
    if (mime.includes("xml") && markup.includes("<ncx")) {
      markup = markup
        // normalize tag names by stripping namespace prefixes
        .replace(/<(\w+:)(content|navLabel|text)\b/g, "<$2")
        .replace(/<\/(\w+:)(content|navLabel|text)>/g, "</$2");
    }

    return new NativeDOMParser().parseFromString(markup, mime);
  }
}

// TS will complain because DOMParser is a built-in type; cast to any.
(window as any).DOMParser = PatchedDOMParser as any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
