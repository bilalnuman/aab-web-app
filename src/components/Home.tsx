// "use client"
// import { useEffect, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { useAppContext } from '../context';
// import { Spinner } from './Spinner';
// import BookCarousel from './BookCarousel';


// const base_url = import.meta.env.VITE_BASE_URL

// function Home() {
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const { books, complitionBooks, setBooksMeta } = useAppContext();
//     const navigation = useNavigate();
//     const getBooks = async () => {
//         setLoading(true)
//         setError(null)
//         try {
//             const all = await fetch(`${base_url}/book?bookLanguage=English`)
//             const complition = await fetch(`${base_url}/ebook?bookLanguage=English`)
//             const allBooks = await all.json()
//             const allCompBooks = await complition.json()
//             setBooksMeta({ all: allBooks.data, complition: allCompBooks.data })
//         } catch (error) {
//             setError(String(error))
//             console.log(error)
//             throw error
//         }
//         finally {
//             setLoading(false)
//         }
//     }
//     useEffect(() => {
//         getBooks()
//     }, [])


//     if (loading)
//         return (
//             <div className="h-screen w-screen flex items-center justify-center">
//                 <Spinner variant="spinner" size="lg" />
//             </div>
//         );
//     return (
//         <div className="mx-auto max-w-1200px p-10">
//             <div className='p-8 grid grid-cols-1 gap-14 rounded-2xl bg-white'>
//                 <div className='text-[#144780] bg-[#EBF1FC] py-8 px-6 flex flex-col items-center gap-5 rounded'>
//                     <h3 className='text-3xl font-semibold'>Books and Publications</h3>
//                     <p className='max-w-[1050px] text-center'>This online app contains a searchable index of the 24 books of Alice A. Bailey and is offered free to the public in hopes that it will support the widest distribution and availability of this important body of work. The Lucis Publishing Companies offer paid versions of this app for desktop and mobile which include additional display options for easier browsing, the facility to take notes and bookmark pages, and a more advanced search function.</p>
//                     <p className='max-w-[1050px] text-center'>We recommend the paid version for those doing advanced research of the books. The publishing companies are registered non-profit charities in the US and UK. All proceeds support the wider distribution of the work of Alice A. Bailey and the Tibetan.</p>
//                     <Link to='/' className='bg-[#99B82D] w-fit rounded-lg text-white px-4 py-2'>Premimum Apps</Link>
//                     <Link to='/' className=' font-semibold text-sm underline flex items-center gap-2'>
//                         <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path></svg>
//                         Lucis Publishing Company Book Store</Link>
//                 </div>
//                 <div>
//                     <h3 className='text-2xl font-medium text-[#191536] mb-9'>Books and Publications</h3>
//                     <BookCarousel
//                         data={books}
//                     />
//                 </div>

//                 <div className=''>
//                     <h3 className='text-2xl font-medium text-[#191536] mb-9'>Compilation</h3>
//                     <BookCarousel
//                         data={complitionBooks}
//                     />
//                 </div>
//             </div>
//         </div>
//         // <EpubReader />
//     )
// }

// export default Home




















"use client";
import { Link } from "react-router-dom";
import { useAppContext } from "../context";
import { Spinner } from "./Spinner";
import BookCarousel from "./BookCarousel";
import { buildTocsByBookId } from "../helper/buildTocsByBookId";

const base_url = import.meta.env.VITE_BASE_URL;

function Home() {
    // const [error, setError] = useState<string | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);

    const { loadingBooks, books, complitionBooks } = useAppContext();
    // const tocStartedRef = useRef(false);

    // const getBooks = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const all = await fetch(`${base_url}/book?bookLanguage=English`);
    //         const complition = await fetch(`${base_url}/ebook?bookLanguage=English`);
    //         const allBooks = await all.json();
    //         const allCompBooks = await complition.json();
    //         setBooksMeta({ all: allBooks.data, complition: allCompBooks.data });
    //     } catch (error) {
    //         setError(String(error));
    //         console.log(error);
    //         throw error;
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     getBooks();
    // }, []);

    // useEffect(() => {
    //     if ((!books?.length && !complitionBooks?.length) || tocStartedRef.current) return;
    //     tocStartedRef.current = true;

    //     const allBooks = [...(books || []), ...(complitionBooks || [])];

    //     // ✅ Pass { _id, bookLink } so result can be keyed by book id
    //     const meta = allBooks
    //         .filter((b: any) => b?._id && b?.bookLink)
    //         .map((b: any) => ({ _id: b._id, bookLink: b.bookLink }));

    //     (async () => {
    //         try {
    //             const tocsById = await buildTocsByBookId(meta);
    //             setBookTocsById(tocsById);
    //         } catch (e) {
    //             console.error("TOC build failed:", e);
    //         }
    //     })();
    // }, [books, complitionBooks, setBookTocsById]);

    if (loadingBooks)
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Spinner variant="spinner" size="lg" />
            </div>
        );

    return (
        <div className="mx-auto max-w-1200px p-10">
            <div className="p-8 grid grid-cols-1 gap-14 rounded-2xl bg-white">
                <div className="text-[#144780] bg-[#EBF1FC] py-8 px-6 flex flex-col items-center gap-5 rounded">
                    <h3 className="text-3xl font-semibold">Books and Publications</h3>
                    <p className="max-w-[1050px] text-center">
                        This online app contains a searchable index of the 24 books of Alice A. Bailey...
                    </p>
                    <Link to="/" className="bg-[#99B82D] w-fit rounded-lg text-white px-4 py-2">
                        Premimum Apps
                    </Link>
                </div>

                <div>
                    <h3 className="text-2xl font-medium text-[#191536] mb-9">Books and Publications</h3>
                   {books?.length? <BookCarousel data={books} />:<div className="text-center">Books Not Found</div>}
                </div>

                <div>
                    <h3 className="text-2xl font-medium text-[#191536] mb-9">Compilation</h3>
                   {complitionBooks?.length? <BookCarousel data={complitionBooks} />:<div className="text-center">Complition Books Not Found</div>}
                </div>
            </div>
        </div>
    );
}

export default Home;

