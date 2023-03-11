import React, { useCallback, useEffect, useMemo, useState } from "react";
import Carousel, {
	CarouselOptionsType,
	CarouselDotsBaseType,
} from "../Carousel/Carousel";
import {
	setVerticalCarouselLastSlide,
	setVerticalCarouselDotsWithLabels,
} from "./utils";
import "./Home.css";
import Video from "../Video Component/Video";

type category = "woman" | "man" | "kids";
interface HomePropsType {
	category: category;
	setCategory: React.Dispatch<React.SetStateAction<category>>;
	setHeaderLogoColor: React.Dispatch<React.SetStateAction<"black" | "white">>;
}

//component--------------------------------------------------------------------------------------
const Home = ({ category, setCategory, setHeaderLogoColor }: HomePropsType) => {
	//state variables------------------------------------------------------------------

	const [activeSlideNoWOMAN, setActiveSlideNoWOMAN] = useState<
		number | undefined
	>(undefined);
	const [activeSlideNoMAN, setActiveSlideNoMAN] = useState<
		number | undefined
	>(undefined);
	const [activeSlideNoKIDS, setActiveSlideNoKIDS] = useState<
		number | undefined
	>(undefined);

	const [verticalCarouselLastSlide] = useState<JSX.Element>(
		setVerticalCarouselLastSlide
	);
	const [verticalCarouselDotsWithLabels] = useState(
		setVerticalCarouselDotsWithLabels
	);

	const horizontalCarouselOptions: CarouselOptionsType = useMemo(() => {
		return {
			CarouselArrows: {
				isTrue: true,
				label: ["WOMAN", "MAN", "KIDS"],
			},
			CarouselDots: {
				isTrue: false,
			},
			AnimateOnWheelEvent: true,
			isInfiniteLoop: false,
		};
	}, []);
	const verticalCarouselOptions: CarouselOptionsType = useMemo(() => {
		return {
			CarouselContainerStyles: {
				width: "100%",
				height: "100%",
				// zIndex: "20",
			},
			CarouselArrows: {
				isTrue: false,
			},
			CarouselDots: {
				isTrue: true,
				CarouselDotsContainerPosition: "bottom-right-vertical",
				CarouselDotsAdditionalStyles: {
					paddingRight: "3rem",
					gap: "1.2rem",
				},
			},
			AnimationOptions: {
				AnimationDuration: 900,
				AnimationType: "stack",
			},
			AnimateOnWheelEvent: true,
			isVertical: true,
			AutoSlideChange: {
				isTrue: true,
				timer: 4000,
				waitUntilVideoHasFinishedPlayingToMoveToNextSlide: true,
			},
		};
	}, []);

	//useEffects -----------------------------------------------------------------------------------

	useEffect(() => {
		if (!category) return;

		if (category === "woman") {
			setActiveSlideNoWOMAN(() => {
				//force change even when state value is the same
				queueMicrotask(() => setActiveSlideNoWOMAN(0));
				return undefined;
			});
		} else if (category === "man") {
			setActiveSlideNoMAN(() => {
				//force change even when state value is the same
				queueMicrotask(() => setActiveSlideNoMAN(0));
				return undefined;
			});
		} else {
			setActiveSlideNoKIDS(() => {
				//force change even when state value is the same
				queueMicrotask(() => setActiveSlideNoKIDS(0));
				return undefined;
			});
		}
	}, [category]);

	//custom functions-----------------------------------------------------------------------------------------

	const executeOnHzntlCarouselActiveSlide = useCallback(
		function executeOnHzntlCarouselActiveSlide(slideNo: number) {
			setCategory(
				slideNo === 0 ? "woman" : slideNo === 1 ? "man" : "kids"
			);
		},
		[setCategory]
	);

	//----------------------------------------------------------------------------------------------------------

	return (
		<Carousel
			{...horizontalCarouselOptions}
			setActiveSlide={
				category === "woman" ? 0 : category === "man" ? 1 : 2
			}
			executeOnActiveSlide={executeOnHzntlCarouselActiveSlide}
		>
			<Carousel
				{...verticalCarouselOptions}
				CarouselDots={{
					...(verticalCarouselOptions.CarouselDots as CarouselDotsBaseType),
					label: verticalCarouselDotsWithLabels.Woman,
				}}
				setActiveSlide={activeSlideNoWOMAN}
			>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_woman/new/WOMAN_NEW-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_woman/new/WOMAN_NEW-landscape-fill-2400.jpg")}
						alt="woman wearing a jacket and jeans looking towards the left"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_woman/collection/WOMAN_COLLECTION-landscape-fill-2400.jpg")}
						alt="woman in black with a big smile on her face"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_woman/jeans/WOMAN_JEANS-landscape-fill-2400.jpg")}
						alt="woman in a t shirt and jeans looking towards the left"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_woman/dresses/WOMAN_DRESSES-landscape-fill-2400.jpg")}
						alt="woman in a black dress and heels with her arms crossed"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_woman/shoes/WOMAN_SHOES-landscape-fill-2400.jpg")}
						alt="shoe (heel) with a denim fabric"
					/>
				</picture>
				{verticalCarouselLastSlide}
			</Carousel>
			<Carousel
				{...verticalCarouselOptions}
				CarouselDots={{
					...(verticalCarouselOptions.CarouselDots as CarouselDotsBaseType),
					label: verticalCarouselDotsWithLabels.Man,
				}}
				setActiveSlide={activeSlideNoMAN}
			>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_man/new/MAN_NEW-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_man/new/MAN_NEW-landscape-fill-2400.jpg")}
						alt="a man with orange hair wearing a hooded coat"
					/>
				</picture>
				<div className="vert-carousel-container__img-container">
					<picture className="vert-carousel-container__img-container__nested-img--grid-area-name">
						<source
							media="(max-width: 480px)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-portrait-fill-phone.jpg?as=webp")}
						/>
						<source
							media="(max-width: 480px)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 1024px) and (orientation: portrait)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-portrait-fill-ipad.jpg?as=webp")}
						/>
						<source
							media="(max-width: 1024px) and (orientation: portrait)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-portrait-fill-ipad.jpg")}
						/>
						<source
							media="(max-width: 1200px)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-landscape-fill-1600.jpg?as=webp")}
						/>
						<source
							media="(max-width: 1200px)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-landscape-fill-1600.jpg")}
						/>
						<source
							media="(max-width: 2200px)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-landscape-fill-2200.jpg?as=webp")}
						/>
						<source
							media="(max-width: 2200px)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-landscape-fill-2200.jpg")}
						/>
						<source
							media="(min-width: 2201px)"
							srcSet={require("Assets/images/carousel_man/utility/MAN_UTILITY-landscape-fill-2400.jpg?as=webp")}
						/>
						<img
							className="vert-carousel-container__img-container__nested-img"
							src={require("Assets/images/carousel_man/utility/MAN_UTILITY-landscape-fill-2400.jpg")}
							alt="a collage of men wearing different clothes"
						/>
					</picture>
					<img
						className="vert-carousel-container__img-container__nested-img vert-carousel-container__img-container__nested-img--grid-area-name"
						src={require("Assets/images/svgs/MAN_UTILITY-landscape-fill-svg.svg")}
						alt="some text"
					/>
				</div>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_man/athleticz/MAN_ATHLETICZ-landscape-fill-2400.jpg")}
						alt="a group of people wearing active-wear, running up a mountain"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-landscape-fill-1600.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-landscape-fill-1600.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_man/shoes/MAN_SHOES-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_man/shoes/MAN_SHOES-landscape-fill-2400.jpg")}
						alt="a closeup of a mens shoe"
					/>
				</picture>
				{verticalCarouselLastSlide}
			</Carousel>
			<Carousel
				{...verticalCarouselOptions}
				CarouselDots={{
					...(verticalCarouselOptions.CarouselDots as CarouselDotsBaseType),
					label: verticalCarouselDotsWithLabels.Kids,
				}}
				setActiveSlide={activeSlideNoKIDS}
			>
				{/* --------------------------------------- video ------------------------------------------------- */}
				<Video
					dataPhonePortraitSrc={require("Assets/videos/KIDS_NEWBABYSIZE-portrait-fill-phone.mp4")}
					dataIpadPortraitSrc={require("Assets/videos/KIDS_NEWBABYSIZE-portrait-fill-ipad.mp4")}
					dataDesktopMedSrc={require("Assets/videos/KIDS_NEWBABYSIZE-landscape-fill-med.mp4")}
					dataDesktopLargeSrc={require("Assets/videos/KIDS_NEWBABYSIZE-landscape-fill-large.mp4")}
					preload="auto"
					loop={true}
					seekToStartWhenNotVisible={true}
					posterPortrait={require("Assets/videos/KIDS_NEWBABYSIZE-poster-portrait.jpg")}
					posterLandscape={require("Assets/videos/KIDS_NEWBABYSIZE-poster-landscape.jpg")}
				/>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-landscape-fill-1400.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-landscape-fill-1400.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_kids/girl/KIDS_GIRL-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_kids/girl/KIDS_GIRL-landscape-fill-2400.jpg")}
						alt="side profile of a girl in a white dress"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-landscape-fill-1400.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-landscape-fill-1400.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_kids/boy/KIDS_BOY-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_kids/boy/KIDS_BOY-landscape-fill-2400.jpg")}
						alt="2 boys with one boy leaning on a big ball and the other with his arms up and looking up"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-landscape-fill-1400.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-landscape-fill-1400.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_kids/babygirl/KIDS_BABYGIRL-landscape-fill-2400.jpg")}
						alt="a girl wearing a white dress and crown"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-landscape-fill-1400.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-landscape-fill-1400.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_kids/babyboy/KIDS_BABYBOY-landscape-fill-2400.jpg")}
						alt="a closeup of a boy wearing a shirt and a cap"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-landscape-fill-1400.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-landscape-fill-1400.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_kids/newborn/KIDS_NEWBORN-landscape-fill-2400.jpg")}
						alt="3 babies together"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-landscape-fill-1400.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-landscape-fill-1400.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_kids/swimwear/KIDS_SWIMWEAR-landscape-fill-2400.jpg")}
						alt="an aerial view of people in a pool"
					/>
				</picture>
				<picture>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-portrait-fill-phone.jpg?as=webp")}
					/>
					<source
						media="(max-width: 480px)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-portrait-fill-phone.jpg")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-portrait-fill-ipad.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1024px) and (orientation: portrait)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-portrait-fill-ipad.jpg")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-landscape-fill-1400.jpg?as=webp")}
					/>
					<source
						media="(max-width: 1200px)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-landscape-fill-1400.jpg")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-landscape-fill-2200.jpg?as=webp")}
					/>
					<source
						media="(max-width: 2200px)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-landscape-fill-2200.jpg")}
					/>
					<source
						media="(min-width: 2201px)"
						srcSet={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-landscape-fill-2400.jpg?as=webp")}
					/>
					<img
						src={require("Assets/images/carousel_kids/shoes/KIDS_SHOES-landscape-fill-2400.jpg")}
						alt="a kids sandal on a pedestal"
					/>
				</picture>
				{verticalCarouselLastSlide}
			</Carousel>
		</Carousel>
	);
};

export default Home;
