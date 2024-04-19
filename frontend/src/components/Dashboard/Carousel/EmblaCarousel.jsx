import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronFirst, ChevronLast } from "lucide-react";

const EmblaCarousel = () => {
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

  const Array = [1, 2, 3, 4, 5];

  return (
    <div className="w-full h-full overflow-hidden" ref={emblaRef}>
      <div className="flex gap-x-2">
        {Array.map((index, i) => {
          return (
            <div
              key={i}
              className="flex flex-col flex-grow-0 flex-shrink-0 w-[32.25%] h-[12.9rem]  rounded-lg bg-eucalyptus-900 shaodw-lg"
            >
              Slide {index}
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-x-1 pt-2">
          {!prevBtnDisabled ? (
            <button
              className="p-1 rounded-full bg-transparent  hover:outline-none"
              onClick={scrollPrev}
            >
              <ChevronFirst className="size-7" />
            </button>
          ) : (
            <div className="p-1 mr-[.125rem] rounded-full">
              <div className="size-7" />
            </div>
          )}
          {!nextBtnDisabled ? (
            <button
              className="p-1 rounded-full bg-transparent  hover:outline-none"
              onClick={scrollNext}
            >
              <ChevronLast className="size-7" />
            </button>
          ) : null}
        </div>
        <div className="flex flex-row gap-1 items-center pt-2 pr-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`border border-neutral-700 bg-black size-3 p-0 hover:bg-eucalyptus-700 ${
                index === selectedIndex ? "bg-eucalyptus-900" : null
              }`}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
