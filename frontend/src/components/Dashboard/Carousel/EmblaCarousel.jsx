import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronFirst, ChevronLast, ChevronDownSquare } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { HashLoader } from "react-spinners";
useEmblaCarousel.globalOptions = { slidesToScroll: "auto" };

const EmblaCarousel = ({ userInfo, houseMates }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelectBtn = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelectBtn(emblaApi);
    emblaApi.on("reInit", onSelectBtn);
    emblaApi.on("select", onSelectBtn);
  }, [emblaApi, onSelectBtn]);

  const onDotButtonClick = useCallback(
    (index) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelectDot = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelectDot(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelectDot);
    emblaApi.on("select", onSelectDot);
  }, [emblaApi, onInit, onSelectDot]);

  const [statusIn, setStatusIn] = useState(true);

  const handleStatusChange = () => {
    setStatusIn((prev) => !prev);
  };

  return houseMates ? (
    <div className="flex flex-col w-full h-full overflow-hidden" ref={emblaRef}>
      <div className="flex gap-2 2xl:gap-3 h-[90%] lg:h-4/5 ">
        {houseMates.map((houseMate, i) => {
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-evenly flex-grow-0 flex-shrink-0 w-[32.25%] h-full rounded-lg bg-eucalyptus-800 shadow-lg p-3 lg:p-4 "
            >
              <img
                className="size-14 2xl:size-16 rounded-lg"
                src={`https://ui-avatars.com/api/?name=${`${houseMate.firstName} + ${houseMate.lastName}`}&background=bbf7d0&color=052e16&bold=true`}
              />
              <p className="font-bold text-base 2xl:text-lg">
                {houseMate.firstName} {houseMate.lastName}
              </p>

              <p className="font-bold text-xs 2xl:text-sm">{houseMate.email}</p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-between items-center h-[10%] lg:h-1/5 ">
        <div className="flex flex-row items-center gap-x-1 pt-2">
          {!prevBtnDisabled ? (
            <button
              className="p-1 rounded-full bg-transparent  hover:outline-none"
              onClick={scrollPrev}
            >
              <ChevronFirst className="size-6 lg:size-9" />
            </button>
          ) : (
            <div className="p-1 mr-[.125rem] rounded-full">
              <div className="size-6 lg:size-9" />
            </div>
          )}
          {!nextBtnDisabled ? (
            <button
              className="p-1 rounded-full bg-transparent  hover:outline-none"
              onClick={scrollNext}
            >
              <ChevronLast className="size-6 lg:size-9" />
            </button>
          ) : null}
        </div>
        <div className="flex flex-row gap-1 items-center pt-2 pr-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`border border-neutral-700 bg-black size-4 p-0 hover:bg-eucalyptus-700 ${
                index === selectedIndex ? "bg-eucalyptus-900" : null
              }`}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default EmblaCarousel;
