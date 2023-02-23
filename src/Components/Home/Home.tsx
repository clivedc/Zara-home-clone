import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
// import { NavLink } from "react-router-dom";
import Carousel, { CarouselOptionsType } from "../Carousel/Carousel";
import { useCategoryContext } from "../Header/Header";
import RadioBtn from "../RadioBtn/RadioBtn";
import RadioGroup from "../RadioBtn/RadioGroup";
import Video from "../Video Component/Video";
import {
	setVerticalCarouselLastSlide,
	setVerticalCarouselDotsWithLabels,
} from "./utils";
import "./Home.css";

//component--------------------------------------------------------------------------------------
const Home = () => {
	//state variables------------------------------------------------------------------

	const [settingActiveSlideNoWOMAN, set_SettingActiveSlideNoWOMAN] = useState<
		number | undefined
	>(undefined);
	const [settingActiveSlideNoMAN, set_SettingActiveSlideNoMAN] = useState<
		number | undefined
	>(undefined);
	const [settingActiveSlideNoKIDS, set_SettingActiveSlideNoKIDS] = useState<
		number | undefined
	>(undefined);
	const [
		settingActiveSlideNoForHorizontalCarousel,
		set_SettingActiveSlideNoForHorizontalCarousel,
	] = useState<number | undefined>(undefined);
	const [currentlyActiveSlideNoWOMAN, getCurrentlyActiveSlideNoWOMAN] =
		useState<number>(0);
	const [currentlyActiveSlideNoMAN, getCurrentlyActiveSlideNoMAN] =
		useState<number>(0);
	const [currentlyActiveSlideNoKIDS, getCurrentlyActiveSlideNoKIDS] =
		useState<number>(0);
	// const [carouselDotValueWOMAN, setCarouselDotValueWOMAN] = useState(0);
	// const [carouselDotValueMAN, setCarouselDotValueMAN] = useState(0);
	// const [carouselDotValueKIDS, setCarouselDotValueKIDS] = useState(0);
	const [verticalCarouselLastSlide] = useState<JSX.Element>(
		setVerticalCarouselLastSlide
	);
	const { category, setHeaderLogoColor } = useCategoryContext();
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
				AutoHideAfterTransition: true,
			},
			AnimateOnWheelEvent: true,
			isVertical: true,
			AutoSlideChange: {
				isTrue: true,
				timer: 3000,
			},
		};
	}, []);

	//useEffects -----------------------------------------------------------------------------------
	// useEffect(() => {
	// 	console.log(
	// 		currentlyActiveSlideNoWOMAN ===
	// 			verticalCarouselDotsWithLabels.Woman.length - 1
	// 	);
	// }, [
	// 	currentlyActiveSlideNoWOMAN,
	// 	verticalCarouselDotsWithLabels.Woman.length,
	// ]);

	useEffect(() => {
		if (!category) return;

		if (category === "woman") {
			set_SettingActiveSlideNoWOMAN(() => {
				//force change even when state value is the same
				queueMicrotask(() => set_SettingActiveSlideNoWOMAN(0));
				return undefined;
			});
			set_SettingActiveSlideNoForHorizontalCarousel(0);
		} else if (category === "man") {
			set_SettingActiveSlideNoMAN(() => {
				//force change even when state value is the same
				queueMicrotask(() => set_SettingActiveSlideNoMAN(0));
				return undefined;
			});
			set_SettingActiveSlideNoForHorizontalCarousel(1);
		} else {
			set_SettingActiveSlideNoKIDS(() => {
				//force change even when state value is the same
				queueMicrotask(() => set_SettingActiveSlideNoKIDS(0));
				return undefined;
			});
			set_SettingActiveSlideNoForHorizontalCarousel(2);
		}
	}, [category]);

	//custom functions-----------------------------------------------------------------------------------------

	const onCustomRadioInputChange = useCallback(function (
		setState: React.Dispatch<React.SetStateAction<number | undefined>>
	) {
		return (e: React.ChangeEvent) => {
			const radioIndex = Number(
				e.currentTarget.getAttribute("data-order")
			);

			setState((prev) => {
				//force change even when state value is the same
				if (prev === radioIndex) {
					queueMicrotask(() => setState(radioIndex));
					return undefined;
				}
				return radioIndex;
			});
		};
	},
	[]);

	const executeOnActiveSlide = useCallback(function (
		setDefaultCheckedRadio: React.Dispatch<React.SetStateAction<number>>
	) {
		return (currentlyActiveSlideNo: number) => {
			setDefaultCheckedRadio(currentlyActiveSlideNo);
		};
	},
	[]);

	// const getCarouselDotValueOnChange = (setState:React.Dispatch<React.SetStateAction<number>>) => {
	// 	return (e:React.ChangeEvent) => {
	// 		const ele = e.currentTarget as HTMLInputElement;
	// 		const activeVal = Number(ele.getAttribute("data-order"));
	// 		setState(activeVal);
	// 	};
	// }

	//----------------------------------------------------------------------------------------------------------

	return (
		<Carousel
			{...horizontalCarouselOptions}
			setActiveSlide={settingActiveSlideNoForHorizontalCarousel}
		>
			<div className="hzntl-carousel-container hzntl-carousel-container--woman-section">
				<Carousel
					{...verticalCarouselOptions}
					CarouselDots={{
						...verticalCarouselOptions.CarouselDots!,
						label: verticalCarouselDotsWithLabels.Woman,
					}}
					setActiveSlide={settingActiveSlideNoWOMAN}
					executeOnActiveSlide={executeOnActiveSlide(
						getCurrentlyActiveSlideNoWOMAN
					)}
				>
					<Video
						loop
						// poster={require("https://source.unsplash.random/300x300/?perfume,bottle")}
						dataDesktopLargeSrc={require("../../Video/WOMAN_NEW_desktop.mp4")}
						dataIpadPortraitSrc={require("../../Video/WOMAN_NEW_phone.mp4")}
					/>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_BASICS/WOMAN_BASICS_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_BASICS/WOMAN_BASICS_IMAGE-portrait-fill-ipad.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_BASICS/WOMAN_BASICS_IMAGE-landscape-1200px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/WOMAN/WOMAN_BASICS/WOMAN_BASICS_IMAGE-landscape-2400px.jpg")}
							alt="side profile of a woman standing"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_SHOES/WOMAN_SHOES_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_SHOES/WOMAN_SHOES_IMAGE-portrait-fill-ipad.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_SHOES/WOMAN_SHOES_IMAGE-landscape-1200px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/WOMAN/WOMAN_SHOES/WOMAN_SHOES_IMAGE-landscape-2400px.jpg")}
							alt="woman's sandal"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_SHIRTS/WOMAN_SHIRTS_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_SHIRTS/WOMAN_SHIRTS_IMAGE-portrait-fill-ipad.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/WOMAN/WOMAN_SHIRTS/WOMAN_SHIRTS_IMAGE-landscape-1200px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/WOMAN/WOMAN_SHIRTS/WOMAN_SHIRTS_IMAGE-landscape-2400px.jpg")}
							alt="woman's shirt"
						/>
					</picture>
					{verticalCarouselLastSlide}
				</Carousel>
				<RadioGroup
					// className="hzntl-carousel-container__radio-grp hzntl-carousel-container__radio-grp--woman-section"
					className={
						currentlyActiveSlideNoWOMAN ===
						verticalCarouselDotsWithLabels.Woman.length - 1
							? "hzntl-carousel-container__radio-grp--hidden"
							: "hzntl-carousel-container__radio-grp"
					}
					controlled={true}
					// onPointerDown={(e) => e.stopPropagation()}
					// onPointerMove={(e) => e.stopPropagation()}
					// onPointerUp={(e) => e.stopPropagation()}
					// onPointerLeave={(e) => e.stopPropagation()}
				>
					{verticalCarouselDotsWithLabels.Woman.map(
						(label, index) => (
							<RadioBtn
								className="hzntl-carousel-container__radio-grp__radio"
								labelName={label}
								noDots={true}
								// dataOrder={index}
								key={index}
								checked={currentlyActiveSlideNoWOMAN === index}
								onChange={onCustomRadioInputChange(
									set_SettingActiveSlideNoWOMAN
								)}
							/>
						)
					)}
				</RadioGroup>
			</div>
			<div className="hzntl-carousel-container hzntl-carousel-container--man-section">
				<Carousel
					{...verticalCarouselOptions}
					CarouselDots={{
						...verticalCarouselOptions.CarouselDots!,
						label: verticalCarouselDotsWithLabels.Man,
					}}
					setActiveSlide={settingActiveSlideNoMAN}
					executeOnActiveSlide={executeOnActiveSlide(
						getCurrentlyActiveSlideNoMAN
					)}
				>
					<Video
						loop
						dataDesktopMedSrc={require("../../Video/MAN_NEW_landscape-768px.mp4")}
						dataDesktopLargeSrc={require("../../Video/MAN_NEW_landscape-1024px.mp4")}
						dataPhonePortraitSrc={require("../../Video/MAN_NEW_portrait-phone.mp4")}
						dataIpadPortraitSrc={require("../../Video/MAN_NEW_portrait-ipad.mp4")}
					/>
					<Video
						loop
						dataDesktopMedSrc={require("../../Video/MAN_ZARA_ATHLETICZ_landscape-1200px.mp4")}
						dataDesktopLargeSrc={require("../../Video/MAN_ZARA_ATHLETICZ_landscape-2400px.mp4")}
						dataPhonePortraitSrc={require("../../Video/MAN_ZARA_ATHLETICZ_portrait-phone.mp4")}
						dataIpadPortraitSrc={require("../../Video/MAN_ZARA_ATHLETICZ_portrait-ipad.mp4")}
					/>
					{verticalCarouselLastSlide}
				</Carousel>
				<RadioGroup
					className={
						currentlyActiveSlideNoMAN ===
						verticalCarouselDotsWithLabels.Man.length - 1
							? "hzntl-carousel-container__radio-grp--hidden"
							: "hzntl-carousel-container__radio-grp"
					}
					controlled={true}
				>
					{verticalCarouselDotsWithLabels.Man.map((label, index) => (
						<RadioBtn
							className="hzntl-carousel-container__radio-grp__radio"
							labelName={label}
							noDots={true}
							// dataOrder={index}
							checked={currentlyActiveSlideNoMAN === index}
							key={index}
							onChange={onCustomRadioInputChange(
								set_SettingActiveSlideNoMAN
							)}
						/>
					))}
				</RadioGroup>
			</div>
			<div className="hzntl-carousel-container hzntl-carousel-container--kids-section">
				<Carousel
					{...verticalCarouselOptions}
					CarouselDots={{
						...verticalCarouselOptions.CarouselDots!,
						label: verticalCarouselDotsWithLabels.Kids,
					}}
					setActiveSlide={settingActiveSlideNoKIDS}
					executeOnActiveSlide={executeOnActiveSlide(
						getCurrentlyActiveSlideNoKIDS
					)}
				>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BACK_TO_SCHOOL/KIDS_BACK_TO_SCHOOL_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BACK_TO_SCHOOL/KIDS_BACK_TO_SCHOOL_IMAGE-portrait-ipad-fill.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BACK_TO_SCHOOL/KIDS_BACK_TO_SCHOOL_IMAGE-landscape-fill-1024px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/KIDS/KIDS_BACK_TO_SCHOOL/KIDS_BACK_TO_SCHOOL_IMAGE-landscape-fill-2400px.jpg")}
							alt="kids back to school"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_GIRL/KIDS_GIRL_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_GIRL/KIDS_GIRL_IMAGE-portrait-ipad-fill.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_GIRL/KIDS_GIRL_IMAGE-landscape-fill-1024px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/KIDS/KIDS_GIRL/KIDS_GIRL_IMAGE-landscape-fill-2400px.jpg")}
							alt="A young girl posing"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BABY_GIRL/KIDS_BABY_GIRL_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BABY_GIRL/KIDS_BABY_GIRL_IMAGE-portrait-fill-ipad.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BABY_GIRL/KIDS_BABY_GIRL_IMAGE-landscape-fill-1200px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/KIDS/KIDS_BABY_GIRL/KIDS_BABY_GIRL_IMAGE-landscape-fill-2400px.jpg")}
							alt="A baby girl posing"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BABY_BOY/KIDS_BABY_BOY_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BABY_BOY/KIDS_BABY_BOY_IMAGE-portrait-ipad-fill.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_BABY_BOY/KIDS_BABY_BOY_IMAGE-landscape-fill-1200px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/KIDS/KIDS_BABY_BOY/KIDS_BABY_BOY_IMAGE-landscape-fill-2400px.jpg")}
							alt="A baby girl posing"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_MINI/KIDS_MINI_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_MINI/KIDS_MINI_IMAGE-portrait-ipad-fill.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_MINI/KIDS_MINI_IMAGE-landscape-fill-1024px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/KIDS/KIDS_MINI/KIDS_MINI_IMAGE-landscape-fill-2400px.jpg")}
							alt="mother holding baby"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_ACCESSORIES/KIDS_ACCESSORIES_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_ACCESSORIES/KIDS_ACCESSORIES_IMAGE-portrait-ipad-fill.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_ACCESSORIES/KIDS_ACCESSORIES_IMAGE-landscape-fill-1024px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/KIDS/KIDS_ACCESSORIES/KIDS_ACCESSORIES_IMAGE-landscape-fill-2400px.jpg")}
							alt="young girl standing in front of a swimming pool"
						/>
					</picture>
					<picture>
						<source
							media="(max-width: 480px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_JOIN_LIFE/KIDS_JOIN_LIFE_IMAGE-portrait-fill-phone.jpg")}
						/>
						<source
							media="(max-width: 768px) and (orientation: portrait)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_JOIN_LIFE/KIDS_JOIN_LIFE_IMAGE-portrait-ipad-fill.jpg")}
						/>
						<source
							media="(max-width: 1024px)"
							srcSet={require("../../Images/Home_pg/KIDS/KIDS_JOIN_LIFE/KIDS_JOIN_LIFE_IMAGE-landscape-fill-1024px.jpg")}
						/>
						<img
							src={require("../../Images/Home_pg/KIDS/KIDS_JOIN_LIFE/KIDS_JOIN_LIFE_IMAGE-landscape-fill-2400px.jpg")}
							alt="young girl wearing a kimono"
						/>
					</picture>
					{verticalCarouselLastSlide}
				</Carousel>
				<RadioGroup
					className={
						currentlyActiveSlideNoKIDS ===
						verticalCarouselDotsWithLabels.Kids.length - 1
							? "hzntl-carousel-container__radio-grp--hidden"
							: "hzntl-carousel-container__radio-grp"
					}
					controlled={true}
				>
					{verticalCarouselDotsWithLabels.Kids.map((label, index) => (
						<RadioBtn
							className="hzntl-carousel-container__radio-grp__radio"
							labelName={label}
							noDots={true}
							// dataOrder={index}
							checked={currentlyActiveSlideNoKIDS === index}
							key={index}
							onChange={onCustomRadioInputChange(
								set_SettingActiveSlideNoKIDS
							)}
						/>
					))}
				</RadioGroup>
			</div>
		</Carousel>
	);
};

export default Home;
