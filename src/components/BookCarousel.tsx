// src/components/BookCarousel.tsx
import { twMerge } from "tailwind-merge";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Pagination } from "swiper/modules";
import thumbnail from "../assets/thumbnail.jpeg"

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link, useNavigate } from "react-router-dom";

export const BookIcon = () => {
    return (
        <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.0981 2.61259H20.7573V1.60366C20.7574 1.51168 20.7303 1.42172 20.6796 1.34496C20.6289 1.26821 20.5568 1.20804 20.4722 1.17193C17.6406 -0.0368414 14.1567 0.475462 11.3018 2.50036C8.44695 0.475462 4.96299 -0.0366983 2.13145 1.17193C2.04685 1.20804 1.97472 1.26821 1.92402 1.34496C1.87333 1.42172 1.84631 1.51168 1.84631 1.60366V2.61259H0.50553C0.246327 2.61259 0.0361328 2.82273 0.0361328 3.08198V16.0565C0.0361328 16.3157 0.246327 16.5259 0.50553 16.5259H22.0981C22.3574 16.5259 22.5675 16.3157 22.5675 16.0565V3.08203C22.5675 2.82278 22.3574 2.61259 22.0981 2.61259ZM0.974927 15.5871V3.55143H1.84631V14.5782C1.84633 14.6558 1.86559 14.7322 1.90236 14.8005C1.93914 14.8689 1.99229 14.927 2.05705 14.9698C2.12181 15.0126 2.19617 15.0386 2.27346 15.0456C2.35076 15.0526 2.42858 15.0403 2.49997 15.0098C4.69869 14.0712 7.35393 14.306 9.71064 15.5871H0.974927ZM10.8325 15.159C9.11925 14.0672 7.21348 13.5004 5.37389 13.5004C4.48577 13.5004 3.6132 13.6325 2.78515 13.9015V3.08747C2.78515 3.08561 2.78544 3.08384 2.78544 3.08203C2.78544 3.08022 2.7852 3.07841 2.78515 3.0766V1.92117C5.28884 0.98276 8.32472 1.50755 10.8325 3.31873V15.159ZM11.7713 3.31873C14.2789 1.50751 17.315 0.98276 19.8186 1.92117V3.07655C19.8186 3.07836 19.8183 3.08017 19.8183 3.08198C19.8183 3.0838 19.8185 3.08561 19.8186 3.08742V13.9014C17.2752 13.0752 14.3115 13.5402 11.7713 15.1589V3.31873ZM21.6287 15.5871H12.893C15.2497 14.306 17.9049 14.0713 20.1037 15.0098C20.1751 15.0403 20.2529 15.0526 20.3302 15.0456C20.4075 15.0386 20.4819 15.0126 20.5466 14.9698C20.6114 14.927 20.6645 14.8689 20.7013 14.8005C20.7381 14.7322 20.7573 14.6558 20.7573 14.5782V3.55143H21.6287V15.5871Z" fill="white"></path></svg>
    )
}

interface ChevronProps {
    className?: string;
    arrowType?: 'prevClass' | 'nextClass'
}

const NavigationBtn = ({ className, arrowType }: ChevronProps) => {
    return (
        <button
            type="button"
            // aria-label="Previous"
            className={twMerge("absolute cursor-pointer top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-md ring-1 ring-black/5 hover:bg-slate-50 active:scale-95", className, arrowType)}
        >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M328 112 184 256l144 144"></path></svg>
        </button>
    )
}

