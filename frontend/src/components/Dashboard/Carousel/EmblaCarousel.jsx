import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronFirst, ChevronLast, ChevronDownSquare } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { HashLoader } from "react-spinners";
useEmblaCarousel.globalOptions = { slidesToScroll: "auto" };

const EmblaCarousel = ({ userInfo, houseInfo }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [houseMates, setHouseMates] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      if (!userId) {
        console.log("Log out in fetch due to userID not exist");
        handleLogOut();
        navigate("/login"); // Redirect to login if no session
        return;
      }

      try {
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getUserInfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();

        if (data.token) {
          const decoded = jwtDecode(data.token);
          return decoded;
        } else {
          console.error("User not found:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    if (houseInfo) {
      const status = houseInfo.statuses;
      const tempArray = [];
      setLoader(true);

      status.map((item) => {
        fetchUserInfo(item.userId).then((user) => {
          const object = {
            firstName: user.firstName,
            lastName: user.lastName,
            status: item.status,
          };
          tempArray.push(object);
        });
      });

      setHouseMates(tempArray);
    }
  }, [houseInfo]);

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
    <div className="w-full h-full overflow-hidden" ref={emblaRef}>
      <div className="flex gap-2 2xl:gap-3  h-4/5 ">
        <div className="flex flex-col items-center justify-evenly flex-grow-0 flex-shrink-0 w-[32.25%] h-full rounded-lg bg-eucalyptus-800 shadow-lg p-4">
          <img
            className="size-14 2xl:size-16 rounded-lg"
            src={`https://ui-avatars.com/api/?name=${userInfo.firstName} ${userInfo.lastName}&background=bbf7d0&color=052e16&bold=true`}
          />
          <p className="font-bold text-lg 2xl:text-xl">You</p>
          <div className="flex flex-row items-center">
            <p className="mr-2 font-bold text-base 2xl:text-xl">Status: </p>
            <button
              onClick={handleStatusChange}
              className="p-1 w-20 bg-eucalyptus-950 hover:bg-eucalyptus-900 border border-eucalyptus-600"
            >
              {statusIn ? "In Room" : "Out"}
            </button>
          </div>
        </div>
        {houseMates.map((houseMate, i) => {
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-evenly flex-grow-0 flex-shrink-0 w-[32.25%] h-full rounded-lg bg-eucalyptus-800 shadow-lg p-4"
            >
              <img
                className="size-14 2xl:size-16 rounded-lg"
                src={`https://ui-avatars.com/api/?name=${`${houseMate.firstName} + ${houseMate.lastName}`}&background=bbf7d0&color=052e16&bold=true`}
              />
              <p className="font-bold text-base 2xl:text-lg">
                {houseMate.firstName} {houseMate.lastName}
              </p>
              <div className="flex flex-row items-center">
                <p className="mr-2 font-bold text-base 2xl:text-xl">Status: </p>
                <p className="text-base 2xl:text-xl">{houseMate.status}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-between items-center h-1/5 ">
        <div className="flex flex-row items-center gap-x-1 pt-2">
          {!prevBtnDisabled ? (
            <button
              className="p-1 rounded-full bg-transparent  hover:outline-none"
              onClick={scrollPrev}
            >
              <ChevronFirst className="size-9" />
            </button>
          ) : (
            <div className="p-1 mr-[.125rem] rounded-full">
              <div className="size-9" />
            </div>
          )}
          {!nextBtnDisabled ? (
            <button
              className="p-1 rounded-full bg-transparent  hover:outline-none"
              onClick={scrollNext}
            >
              <ChevronLast className="size-9" />
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
