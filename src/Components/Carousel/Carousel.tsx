import React, {
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import CssStyles from "./Carousel.module.css";
import RadioGroup from "../RadioBtn/RadioGroup";
import RadioBtn from "../RadioBtn/RadioBtn";
import useIntersectionObserver from "../../Hooks/useIntersectionObserver";
import usePrevious from "../../Hooks/usePrevious";

//types--------------------------------------------------------------
type VerticalAlignment = "top" | "bottom";
type HorizontalAlignment = "left" | "right";
type VerticalOrHorizontal = "vertical" | "horizontal";
export type CarouselDotsContainerPositionType =
	| `${VerticalAlignment}-${HorizontalAlignment}-${VerticalOrHorizontal}`
	| `${VerticalAlignment}-centre`;

export interface CarouselOptionsType {
	CarouselContainerStyles?: React.CSSProperties; //container of the slides track, different from slidesContainer
	CarouselArrows?: {
		isTrue: boolean;
		label?: string[];
	};
	CarouselDots?: {
		isTrue: boolean;
		CarouselDotsContainerPosition?: CarouselDotsContainerPositionType;
		CarouselDotsContainerStyles?: React.CSSProperties;
		AutoHideAfterTransition?: boolean;
		// CarouselDotsElement?: typeof RadioGroup;
		label?: string[];
	};
	AnimateOnWheelEvent?: boolean;
	isVertical?: boolean;
	isInfiniteLoop?: boolean;
	NoOfSlidesInView?: number;
	GapBetweenSlides?: string;
	AnimationOptions?: {
		TimingFunction?: string;
		AnimationDuration: number;
		AnimationDelay?: number;
		AnimationType?: "standard" | "stack";
	};
	AutoSlideChange?: {
		isTrue: boolean;
		timer: number;
		// isPaused?: boolean;
	};
	setActiveSlide?: number;
	executeOnActiveSlide?: (ActiveSlide: number) => void;
}

// type primitives = string | number | boolean | null | undefined;
interface CarouselPropsType extends CarouselOptionsType {
	children: React.ReactElement<React.HTMLAttributes<HTMLOrSVGElement>>;
	// Exclude<React.ReactNode, primitives>;
}

//component----------------------------------------------------------------
function Carousel({
	CarouselContainerStyles,
	CarouselArrows = {
		isTrue: true,
	},
	CarouselDots = {
		isTrue: true,
		AutoHideAfterTransition: false,
		CarouselDotsContainerPosition: "bottom-centre",
	},
	AnimateOnWheelEvent = false,
	isVertical = false,
	isInfiniteLoop = true,
	NoOfSlidesInView = 1,
	GapBetweenSlides = "0px",
	AnimationOptions,
	AutoSlideChange = { isTrue: false, timer: 0 },
	setActiveSlide,
	executeOnActiveSlide,
	children,
}: CarouselPropsType) {
	//if button label is defined, check
	//if label is equal to no of children
	if (
		CarouselArrows.label &&
		CarouselArrows.label.length !== React.Children.toArray(children).length
	) {
		throw new Error(
			"Number of button labels should be equal to the number of child elements"
		);
	}
	//if Carousel Dots label is defined, check
	//if label is equal to no of children
	if (
		CarouselDots.label &&
		CarouselDots.label.length !== React.Children.toArray(children).length
	) {
		throw new Error(
			"Number of Carousel Dot labels should be equal to the number of child elements"
		);
	}
	//function to return
	//carousel container styles
	const setCarouselContainerStyles = () => {
		if (CarouselContainerStyles) {
			return {
				...CarouselContainerStyles,
			};
		} else {
			return {};
		}
	};

	//function to configure
	//slides container styles
	const setSlidesContainerStyles = () => {
		//setting css variables
		const styleObj: React.CSSProperties = {
			"--grid-items-in-view": NoOfSlidesInView,
			"--grid-gap": GapBetweenSlides,
		} as React.CSSProperties;

		//setting up Carousel direction
		if (isVertical) {
			return {
				...styleObj,
				gridAutoFlow: "row",
				gridAutoColumns: "100%",
			} as React.CSSProperties;
		} else {
			return {
				...styleObj,
				gridAutoFlow: "column",
				gridAutoRows: "100%",
			} as React.CSSProperties;
		}
	};

	//configure styles for
	//carousel dots container
	const setCarouselDotsContainerStyles = () => {
		if (!CarouselDots.isTrue) {
			return {};
		} else if (CarouselDots.CarouselDotsContainerPosition) {
			let stylesObj: {
				[index: string]: string | { [index: string]: string };
			} = {
				top: "initial",
				right: "initial",
				bottom: "initial",
				left: "initial",
				transformOrigin: "initial",
				transform: "initial",
			};

			switch (CarouselDots.CarouselDotsContainerPosition) {
				case "top-left-vertical": {
					stylesObj = {
						...stylesObj,
						top: "0",
						left: "0",
						transformOrigin: "left center",
						transform: "rotateZ(90deg)",
						marginBlock: "7.5rem",
					};
					break;
				}
				case "top-left-horizontal": {
					stylesObj = {
						...stylesObj,
						top: "0",
						left: "0",
					};
					break;
				}
				case "top-centre": {
					stylesObj = {
						...stylesObj,
						top: "0",
						left: "50%",
						transform: "translateX(-50%)",
					};
					break;
				}
				case "top-right-horizontal": {
					stylesObj = {
						...stylesObj,
						top: "0",
						right: "0",
					};
					break;
				}
				case "top-right-vertical": {
					stylesObj = {
						...stylesObj,
						top: "0",
						right: "0",
						transformOrigin: "right center",
						transform: "rotateZ(-90deg)",
						marginBlock: "7.5rem",
					};
					break;
				}
				case "bottom-left-vertical": {
					stylesObj = {
						...stylesObj,
						bottom: "0",
						left: "0",
						transformOrigin: "left center",
						transform: "rotateZ(-90deg)",
						marginBlock: "7.5rem",
					};
					break;
				}
				case "bottom-left-horizontal": {
					stylesObj = {
						...stylesObj,
						bottom: "0",
						left: "0",
					};
					break;
				}
				case "bottom-centre": {
					stylesObj = {
						...stylesObj,
						bottom: "0",
						left: "50%",
						transform: "translateX(-50%)",
					};
					break;
				}
				case "bottom-right-horizontal": {
					stylesObj = {
						...stylesObj,
						bottom: "0",
						right: "0",
					};
					break;
				}
				case "bottom-right-vertical": {
					stylesObj = {
						...stylesObj,
						transformOrigin: "right center",
						transform: "rotateZ(90deg)",
						bottom: "0",
						right: "0",
						marginBlock: "7.5rem",
					};
					break;
				}

				default:
					throw new Error(
						"Invalid parameter value: " +
							CarouselDots.CarouselDotsContainerPosition
					);
				// break;
			}

			return stylesObj;
		} else if (CarouselDots.CarouselDotsContainerStyles) {
			return CarouselDots.CarouselDotsContainerStyles;
		}

		return {};
	};

	//configure Carousel Dots
	//Label styles if labels are defined
	const setCarouselDotsLabelStyles = () => {
		if (
			CarouselDots.CarouselDotsContainerPosition ===
			"bottom-left-vertical"
		) {
			return {
				order: "1",
				transform: "rotateZ(180deg)",
			};
		} else if (
			CarouselDots.CarouselDotsContainerPosition ===
			"bottom-right-vertical"
		) {
			return {
				transform: "rotateZ(180deg)",
			};
		}

		return {};
	};

	function settingAnimationOptions() {
		const duration = AnimationOptions?.AnimationDuration
			? AnimationOptions.AnimationDuration
			: 850;
		const easing = AnimationOptions?.TimingFunction
			? AnimationOptions.TimingFunction
			: "cubic-bezier(0.6, 0.86, 0.5, 0.98)";
		const delay = AnimationOptions?.AnimationDelay
			? AnimationOptions.AnimationDelay
			: 0;

		return {
			duration,
			easing,
			delay,
		};
	}

	//state variables------------------------------------------------------

	const [carouselContainerStyles] = useState<React.CSSProperties>(
		setCarouselContainerStyles
	);
	const [slidesContainerStyles] = useState<React.CSSProperties>(
		setSlidesContainerStyles
	);
	const slidesContainerRef = useRef<HTMLDivElement>(null);
	const transitionSlidesOnChangingSlideNoAnimation = useRef<
		Animation | undefined
	>();
	const carouselAnimationOptions = useRef(settingAnimationOptions());
	// const [
	// 	transitionSlidesOnPointerMoveAnimation,
	// 	setTransitionSlidesOnPointerMoveAnimation,
	// ] = useState<Animation | undefined>();
	const [isSlidesContainerVisible, CarouselContainerRef] =
		useIntersectionObserver<HTMLElement>({ threshold: 0.7 });
	const CarouselDotsRadioGroupRef = useRef<HTMLDivElement>(null);
	const CarouselDotsContainerRef = useRef<HTMLDivElement>(null);
	const [CarouselDotsContainerStyles] = useState<React.CSSProperties>(
		setCarouselDotsContainerStyles
	);
	const [CarouselDotsLabelStyles] = useState<React.CSSProperties>(
		setCarouselDotsLabelStyles
	);
	const [slideNo, setSlideNo] = useState<number>(0);
	const prevSlideNo = usePrevious(slideNo);
	const gapBetweenSlidesInPixels = useRef<number>(0);
	const [autoSlideChangeIsPaused, setAutoSlideChangeIsPaused] = useState<
		boolean | null
	>(() => {
		if (AutoSlideChange.isTrue && isInfiniteLoop) return false;
		return true;
	});
	const [mediaQuery, setMediaQuery] = useState<boolean>(
		window.matchMedia("(min-width: 768px)").matches
	);

	//---------------------------------------------------------------------

	const childrenWithStyleProp = useMemo(
		function addStylePropsToChildren() {
			return React.Children.map(children, (child, index) => {
				//check if each child is a
				//valid JSX element
				if (React.isValidElement(child)) {
					//store existing classes if any so
					// that they can be included and not overwritten
					let existingClasses: string;
					child.props.className
						? (existingClasses = child.props.className)
						: (existingClasses = "");
					//if child is a picture tag
					//then map through its children and
					//add styles to img element child
					if (
						child.type === "picture" ||
						(child.type === "a" &&
							child.props.children !== undefined)
					) {
						const grandchildren = React.Children.map(
							child.props.children as React.ReactElement<
								React.HTMLAttributes<
									HTMLSourceElement | HTMLImageElement
								>
							>,
							(grandChild) => {
								//if child of picture element is
								//an img tag then add styles
								if (grandChild.type === "img") {
									//store existing classes
									let existingGrandChildClasses: string;
									grandChild.props.className
										? (existingGrandChildClasses =
												grandChild.props.className)
										: (existingGrandChildClasses = "");
									//if classes exist then include them
									// else don't include them in the className prop
									return React.cloneElement(grandChild, {
										// "data-carousel-optimized": true,
										className: existingGrandChildClasses
											? `${existingGrandChildClasses} ${CssStyles["slide-media-img"]}`
											: CssStyles["slide-media-img"],
										draggable: "false",
									});
								} else {
									return grandChild;
								}
							}
						);
						//return picture element with
						// new children
						return React.cloneElement(
							child,
							undefined,
							grandchildren
						);
						//if child is an img
						//element then add img specific styles
					} else if (child.type === "img") {
						//if classes exist then include them
						//else don't include them
						return React.cloneElement(child, {
							// "data-carousel-optimized": true,
							className: existingClasses
								? `${existingClasses} ${CssStyles["slide-media-img"]}`
								: CssStyles["slide-media-img"],
							draggable: "false",
						});
						//if child is a video
						//element then add video specific styles
					} else if (
						child.type === "video" ||
						(typeof child.type === "function" &&
							child.type.name === "Video")
					) {
						//if classes exist then include them
						//else don't include classes
						return React.cloneElement(child, {
							// "data-carousel-optimized": true,
							className: existingClasses
								? `${existingClasses} ${CssStyles["slide-media-video"]}`
								: CssStyles["slide-media-video"],
							draggable: "false",
						});
					} else {
						//else add generic slide styles
						//if classes exist then include them
						//else don't include classes
						return React.cloneElement(child, {
							// "data-carousel-optimized": true,
							className: existingClasses
								? `${existingClasses} ${CssStyles.slide}`
								: CssStyles.slide,
							draggable: "false",
						});
					}
				} else {
					throw new Error(
						`Child at index ${index} of children is not a JSX element. Only JSX elements can be passed as children.`
					);
				}
			});
		},
		[children]
	) as React.ReactElement[];

	//function to transition slides
	const changeSlide = useCallback(
		(slideNo: number) => {
			if (
				!transitionSlidesOnChangingSlideNoAnimation ||
				!slidesContainerRef.current
			)
				return;

			const slidesContainer = slidesContainerRef.current;
			const slideDimensions = (
				slidesContainer.firstElementChild as HTMLElement
			).getBoundingClientRect();
			//if isVertical --> slideHeight else slideWidth
			let slideWidthOrHeight: number;
			isVertical
				? (slideWidthOrHeight = slideDimensions.height)
				: (slideWidthOrHeight = slideDimensions.width);

			const stackAnimationTrue =
				AnimationOptions?.AnimationType === "stack";
			// const transformBy = 100 * slideNo; //percentage
			let transformBy: number;
			if (stackAnimationTrue) {
				transformBy = 100 * slideNo; // percentage
			} else {
				transformBy =
					(slideWidthOrHeight + gapBetweenSlidesInPixels.current) *
					slideNo;
			}

			const timingOptions = {
				...carouselAnimationOptions.current,
				fill: "forwards",
			} as KeyframeAnimationOptions;

			//get previously translated value and store it in a matrix
			//transformX value = matrix.e, transformY value = matrix.f
			let matrix = new DOMMatrix(
				getComputedStyle(slidesContainer).transform
			);

			//setting up carousel dots animation if specified
			let carouselDotsContainerAnimation: null | Animation = null;
			if (CarouselDots.AutoHideAfterTransition) {
				carouselDotsContainerAnimation =
					CarouselDotsContainerRef.current
						? CarouselDotsContainerRef.current.animate(
								{
									opacity: [0, 1, 1, 0],
									offset: [0, 0.3, 0.6, 1],
								},
								{
									duration:
										carouselAnimationOptions.current
											.duration,
									fill: "both",
								}
						  )
						: null;
			}

			if (carouselDotsContainerAnimation)
				carouselDotsContainerAnimation.pause();

			// function onSlideTransitionFinish() {
			// 	transitionSlidesOnChangingSlideNoAnimation.current?.commitStyles();
			// 	transitionSlidesOnChangingSlideNoAnimation.current?.cancel();
			// 	transitionSlidesOnChangingSlideNoAnimation.current = undefined;
			// 	// console.log("anim fin");
			// }

			let firstToLast = false;
			let lastToFirst = false;
			// if (isVertical) {
			let slides: HTMLElement[];
			if (stackAnimationTrue) {
				slides = Array.from(slidesContainer.children) as HTMLElement[];

				const lastSlideNo = slides.length;

				if (
					isInfiniteLoop &&
					(prevSlideNo.current === -1 || prevSlideNo.current === 0) &&
					slideNo === lastSlideNo
				) {
					firstToLast = true;
					for (let index in slides) {
						if (index === "0") {
							slides[index].style.zIndex = "10";
							continue;
						}
						if (index === String(lastSlideNo - 1)) {
							slides[index].style.transform = isVertical
								? "translateY(0)"
								: "translateX(0)";
						} else {
							slides[index].style.transform = isVertical
								? "translateY(100%)"
								: "translateX(100%)";
							// slides[index].style.zIndex = "10";
						}
					}

					transitionSlidesOnChangingSlideNoAnimation.current =
						slides[0].animate(
							{
								transform: [
									"translateY(0)",
									"translateY(100%)",
								],
							},
							timingOptions
						);
				} else if (
					isInfiniteLoop &&
					prevSlideNo.current === lastSlideNo &&
					slideNo === 0
				) {
					lastToFirst = true;
					for (let index in slides) {
						if (index === String(lastSlideNo - 1)) continue;
						if (index === "0") slides[index].style.zIndex = "10";
						slides[index].style.transform = isVertical
							? "translateY(100%)"
							: "translateX(100%)";
					}

					transitionSlidesOnChangingSlideNoAnimation.current =
						slides[0].animate({
							transform: isVertical
								? ["translateY(100%)", "translateY(0)"]
								: ["translateX(100%)", "translateX(0)"],
						});
				} else if (
					// prevSlideNo.current === -1 ||
					prevSlideNo.current < slideNo
				) {
					let count = 0;
					const timer = Number(timingOptions.duration) ?? 850;
					const promisedAnim = (
						timer: number,
						index: number,
						prevTranslatedAmount: number | string = "100%"
					) =>
						new Promise((res) => {
							// res(
							setTimeout(() => {
								res(
									(() => {
										transitionSlidesOnChangingSlideNoAnimation.current =
											slides[index].animate(
												{
													transform: isVertical
														? [
																typeof prevTranslatedAmount ===
																"number"
																	? `translateY(${prevTranslatedAmount}px)`
																	: `translateY(${prevTranslatedAmount})`,
																`translateY(0)`,
														  ]
														: [
																typeof prevTranslatedAmount ===
																"number"
																	? `translateX(${prevTranslatedAmount}px)`
																	: `translateX(${prevTranslatedAmount})`,
																`translateX(0)`,
														  ],
												},
												timingOptions
											);
									})()
								);
							}, timer);
						});
					// );
					// });
					// eslint-disable-next-line no-inner-declarations
					async function executeAnim() {
						// cache prevSLideNo value for the if check
						//in the for loop
						const prevSlideNoForCurrentIteration =
							prevSlideNo.current;
						for (
							let i =
								prevSlideNo.current === -1
									? 0
									: prevSlideNo.current + 1;
							i <= slideNo;
							i++
						) {
							if (
								i === 0 ||
								i === prevSlideNoForCurrentIteration + 1
							) {
								let prevTranslatedAmount = new DOMMatrix(
									getComputedStyle(slides[i]).transform
								);
								const prevTranslatedAmountX =
									prevTranslatedAmount.e;
								const prevTranslatedAmountY =
									prevTranslatedAmount.f;
								await promisedAnim(
									count * timer,
									i,
									isVertical
										? prevTranslatedAmountY
										: prevTranslatedAmountX
								);
							} else {
								await promisedAnim(count * timer, i);
							}
							count++;
						}
					}

					executeAnim();
				} else {
					let count = 0;
					const timer = Number(timingOptions.duration) ?? 850;
					const promisedAnim = (
						timer: number,
						index: number,
						prevTranslatedAmount: number | string = "0%"
					) =>
						new Promise((res) => {
							// res(
							setTimeout(() => {
								res(
									(() => {
										transitionSlidesOnChangingSlideNoAnimation.current =
											slides[index].animate(
												{
													transform: isVertical
														? [
																typeof prevTranslatedAmount ===
																"number"
																	? `translateY(${prevTranslatedAmount}px)`
																	: `translateY(${prevTranslatedAmount})`,
																`translateY(100%)`,
														  ]
														: [
																typeof prevTranslatedAmount ===
																"number"
																	? `translateX(${prevTranslatedAmount}px)`
																	: `translateX(${prevTranslatedAmount})`,
																`translateX(100%)`,
														  ],
												},
												timingOptions
											);
									})()
								);
							}, timer);
						});
					// eslint-disable-next-line no-inner-declarations
					async function executeAnim() {
						// cache prevSLideNo value for the if check
						//in the for loop
						const prevSlideNoForCurrentIteration =
							prevSlideNo.current;
						for (
							let i =
								prevSlideNo.current === -1
									? 0
									: prevSlideNo.current;
							i > slideNo;
							i--
						) {
							if (
								i === 0 ||
								i === prevSlideNoForCurrentIteration
							) {
								let prevTranslatedAmount = new DOMMatrix(
									getComputedStyle(slides[i]).transform
								);
								const prevTranslatedAmountX =
									prevTranslatedAmount.e;
								const prevTranslatedAmountY =
									prevTranslatedAmount.f;
								await promisedAnim(
									count * timer,
									i,
									isVertical
										? prevTranslatedAmountY
										: prevTranslatedAmountX
								);
							} else {
								await promisedAnim(count * timer, i);
							}
							// if (
							// 	transitionSlidesOnChangingSlideNoAnimation.current
							// )
							// 	transitionSlidesOnChangingSlideNoAnimation.current.onfinish =
							// 		onSlideTransitionFinish;
							count++;
						}
					}
					executeAnim();
				}
			} else {
				transitionSlidesOnChangingSlideNoAnimation.current =
					slidesContainer.animate(
						{
							transform: isVertical
								? [
										`translate(${matrix.e}px,${matrix.f}px)`,
										`translate(0,-${transformBy}px)`,
								  ]
								: [
										`translate(${matrix.e}px,${matrix.f}px)`,
										`translate(-${transformBy}px,0)`,
								  ],
						},
						timingOptions
					);
			}

			//commit styles of last frame and remove animation (cancel method)
			//on finish to prevent racking up unnecessary animation instances
			// transitionSlidesOnChangingSlideNoAnimation.current.onfinish =
			// 	function onAnimationEnd() {
			// 		transitionSlidesOnChangingSlideNoAnimation.current?.commitStyles();
			// 		transitionSlidesOnChangingSlideNoAnimation.current?.cancel();
			// 	};

			if (!carouselDotsContainerAnimation) {
				return;
			}

			carouselDotsContainerAnimation.play();

			if (!transitionSlidesOnChangingSlideNoAnimation.current) return;

			//commit styles of last frame and remove animation (cancel method)
			//on finish to prevent racking up unnecessary animation instances
			transitionSlidesOnChangingSlideNoAnimation.current.onfinish =
				function onAnimationEnd() {
					transitionSlidesOnChangingSlideNoAnimation.current?.commitStyles();
					transitionSlidesOnChangingSlideNoAnimation.current?.cancel();
					if (firstToLast || lastToFirst) {
						const firstSlide =
							slidesContainer.firstElementChild as HTMLElement;
						if (firstToLast) {
							firstSlide.style.transform = "";
						}
						if (lastToFirst) {
							const lastSlide =
								slidesContainer.lastElementChild as HTMLElement;
							lastSlide.style.transform = isVertical
								? "translateY(100%)"
								: "translateX(100%)";
						}
						firstSlide.style.zIndex = "";
						firstToLast
							? (firstToLast = false)
							: (lastToFirst = false);
					}
				};
		},
		[
			AnimationOptions?.AnimationType,
			CarouselDots.AutoHideAfterTransition,
			isInfiniteLoop,
			isVertical,
			prevSlideNo,
		]
	);

	//function to change slideNo
	const IncrementOrDecrementSlideNo = useCallback(
		(incOrDec: "increment" | "decrement") => {
			//pause auto transitions on user input
			if (AutoSlideChange.isTrue && isInfiniteLoop) {
				setAutoSlideChangeIsPaused(true);
			}

			if (incOrDec === "increment") {
				setSlideNo((currSlideNo) => {
					if (
						currSlideNo ===
						childrenWithStyleProp.length - NoOfSlidesInView
					) {
						if (isInfiniteLoop) {
							return 0;
						} else {
							//returning the same value isn't going to
							//trigger a re-render,hence I'm calling the
							//changeSlide function inline
							changeSlide(currSlideNo);
							return currSlideNo;
						}
					} else {
						return currSlideNo + 1;
					}
				});
			} else {
				setSlideNo((currSlideNo) => {
					if (currSlideNo === 0) {
						if (isInfiniteLoop) {
							return (
								childrenWithStyleProp.length - NoOfSlidesInView
							);
						} else {
							//same as above
							changeSlide(currSlideNo);
							return currSlideNo;
						}
					} else {
						return currSlideNo - 1;
					}
				});
			}
		},
		[
			AutoSlideChange.isTrue,
			NoOfSlidesInView,
			changeSlide,
			childrenWithStyleProp.length,
			isInfiniteLoop,
		]
	);

	//pausing/playing auto transitions
	const settingAutoSlideChangePause = useCallback(
		(boolean: boolean) => {
			if (AutoSlideChange.isTrue && isInfiniteLoop) {
				setAutoSlideChangeIsPaused(boolean);
			}
		},
		[AutoSlideChange.isTrue, isInfiniteLoop]
	);

	//defining radio btn event handler
	const handleClickOnCarouselDots = useCallback(
		(e: React.ChangeEvent) => {
			setSlideNo(Number(e.currentTarget.getAttribute("data-order")));
			settingAutoSlideChangePause(true);
		},
		[settingAutoSlideChangePause]
	);

	//useLayoutEffects------------------------------------------------------------------------------

	//arrange slides in a stack if AnimationOptions.AnimationType === stack
	useLayoutEffect(() => {
		if (AnimationOptions?.AnimationType !== "stack") return;

		const slidesContainer = slidesContainerRef.current as HTMLDivElement;
		const slides = Array.from(slidesContainer.children) as HTMLElement[];
		for (let index in slides) {
			if (index === "0") continue;
			slides[index].style.transform = isVertical
				? "translateY(100%)"
				: "translateX(100%)";
		}
	}, [AnimationOptions?.AnimationType, isVertical]);

	//change slide whenever slideNo changes
	useLayoutEffect(() => {
		if (!slidesContainerRef.current) return;

		if (GapBetweenSlides !== "0px") {
			const slides = Array.from(slidesContainerRef.current.children);
			const slide1Dimensions = slides[0].getBoundingClientRect();
			const slide2Dimensions = slides[1].getBoundingClientRect();
			isVertical
				? (gapBetweenSlidesInPixels.current = Math.abs(
						slide1Dimensions.top +
							slide1Dimensions.height -
							slide2Dimensions.top
				  ))
				: (gapBetweenSlidesInPixels.current = Math.abs(
						slide1Dimensions.left +
							slide1Dimensions.width -
							slide2Dimensions.left
				  ));
		}

		changeSlide(slideNo);
	}, [GapBetweenSlides, changeSlide, isVertical, slideNo]);

	//useEffects------------------------------------------------------------------------------------

	//media query for dots container styles
	useEffect(() => {
		const mediaQueryFunc = (e: MediaQueryListEvent) => {
			if (e.matches) {
				setMediaQuery(e.matches);
			}
		};

		window
			.matchMedia("(min-width: 768px)")
			.addEventListener("change", mediaQueryFunc);

		return () => {
			window
				.matchMedia("(min-width: 768px)")
				.removeEventListener("change", mediaQueryFunc);
		};
	}, []);

	//changing dots container styles based on
	//media query
	useEffect(() => {
		if (
			!CarouselDotsContainerRef.current &&
			!CarouselDots.CarouselDotsContainerPosition
		)
			return;

		const dotsContainer =
			CarouselDotsContainerRef.current as HTMLDivElement;
		const pos = CarouselDots.CarouselDotsContainerPosition;
		if (mediaQuery) {
			if (
				pos === "top-left-vertical" ||
				pos === "top-right-vertical" ||
				pos === "bottom-left-vertical" ||
				pos === "bottom-right-vertical"
			) {
				dotsContainer.style.marginBlock = "2rem";
			} else {
				dotsContainer.style.marginInline = "2rem";
			}
		}
	}, [CarouselDots.CarouselDotsContainerPosition, mediaQuery]);

	//configuring auto transition behavior when
	//carousel isn't visible
	useEffect(() => {
		if (!AutoSlideChange.isTrue || !isInfiniteLoop) return;

		// console.log("isVisible: " + isSlidesContainerVisible);

		if (isSlidesContainerVisible) {
			setAutoSlideChangeIsPaused(false);
		} else {
			setAutoSlideChangeIsPaused(true);
		}
	}, [AutoSlideChange.isTrue, isInfiniteLoop, isSlidesContainerVisible]);

	//configuring touch/pointer events
	useEffect(() => {
		if (!slidesContainerRef.current) return;

		// for AnimationOptions.AnimationType = standard
		const slidesContainer = slidesContainerRef.current;
		// for AnimationOptions.AnimationType = stack
		let slideToAnimate: HTMLElement | null = null;
		let startPosX: number;
		let startPosY: number;
		let firstInstance = true;
		let secondInstance = false;
		let prevTranslatedAmount: DOMMatrix;
		let prevY: number;
		let prevX: number;
		let timingOptions = {
			duration: 300,
			fill: "forwards",
		} as KeyframeAnimationOptions;

		let animation: Animation;
		let moveDirectionAxis: "x" | "y";
		let moveDirection: "up" | "down" | "left" | "right";

		let shouldExecute = false;

		const HandlePointerDown = (e: PointerEvent) => {
			//check if button currently being clicked is
			//left mouse or touch contact or pen contact
			if (e.buttons !== 1) {
				return;
			}

			prevTranslatedAmount = new DOMMatrix(
				getComputedStyle(slidesContainer).transform
			);

			prevX = prevTranslatedAmount.e;
			prevY = prevTranslatedAmount.f;

			startPosX = e.clientX;
			startPosY = e.clientY;
		};

		function HandlePointerMove(e: PointerEvent) {
			//check if button currently being clicked is
			//left mouse or touch contact or pen contact
			// IMP TO CHECK!!!!!!!!!!!!!!!!!!!
			if (e.buttons !== 1) {
				// slidesContainer.style.cursor = "initial";
				return;
			}

			//capture target to allow for the event to fire even
			//after the cursor has left the elements bounds
			slidesContainer.setPointerCapture(e.pointerId);

			if (shouldExecute) {
				//delete the animation instance on next invocation so
				//as to avoid racking up many instances
				if (animation) {
					animation.finish();
					animation.cancel();
				}
				let diff: number;
				let translateAmount: number;
				if (moveDirectionAxis === "x") {
					//only read movement along the x-axis
					diff = startPosX - e.clientX;

					if (diff > 0) {
						//diff > 0 --> movement towards the left
						//slides should move towards the left ie. value should be negative
						//if carousel is horizontal --> don't translate vertically
						!isVertical
							? (translateAmount =
									prevTranslatedAmount.e - Math.abs(diff))
							: (translateAmount = 0);
					} else {
						//diff < 0 --> movement towards the right
						//slides should move towards the right ie. value should be
						//positive or less negative (prevTranslatedValue is always negative unless slideNo === 0)
						//if carousel is horizontal --> don't translate vertically
						//Eg - prevTranslatedAmount = -300px, diff = -50px
						//translateAmount = -300 + 50 = -250 --> container moves towards the right
						!isVertical
							? (translateAmount =
									prevTranslatedAmount.e + Math.abs(diff))
							: (translateAmount = 0);
					}

					const keyframesObject = {
						//only animate in the direction the user is dragging the slides
						transform: [
							`translate(${prevX}px,${prevY}px)`,
							`translate(${translateAmount}px,${prevY}px)`,
						],
					} as PropertyIndexedKeyframes;

					if (slideToAnimate) {
						animation = (slideToAnimate as HTMLElement).animate(
							keyframesObject,
							timingOptions
						);
					} else {
						animation = slidesContainer.animate(
							keyframesObject,
							timingOptions
						);
					}

					prevX = translateAmount;
				} else {
					//only read movement along the y-axis
					diff = startPosY - e.clientY;

					if (diff > 0) {
						//diff > 0 --> movement towards the bottom
						//slides should move towards the bottom ie. value should be positive
						//if carousel is vertical --> don't translate horizontally
						isVertical
							? (translateAmount =
									prevTranslatedAmount.f - Math.abs(diff))
							: (translateAmount = 0);
					} else {
						//diff < 0 --> movement towards the top
						//slides should move towards the top ie. value should be negative
						//if carousel is vertical --> don't translate horizontally
						isVertical
							? (translateAmount =
									prevTranslatedAmount.f + Math.abs(diff))
							: (translateAmount = 0);
					}

					const keyframesObject = {
						transform: [
							`translate(${prevX}px,${prevY}px)`,
							`translate(${prevX}px,${translateAmount}px)`,
						],
					} as PropertyIndexedKeyframes;
					if (slideToAnimate) {
						animation = slideToAnimate.animate(
							keyframesObject,
							timingOptions
						);
					} else {
						animation = slidesContainer.animate(
							keyframesObject,
							timingOptions
						);
					}

					prevY = translateAmount;
				}
			}

			if (secondInstance) {
				if (!(AnimationOptions?.AnimationType === "stack")) {
					secondInstance = false;
					return;
				}

				if (moveDirectionAxis === "x") {
					moveDirection =
						startPosX - e.clientX < 0 ? "right" : "left";

					//get which slide to animate using setState to get
					//currState value
					const slides = Array.from(
						slidesContainer.children
					) as HTMLElement[];
					const currSlideNo = Number(
						slidesContainer.getAttribute("data-active-slide")
					);

					if (
						moveDirection === "left" &&
						currSlideNo !== slides.length - 1
					) {
						//if movement towards the left, animate subsequent slide
						slideToAnimate = slides[currSlideNo + 1];
					} else if (moveDirection === "right" && currSlideNo !== 0) {
						//if movement towards the right, animate current slide
						slideToAnimate = slides[currSlideNo];
					}

					if (slideToAnimate) {
						prevTranslatedAmount = new DOMMatrix(
							getComputedStyle(slideToAnimate).transform
						);
						prevX = prevTranslatedAmount.e;
						prevY = prevTranslatedAmount.f;
						// console.log(prevX, prevY);
					}
				} else {
					moveDirection = startPosY - e.clientY < 0 ? "down" : "up";

					//get which slide to animate using setState to get
					//currState value
					const slides = Array.from(
						slidesContainer.children
					) as HTMLElement[];
					const currSlideNo = Number(
						slidesContainer.getAttribute("data-active-slide")
					);

					if (
						moveDirection === "up" &&
						currSlideNo !== slides.length - 1
					) {
						//if movement towards the left, animate subsequent slide
						slideToAnimate = slides[currSlideNo + 1];
					} else if (moveDirection === "down" && currSlideNo !== 0) {
						//if movement towards the right, animate current slide
						slideToAnimate = slides[currSlideNo];
					}

					if (slideToAnimate) {
						prevTranslatedAmount = new DOMMatrix(
							getComputedStyle(slideToAnimate).transform
						);
						prevX = prevTranslatedAmount.e;
						prevY = prevTranslatedAmount.f;
					}
				}
				secondInstance = false;
				shouldExecute = true;
			}
			if (firstInstance) {
				let diffX = startPosX - e.clientX;
				let diffY = startPosY - e.clientY;
				//once user drags the slide in a certain direction
				//only allow movement in that particular direction
				Math.abs(diffX) > Math.abs(diffY)
					? (moveDirectionAxis = "x")
					: (moveDirectionAxis = "y");
				// console.log(moveDirectionAxis);
				firstInstance = false;
				secondInstance = true;
				slideToAnimate = null;
			}
		}

		const HandlePointerUp = (e: PointerEvent) => {
			//if button that triggered the event wasn't left mouse or
			//touch contact or pen contact then return
			//using button property in pointerup instead of button(s)
			if (e.button !== 0) return;

			//resetting values used in pointer move handler
			firstInstance = true;
			shouldExecute = false;

			let diff: number;
			isVertical
				? (diff = startPosY - e.clientY)
				: (diff = startPosX - e.clientX);
			const threshold = 100;

			if (diff === 0) return;

			//if user drags along the x-axis and carousel is vertical OR
			// vice versa OR
			// diff < threshold --> animate the carousel slide back to the initial position (same slideNo)
			if (
				// (isVertical && moveDirection === "x") ||
				// (!isVertical && moveDirection === "y") ||
				Math.abs(diff) < threshold
			) {
				if (slideToAnimate) {
					// const prevTranslatedVal = new DOMMatrix(
					// 	getComputedStyle(slideToAnimate).transform
					// );
					let translateTo: string;
					switch (moveDirection) {
						case "left":
							translateTo = `translate(100%,0)`;
							break;
						case "right":
							translateTo = "translate(0,0)";
							break;
						case "down":
							translateTo = "translate(0,0)";
							break;
						default:
							translateTo = "translate(100%,0)";
							break;
					}

					animation = slideToAnimate.animate(
						{
							transform: [
								`translate(${prevX}px,${prevY}px)`,
								translateTo,
							],
						},
						timingOptions
					);
				} else {
					setSlideNo((currSlideNo) => {
						changeSlide(currSlideNo);
						return currSlideNo;
					});
				}
			} else {
				// if (diff > 0 && Math.abs(diff) > threshold) {
				if (diff > 0) {
					IncrementOrDecrementSlideNo("increment");
					// } else if (diff < 0 && Math.abs(diff) > threshold) {
				} else {
					IncrementOrDecrementSlideNo("decrement");
				}
			}
		};

		//adding event listeners
		slidesContainer.addEventListener("pointerdown", HandlePointerDown);
		slidesContainer.addEventListener(
			"pointermove",
			HandlePointerMove,
			true
		);
		slidesContainer.addEventListener("pointerup", HandlePointerUp);

		return () => {
			slidesContainer.removeEventListener(
				"pointerdown",
				HandlePointerDown
			);
			slidesContainer.removeEventListener(
				"pointermove",
				HandlePointerMove,
				true
			);
			slidesContainer.removeEventListener("pointerup", HandlePointerUp);
			// slidesContainer.style.cursor = "initial";
		};
	}, [
		AnimationOptions?.AnimationType,
		IncrementOrDecrementSlideNo,
		changeSlide,
		isVertical,
		slidesContainerRef,
	]);

	//configuring wheel event
	useEffect(() => {
		if (!AnimateOnWheelEvent) return;
		if (!slidesContainerRef.current) return;

		const slidesContainer = slidesContainerRef.current;
		let firstInstance = true;
		let secondInstance = false;
		let timer: ReturnType<typeof setTimeout>;

		const handleWheelEvent = (e: WheelEvent) => {
			e.preventDefault();

			function execute(delta: number) {
				if (delta < 0) {
					IncrementOrDecrementSlideNo("decrement");
				} else if (delta > 0) {
					IncrementOrDecrementSlideNo("increment");
				}

				//Pause automated transition on user input
				// settingAutoSlideChangePause(true);
			}

			//wait for a couple of instances before executing
			//the main logic since wheelEvent.delta values for
			//first couple of instances are not reliable
			if (secondInstance) {
				execute(isVertical ? e.deltaY : e.deltaX);
				secondInstance = false;
			}
			if (firstInstance) {
				firstInstance = false;
				secondInstance = true;
			}
			if (timer) {
				clearTimeout(timer);
			}
			//last Instance
			timer = setTimeout(() => {
				firstInstance = true;
				secondInstance = false;
			}, 200);
		};

		slidesContainer.addEventListener("wheel", handleWheelEvent);
		return () => {
			slidesContainer.removeEventListener("wheel", handleWheelEvent);
		};
	}, [
		AnimateOnWheelEvent,
		IncrementOrDecrementSlideNo,
		isVertical,
		slidesContainerRef,
	]);

	//setup auto transitions
	useEffect(() => {
		if (!AutoSlideChange.isTrue || !isInfiniteLoop) return;

		let timer: ReturnType<typeof setTimeout>;
		//auto changing the slide in setInterval

		if (!autoSlideChangeIsPaused) {
			timer = setInterval(() => {
				// IncrementOrDecrementSlideNo("increment");
				setSlideNo((currSlideNo) => {
					if (currSlideNo === childrenWithStyleProp.length - 1) {
						return 0;
					}
					return currSlideNo + 1;
				});
			}, AutoSlideChange.timer);
		}

		return () => {
			clearInterval(timer);
		};
	}, [
		AutoSlideChange.isTrue,
		AutoSlideChange.timer,
		IncrementOrDecrementSlideNo,
		autoSlideChangeIsPaused,
		childrenWithStyleProp.length,
		isInfiniteLoop,
	]);

	//check visibility state of page in order to
	//pause interval (auto slide transitions)
	useEffect(() => {
		//event handler
		const changeAutoSlideChangeState = () => {
			if (document.visibilityState === "hidden") {
				settingAutoSlideChangePause(true);
			}
		};

		document.addEventListener(
			"visibilitychange",
			changeAutoSlideChangeState
		);

		return () => {
			document.removeEventListener(
				"visibilitychange",
				changeAutoSlideChangeState
			);
		};
	}, [settingAutoSlideChangePause]);

	//execute user callback if specified
	useEffect(() => {
		if (!executeOnActiveSlide) return;

		executeOnActiveSlide(slideNo);
	}, [executeOnActiveSlide, slideNo]);

	//change slide if setActiveSlide is passed from parent
	useEffect(() => {
		if (setActiveSlide === undefined || setActiveSlide === null) {
			return;
		}

		// console.log("carousel set active slide: " + setActiveSlide);
		setSlideNo(setActiveSlide);
		settingAutoSlideChangePause(true);
	}, [setActiveSlide, settingAutoSlideChangePause]);

	//event handler functions -----------------------------------------------------------------

	const handleSlideChange: React.MouseEventHandler = (e) => {
		if (e.currentTarget.hasAttribute("data-prev")) {
			IncrementOrDecrementSlideNo("decrement");
		} else if (e.currentTarget.hasAttribute("data-next")) {
			IncrementOrDecrementSlideNo("increment");
		}
	};

	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------

	return (
		<section
			style={carouselContainerStyles}
			className={CssStyles["carousel-container"]}
			ref={CarouselContainerRef}
		>
			<div
				style={slidesContainerStyles}
				ref={slidesContainerRef}
				className={CssStyles["slides-container"]}
				data-active-slide={slideNo}
			>
				{childrenWithStyleProp}
			</div>
			{CarouselArrows.isTrue && (
				<>
					<button
						className={CssStyles["prev-btn"]}
						onClick={handleSlideChange}
						disabled={
							!isInfiniteLoop && slideNo === 0 ? true : false
						}
						data-prev
					>
						<svg
							className={CssStyles["prev-btn-arrow"]}
							xmlns="http://www.w3.org/2000/svg"
							height="30" //48
							width="35"
							viewBox="-10 0 50 50"
						>
							<path d="M32.25 42.2 14.05 24l18.2-18.2 1.45 1.5L17 24l16.7 16.7Z" />
						</svg>
						{CarouselArrows.label &&
							(() => {
								if (slideNo === 0)
									return CarouselArrows.label[
										CarouselArrows.label.length - 1
									];
								return CarouselArrows.label[slideNo - 1];
							})()}
					</button>
					<button
						className={CssStyles["next-btn"]}
						onClick={handleSlideChange}
						disabled={
							!isInfiniteLoop &&
							slideNo === childrenWithStyleProp.length - 1
								? true
								: false
						}
						data-next
					>
						{CarouselArrows.label &&
							(() => {
								if (
									slideNo ===
									childrenWithStyleProp.length - 1
								)
									return CarouselArrows.label[0];
								return CarouselArrows.label[slideNo + 1];
							})()}
						<svg
							className={CssStyles["next-btn-arrow"]}
							xmlns="http://www.w3.org/2000/svg"
							height="30" //48
							width="35"
							viewBox="10 0 50 50"
						>
							<path d="m15.75 42.15-1.5-1.45L31 23.95 14.25 7.25l1.5-1.5 18.2 18.2Z" />
						</svg>
					</button>
				</>
			)}
			{CarouselDots.isTrue && (
				<div
					style={CarouselDotsContainerStyles}
					className={CssStyles["carousel-dots-container"]}
					ref={CarouselDotsContainerRef}
				>
					{CarouselDots.label && (
						<span
							style={CarouselDotsLabelStyles}
							className={CssStyles["carousel-dots-label"]}
						>
							{CarouselDots.label[slideNo]}
						</span>
					)}
					<RadioGroup
						ref={CarouselDotsRadioGroupRef}
						controlled={true}
					>
						{Array.from(
							{
								length:
									childrenWithStyleProp.length -
									NoOfSlidesInView +
									1,
							},
							(_, index) => {
								return (
									<RadioBtn
										onChange={handleClickOnCarouselDots}
										// dataOrder={index}
										key={index}
										checked={slideNo === index}
									/>
								);
							}
						)}
					</RadioGroup>
				</div>
			)}
		</section>
	);
}

function memoCompareFunction(
	prevProps: CarouselPropsType,
	nextProps: CarouselPropsType
) {
	if (
		prevProps.AutoSlideChange?.isTrue !==
			nextProps.AutoSlideChange?.isTrue ||
		(nextProps.setActiveSlide !== undefined &&
			prevProps.setActiveSlide !== nextProps.setActiveSlide) ||
		prevProps.children !== nextProps.children
	) {
		return false;
	}
	return true;
}

export default memo(Carousel, memoCompareFunction);