export default function BookCarousel({ data }: { data: any }) {
    const modalRef = useRef<HTMLDivElement>(null)
    const [selectedBook, setSelectedBook] = useState<any>(null)
    const uid = useId().replace(/:/g, "");
    const prevClass = `carousel-prev-${uid}`;
    const nextClass = `carousel-next-${uid}`;
    const navigate = useNavigate()

    const breakpoints = useMemo(
        () => ({
            0: { slidesPerView: 1.15, spaceBetween: 14 },
            480: { slidesPerView: 1.6, spaceBetween: 16 },
            640: { slidesPerView: 2.2, spaceBetween: 18 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 22 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
        }),
        []
    );

    // book
    const handleBook = (b: any) => {
        setSelectedBook(b)
    }

    const handleReadBook = (book: any) => {
        setSelectedBook(null)
        // const params = new URLSearchParams({ url: book?.bookLink ?? "" });
        // navigate(`/book/${book?._id}?${params.toString()}`);
        navigate(`/book-view?id=${book._id}&url=${encodeURIComponent(book.bookLink)}`);


        // navigate(`book/${book?._id}?url=${book?.bookLink}`)
    }

    useEffect(() => {
        function onPointerDown(e: MouseEvent | TouchEvent) {
            const target = e.target as Node;
            if (!modalRef.current) return;

            // If click/touch is outside modal -> close
            if (!modalRef.current.contains(target)) {
                setSelectedBook(null);
            }
        }

        // Use capture so it catches earlier (helps with portals/stopPropagation)
        document.addEventListener("mousedown", onPointerDown, true);
        document.addEventListener("touchstart", onPointerDown, true);

        return () => {
            document.removeEventListener("mousedown", onPointerDown, true);
            document.removeEventListener("touchstart", onPointerDown, true);
        };
    }, [setSelectedBook]);



    return (
        <>
            <div className="relative">
                {/* Prev */}

                <NavigationBtn className="left-5" arrowType="prevClass" />
                <NavigationBtn className={twMerge("right-5 translate-x-1/2 rotate-180", nextClass)} />
                <div className="px-15">
                    <Swiper
                        modules={[Navigation, A11y, Pagination]}
                        grabCursor
                        watchOverflow
                        breakpoints={breakpoints}
                        navigation={{
                            prevEl: `.${prevClass}`,
                            nextEl: `.${nextClass}`,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true, // nicer on mobile (optional)
                        }}
                        className="pb-14!"

                    >
                        {data?.map((b: any) => (
                            <SwiperSlide key={b.id} className="px-3">
                                <div onClick={(e) => { e.stopPropagation(); handleBook(b) }} className="h-full border border-gray-200 overflow-hidden rounded-xl bg-white shadow py-5 cursor-pointer">
                                    <div className="px-4">
                                        <div className="aspect-3/4 overflow-hidden rounded-lg bg-slate-100">
                                            <img src={b.thumbnailLink ?? thumbnail} alt={b.title} className="h-full w-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="px-4 mt-4">
                                        <h3 className="truncate text-base font-semibold">{b.bookName}</h3>
                                        <p className="mt-1 truncate text-sm text-slate-500">{b.authorName}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* book modal */}
            {selectedBook && (
                <div className="fixed top-0 start-0 w-full h-full z-50 bg-black/50 flex items-center justify-center" >
                    <div className=" rounded-xl bg-white shadow" ref={modalRef}>
                        <button className="text-lg bg-gray-300 hover:opacity-85 rounded-full w-6 h-6 flex items-center justify-center ms-auto relative me-6 top-3 cursor-pointer" onClick={() => setSelectedBook(null)}>x</button>
                        <div className="px-5 w-[500px] max-h-[calc(100vh_-_12vh)] overflow-auto min-h-[calc(100vh_-_12vh)] py-10 r text-center flex flex-col justify-between gap-5">
                            <div className="px-4 max-w-[200px] mx-auto">
                                <img src={selectedBook?.thumbnailLink ?? thumbnail} alt={selectedBook?.title} className="max-w-[200px] mx-auto" />
                            </div>
                            <div className="px-4 mt-4">
                                <h3 className="truncate text-base font-semibold">{selectedBook?.bookName}</h3>
                                <p className="mt-1 truncate text-sm text-slate-500">{selectedBook?.authorName}</p>
                                <p className="py-3">Pages</p>
                                <p className="mt-1 truncate text-sm text-slate-500">{selectedBook?.bookDescription}</p>
                                <p className="pb-3">{selectedBook?.bookLanguage}</p>
                                <button onClick={(e) => { e.stopPropagation(); handleReadBook(selectedBook) }} className='bg-[#99B82D] w-full justify-center rounded-lg flex text-white px-4 py-2.5 hover:opacity-90 mt-5 items-center gap-2 mx-auto cursor-pointer'>Read Now
                                    <BookIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* end */}
        </>
    );
}
