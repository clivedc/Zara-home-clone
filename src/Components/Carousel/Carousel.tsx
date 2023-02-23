import React, {
	ComponentProps,
	memo,
	ReactElement,
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
// import { setInterval } from "timers";

//types--------------------------------------------------------------
export type CarouselDotsContainerPositionType =
	| "top-left-vertical"
	| "top-left-horizontal"
	| "top-centre"
	| "top-right-horizontal"
	| "top-right-vertical"
	| "bottom-left-vertical"
	| "bottom-left-horizontal"
	| "bottom-centre"
	| "bottom-right-horizontal"
	| "bottom-right-vertical";

export interface CarouselOptionsType {
	CarouselContainerStyles?: React.CSSProperties; //different from slides container
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
	};
	AutoSlideChange?: {
		isTrue: boolean;
		timer: number;
		// isPaused?: boolean;
	};
	setActiveSlide?: number;
	executeOnActiveSlide?: (ActiveSlide: number) => void;
}

interface CarouselPropsType extends CarouselOptionsType {
	children:
		| React.ReactElement<any, string | React.JSXElementConstructor<any>>
		| React.ReactFragment
		| React.ReactPortal;
}

//component----------------------------------------------------------------
function Carousel({
	CarouselContainerStyles,
	CarouselArrows = {
		isTrue: true,
	},
	CarouselDots = { isTrue: true, AutoHideAfterTransition: false },
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

	// setting up radio buttons (CarouselDots)
	// function definition provided below changeSlide
	// function definition
	// let handleClickOnCarouselDots: (e: React.ChangeEvent) => void;

	// const setRadioButtons = () => {
	// 	const arr = Array.from(
	// 		//specify Array length
	// 		//with Array like object
	// 		//{ length: number }
	// 		{ length: (children as ReactElement[]).length },
	// 		//map function as second
	// 		//argument of Array.from()
	// 		(_, index) => {
	// 			if (index === 0) {
	// 				return (
	// 					<RadioBtn
	// 						onChange={handleClickOnCarouselDots}
	// 						dataOrder={index}
	// 						key={index}
	// 						checked={true}
	// 					/>
	// 				);
	// 			} else {
	// 				return (
	// 					<RadioBtn
	// 						onChange={handleClickOnCarouselDots}
	// 						dataOrder={index}
	// 						key={index}
	// 					/>
	// 				);
	// 			}
	// 		}
	// 	);
	// 	return arr;
	// };

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
	const [
		transitionSlidesOnPointerMoveAnimation,
		setTransitionSlidesOnPointerMoveAnimation,
	] = useState<Animation | undefined>();
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
	// const [RadioButtons] = useState<React.ReactNode[]>(setRadioButtons);
	const [slideNo, setSlideNo] = useState<number>(0);
	const gapBetweenSlidesInPixels = useRef<number>(0);
	// const childrenWithStyleProp = useRef<React.ReactElement[] | null>(null);
	const [autoSlideChangeIsPaused, setAutoSlideChangeIsPaused] = useState<
		boolean | null
	>(() => {
		if (AutoSlideChange.isTrue && isInfiniteLoop) return false;
		return true;
	});
	const [mediaQuery, setMediaQuery] = useState<boolean>(
		window.matchMedia("(min-width: 768px)").matches
	);
	// const childrenLength = useRef<number | null>(null);
	// const [transitionAnimation,setTransitionAnimation] = useState();

	//---------------------------------------------------------------------

	//add styling to children
	// function addStylePropsToChildren() {
	// 	// const childrenArr = React.Children.toArray(
	// 	// 	children
	// 	// ) as React.ReactElement[];
	// 	// const childrenLen = React.Children.count(children);
	// 	// if (
	// 	// 	// childrenArr[0].props["data-carousel-optimized"] &&
	// 	// 	childrenLen === childrenLength.current
	// 	// ) {
	// 	// 	console.log("hi");
	// 	// 	return children;
	// 	// }
	// 	// childrenLength.current = childrenLen;
	// 	return React.Children.map(children, (child, index) => {
	// 		//check if each child is a
	// 		//valid JSX element
	// 		if (React.isValidElement(child)) {
	// 			//store existing classes if any so
	// 			// that they can be included and not overwritten
	// 			let existingClasses: string;
	// 			child.props.className
	// 				? (existingClasses = child.props.className)
	// 				: (existingClasses = "");
	// 			//if child is a picture tag
	// 			//then map through its children and
	// 			//add styles to img element child
	// 			if (child.type === "picture") {
	// 				const grandchildren = React.Children.map(
	// 					child.props.children,
	// 					(grandChild, index) => {
	// 						//if child of picture element is
	// 						//an img tag then add styles
	// 						if (grandChild.type === "img") {
	// 							//store existing classes
	// 							let existingGrandChildClasses: string;
	// 							grandChild.props.className
	// 								? (existingGrandChildClasses =
	// 										grandChild.props.className)
	// 								: (existingGrandChildClasses = "");
	// 							//if classes exist then include them
	// 							if (existingGrandChildClasses) {
	// 								return React.cloneElement(grandChild, {
	// 									// "data-carousel-optimized": true,
	// 									className: `${existingGrandChildClasses} ${CssStyles["slide-media-img"]}`,
	// 									draggable: "false",
	// 								});
	// 								// else don't include them in the className prop
	// 							} else {
	// 								return React.cloneElement(grandChild, {
	// 									// "data-carousel-optimized": true,
	// 									className: CssStyles["slide-media-img"],
	// 									draggable: "false",
	// 								});
	// 							}
	// 						} else {
	// 							return grandChild;
	// 						}
	// 					}
	// 				);
	// 				//return picture element with
	// 				// new children
	// 				return React.cloneElement(child, undefined, grandchildren);
	// 				//if child is an img
	// 				//element then add img specific styles
	// 			} else if (child.type === "img") {
	// 				//if classes exist then include them
	// 				if (existingClasses) {
	// 					return React.cloneElement(child, {
	// 						// "data-carousel-optimized": true,
	// 						className: `${existingClasses} ${CssStyles["slide-media-img"]}`,
	// 						draggable: "false",
	// 					} as ComponentProps<"image">);
	// 					//else don't include them
	// 				} else {
	// 					return React.cloneElement(child, {
	// 						// "data-carousel-optimized": true,
	// 						className: CssStyles["slide-media-img"],
	// 						draggable: "false",
	// 					} as ComponentProps<"image">);
	// 				}
	// 				//if child is a video
	// 				//element then add video specific styles
	// 			} else if (
	// 				child.type === "video" ||
	// 				(typeof child.type === "function" &&
	// 					child.type.name === "Video")
	// 			) {
	// 				//if classes exist then include them
	// 				if (existingClasses) {
	// 					return React.cloneElement(child, {
	// 						// "data-carousel-optimized": true,
	// 						className: `${existingClasses} ${CssStyles["slide-media-video"]}`,
	// 						draggable: "false",
	// 					} as ComponentProps<"video">);
	// 					//else don't include classes
	// 				} else {
	// 					return React.cloneElement(child, {
	// 						// "data-carousel-optimized": true,
	// 						className: CssStyles["slide-media-video"],
	// 						draggable: "false",
	// 					} as ComponentProps<"video">);
	// 				}
	// 			} else {
	// 				//else add generic slide styles
	// 				// return child;
	// 				//if classes exist then include them
	// 				if (existingClasses) {
	// 					return React.cloneElement(child, {
	// 						// "data-carousel-optimized": true,
	// 						className: `${existingClasses} ${CssStyles.slide}`,
	// 						draggable: "false",
	// 					} as React.HTMLAttributes<HTMLElement>);
	// 					//else don't include
	// 				} else {
	// 					return React.cloneElement(child, {
	// 						// "data-carousel-optimized": true,
	// 						className: CssStyles.slide,
	// 						draggable: "false",
	// 					} as React.HTMLAttributes<HTMLElement>);
	// 				}
	// 			}
	// 		} else {
	// 			throw new Error(
	// 				`Child at index ${index} of children is not a JSX element. Only JSX elements can be passed as children.`
	// 			);
	// 		}
	// 	});
	// }
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
					if (child.type === "picture" || child.type === "a") {
						const grandchildren = React.Children.map(
							child.props.children,
							(grandChild, index) => {
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
									if (existingGrandChildClasses) {
										return React.cloneElement(grandChild, {
											// "data-carousel-optimized": true,
											className: `${existingGrandChildClasses} ${CssStyles["slide-media-img"]}`,
											draggable: "false",
										});
										// else don't include them in the className prop
									} else {
										return React.cloneElement(grandChild, {
											// "data-carousel-optimized": true,
											className:
												CssStyles["slide-media-img"],
											draggable: "false",
										});
									}
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
						if (existingClasses) {
							return React.cloneElement(child, {
								// "data-carousel-optimized": true,
								className: `${existingClasses} ${CssStyles["slide-media-img"]}`,
								draggable: "false",
							} as ComponentProps<"image">);
							//else don't include them
						} else {
							return React.cloneElement(child, {
								// "data-carousel-optimized": true,
								className: CssStyles["slide-media-img"],
								draggable: "false",
							} as ComponentProps<"image">);
						}
						//if child is a video
						//element then add video specific styles
					} else if (
						child.type === "video" ||
						(typeof child.type === "function" &&
							child.type.name === "Video")
					) {
						//if classes exist then include them
						if (existingClasses) {
							return React.cloneElement(child, {
								// "data-carousel-optimized": true,
								className: `${existingClasses} ${CssStyles["slide-media-video"]}`,
								draggable: "false",
							} as ComponentProps<"video">);
							//else don't include classes
						} else {
							return React.cloneElement(child, {
								// "data-carousel-optimized": true,
								className: CssStyles["slide-media-video"],
								draggable: "false",
							} as ComponentProps<"video">);
						}
					} else {
						//else add generic slide styles
						// return child;
						//if classes exist then include them
						if (existingClasses) {
							return React.cloneElement(child, {
								// "data-carousel-optimized": true,
								className: `${existingClasses} ${CssStyles.slide}`,
								draggable: "false",
							} as React.HTMLAttributes<HTMLElement>);
							//else don't include
						} else {
							return React.cloneElement(child, {
								// "data-carousel-optimized": true,
								className: CssStyles.slide,
								draggable: "false",
							} as React.HTMLAttributes<HTMLElement>);
						}
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
			const slideDimensions =
				slidesContainer.firstElementChild!.getBoundingClientRect();
			//if isVertical --> slideHeight else slideWidth
			let slideWidthOrHeight: number;
			isVertical
				? (slideWidthOrHeight = slideDimensions.height)
				: (slideWidthOrHeight = slideDimensions.width);

			// const transformBy = 100 * slideNo; //percentage
			const transformBy =
				(slideWidthOrHeight + gapBetweenSlidesInPixels.current) *
				slideNo;

			const timingOptions = {
				...carouselAnimationOptions.current,
				fill: "forwards",
			} as KeyframeAnimationOptions;

			//get previously translated value and store it in a matrix
			//transformX value = matrix.e, transformY value = matrix.f
			const matrix = new DOMMatrix(
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
			// const carouselDotsContainerAnimation =
			// 	CarouselDotsContainerRef.current
			// 		? CarouselDotsContainerRef.current.animate(
			// 				{
			// 					opacity: [0, 1, 1, 0],
			// 					offset: [0, 0.3, 0.6, 1],
			// 				},
			// 				{
			// 					duration:
			// 						carouselAnimationOptions.current.duration,
			// 					fill: "both",
			// 				}
			// 		  )
			// 		: null;

			if (carouselDotsContainerAnimation)
				carouselDotsContainerAnimation.pause();

			if (isVertical) {
				// (
				// 	slidesContainerRef.current as HTMLDivElement
				// ).style.transform = `translate(0,-${
				// 	// (100 / childrenWithStyleProp.length) * slideNo
				// 	100 * slideNo
				// }%)`;
				// requestAnimationFrame(() => {
				// 	(
				// 		slidesContainerRef.current as HTMLDivElement
				// 	).style.transform = `translate(0,-${transformBy}%)`;
				// });
				// requestAnimationFrame(() => {
				// const slidesContainer =
				// 	slidesContainerRef.current as HTMLDivElement;
				// const matrix = new DOMMatrix(
				// 	getComputedStyle(slidesContainer).transform
				// );
				transitionSlidesOnChangingSlideNoAnimation.current =
					slidesContainer.animate(
						{
							transform: [
								`translate(${matrix.e}px,${matrix.f}px)`,
								`translate(0,-${transformBy}px)`,
							],
						},
						timingOptions
					);

				//commit styles of last frame and remove animation (cancel method)
				//on finish to prevent racking up unnecessary animation instances
				transitionSlidesOnChangingSlideNoAnimation.current.onfinish =
					function onAnimationEnd() {
						transitionSlidesOnChangingSlideNoAnimation.current?.commitStyles();
						transitionSlidesOnChangingSlideNoAnimation.current?.cancel();
					};

				if (
					!carouselDotsContainerAnimation
					// !CarouselDots.AutoHideAfterTransition
				) {
					return;
				}

				carouselDotsContainerAnimation.play();
				// });
			} else {
				// (
				// 	slidesContainerRef.current as HTMLDivElement
				// ).style.transform = `translate(-${
				// 	// (100 / childrenWithStyleProp.length) * slideNo
				// 	100 * slideNo
				// }%,0)`;
				// requestAnimationFrame(() => {
				// (
				// 	slidesContainerRef.current as HTMLDivElement
				// 	).style.transform = `translate(-${transformBy}%,0)`;
				// });
				// requestAnimationFrame(() => {
				// const slidesContainer =
				// 	slidesContainerRef.current as HTMLDivElement;
				// const matrix = new DOMMatrix(
				// 	getComputedStyle(slidesContainer).transform
				// );
				transitionSlidesOnChangingSlideNoAnimation.current =
					slidesContainer.animate(
						{
							transform: [
								`translate(${matrix.e}px,${matrix.f}px)`,
								`translate(-${transformBy}px,0)`,
							],
						},
						timingOptions
					);

				transitionSlidesOnChangingSlideNoAnimation.current.onfinish =
					function onAnimationEnd() {
						transitionSlidesOnChangingSlideNoAnimation.current?.commitStyles();
						transitionSlidesOnChangingSlideNoAnimation.current?.cancel();
					};

				if (
					!carouselDotsContainerAnimation
					// !CarouselDots.AutoHideAfterTransition
				) {
					return;
				}

				carouselDotsContainerAnimation.play();
				// });
			}
		},
		[CarouselDots.AutoHideAfterTransition, isVertical]
	);

	//function to change slideNo
	const IncrementOrDecrementSlideNo = useCallback(
		(incOrDec: "increment" | "decrement") => {
			//pause auto transitions on user input
			if (AutoSlideChange.isTrue && isInfiniteLoop) {
				setAutoSlideChangeIsPaused(true);
			}

			if (incOrDec === "increment") {
				setSlideNo((prev) => {
					if (
						prev ===
						childrenWithStyleProp.length - NoOfSlidesInView
					) {
						if (isInfiniteLoop) {
							return 0;
						} else {
							//returning the same value isn't going to
							//trigger a re-render,hence I'm calling the
							//changeSlide function inline
							changeSlide(prev);
							return prev;
						}
					} else {
						return prev + 1;
					}
				});
			} else {
				setSlideNo((prev) => {
					if (prev === 0) {
						if (isInfiniteLoop) {
							return (
								childrenWithStyleProp.length - NoOfSlidesInView
							);
						} else {
							//same as above
							changeSlide(prev);
							return prev;
						}
					} else {
						return prev - 1;
					}
				});
			}
		},
		// []
		// );
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

		const slidesContainer = slidesContainerRef.current;
		let startPosX: number;
		let startPosY: number;
		// let shouldWait = false;
		let firstInstance = true;
		let prevTranslatedAmount: DOMMatrix;
		let prevY: number;
		let prevX: number;
		let timingOptions = {
			duration: 300,
			fill: "forwards",
		} as KeyframeAnimationOptions;

		let animation: Animation;
		// let timer: ReturnType<typeof setTimeout>;
		let moveDirection: "x" | "y";

		let shouldExecute = false;

		//flag to prevent pointer up event from being invoked if
		//button pressed wasn't left mouse or touch contact or pen contact
		//(evt.buttons property on pointerup event = 0)
		// let leftClick = true;
		// let diffX:number;
		// 	let diffY:number;

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

			// isVertical ? (startPosX = e.clientY) : (startPosX = e.clientX);
			startPosX = e.clientX;
			startPosY = e.clientY;

			// requestAnimationFrame(() => {
			// slidesContainer.style.cursor = "grab";
			// });
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
			// requestAnimationFrame(() => {
			// 	// console.log("move");
			// 	if (animation) {
			// 		animation.finish();
			// 		animation.cancel();
			// 	}

			// 	let diff: number;

			// 	isVertical
			// 		? (diff = startPosX - e.clientY)
			// 		: (diff = startPosX - e.clientX);

			// 	let translateAmount: number;
			// 	// console.log(diff);
			// 	//if gesture is towards the left (diff > 0) then
			// 	//absolute value of diff must be subtracted from previously translated
			// 	//amount (which is itself a negative value) so that the slidesContainer
			// 	//moves towards the left (translate value should be negative)
			// 	if (diff > 0) {
			// 		isVertical
			// 			? (translateAmount =
			// 					prevTranslatedAmount.f - Math.abs(diff))
			// 			: (translateAmount =
			// 					prevTranslatedAmount.e - Math.abs(diff));
			// 	} else {
			// 		//if the gesture is towards the right (diff < 0) then
			// 		//absolute value of diff must be added to previously translated
			// 		//amount (negative value) so that the slidesContainer moves
			// 		//towards the right. Translate value will be less negative, final value
			// 		//will still be negative (unless slideNo === 0 in which case previously translated
			// 		//value = 0) since the previously translated value was negative.
			// 		//Eg - prevTranslatedAmount = -300px, diff = -50px
			// 		//	translateAmount = -300 + 50 = -250 --> container moves towards the right
			// 		isVertical
			// 			? (translateAmount =
			// 					prevTranslatedAmount.f + Math.abs(diff))
			// 			: (translateAmount =
			// 					prevTranslatedAmount.e + Math.abs(diff));
			// 	}

			// 	// queueMicrotask(
			// 	// 	() => (slidesContainer.style.cursor = "grabbing")
			// 	// );

			// 	// isVertical
			// 	// 	? (slidesContainer.style.transform = `translateY(${translateAmount}px)`)
			// 	// 	: (slidesContainer.style.transform = `translateX(${translateAmount}px)`);
			// 	if (isVertical) {
			// 		animation = slidesContainer.animate(
			// 			{
			// 				transform: [
			// 					`translate(${prevX}px,${prevY}px)`,
			// 					`translate(0px,${translateAmount}px)`,
			// 				],
			// 			},
			// 			timingOptions
			// 		);
			// 	} else {
			// 		animation = slidesContainer.animate(
			// 			{
			// 				transform: [
			// 					`translate(${prevX}px,${prevY}px)`,
			// 					`translate(${translateAmount}px,0px)`,
			// 				],
			// 			},
			// 			timingOptions
			// 		);
			// 	}

			// 	// animation.onfinish = function onAnimationFinish() {
			// 	// 	animation.commitStyles();
			// 	// 	animation.cancel();
			// 	// };

			// 	isVertical
			// 		? (prevY = translateAmount)
			// 		: (prevX = translateAmount);
			// });

			if (shouldExecute) {
				//delete the animation instance on next invocation so
				//as to avoid racking up many instances
				if (animation) {
					animation.finish();
					animation.cancel();
				}
				let diff: number;
				let translateAmount: number;
				if (moveDirection === "x") {
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
						!isVertical
							? (translateAmount =
									prevTranslatedAmount.e + Math.abs(diff))
							: (translateAmount = 0);
					}

					animation = slidesContainer.animate(
						{
							//only animate in the direction the user is dragging the slides
							transform: [
								`translate(${prevX}px,${prevY}px)`,
								`translate(${translateAmount}px,${prevY}px)`,
							],
						},
						timingOptions
					);

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

					animation = slidesContainer.animate(
						{
							transform: [
								`translate(${prevX}px,${prevY}px)`,
								`translate(${prevX}px,${translateAmount}px)`,
							],
						},
						timingOptions
					);

					prevY = translateAmount;
				}
			}

			if (firstInstance) {
				let diffX = startPosX - e.clientX;
				let diffY = startPosY - e.clientY;
				//once user drags the slide in a certain direction
				//only allow movement in that particular direction
				Math.abs(diffX) > Math.abs(diffY)
					? (moveDirection = "x")
					: (moveDirection = "y");
				// console.log(moveDirection);
				firstInstance = false;
				shouldExecute = true;
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
				setSlideNo((prev) => {
					changeSlide(prev);
					return prev;
				});
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
		IncrementOrDecrementSlideNo,
		changeSlide,
		isVertical,
		slidesContainerRef,
	]);

	//touch/pointer
	// useEffect(() => {
	// 	if (!slidesContainerRef.current) return;

	// 	const slidesContainer = slidesContainerRef.current;
	// 	let startPosX: number;
	// 	// let shouldWait = false;
	// 	// let firstInstance = true;
	// 	let prevTranslatedAmount: DOMMatrix;
	// 	let prevY: number;
	// 	let prevX: number;
	// 	let timingOptions = {
	// 		duration: 300,
	// 		fill: "forwards",
	// 	} as KeyframeAnimationOptions;

	// 	let animation: Animation;
	// 	// let timer: ReturnType<typeof setTimeout>;

	// 	//flag to prevent pointer up event from being invoked if
	// 	//button pressed wasn't left mouse or touch contact or pen contact
	// 	//(evt.buttons property on pointerup event = 0)
	// 	// let leftClick = true;

	// 	const HandlePointerDown = (e: PointerEvent) => {
	// 		//check if button currently being clicked is
	// 		//left mouse or touch contact or pen contact
	// 		if (e.buttons !== 1) {
	// 			return;
	// 		}

	// 		prevTranslatedAmount = new DOMMatrix(
	// 			getComputedStyle(slidesContainer).transform
	// 		);

	// 		prevX = prevTranslatedAmount.e;
	// 		prevY = prevTranslatedAmount.f;

	// 		isVertical ? (startPosX = e.clientY) : (startPosX = e.clientX);

	// 		// requestAnimationFrame(() => {
	// 		// slidesContainer.style.cursor = "grab";
	// 		// });
	// 	};

	// 	const HandlePointerMove = (e: PointerEvent) => {
	// 		//check if button currently being clicked is
	// 		//left mouse or touch contact or pen contact
	// 		// IMP TO CHECK!!!!!!!!!!!!!!!!!!!
	// 		if (e.buttons !== 1) {
	// 			// slidesContainer.style.cursor = "initial";
	// 			return;
	// 		}

	// 		slidesContainer.setPointerCapture(e.pointerId);
	// 		requestAnimationFrame(() => {
	// 			// console.log("move");
	// 			if (animation) {
	// 				animation.finish();
	// 				// requestAnimationFrame(() => {
	// 				// 	animation.commitStyles();
	// 				// });
	// 				animation.cancel();
	// 			}

	// 			let diff: number;

	// 			isVertical
	// 				? (diff = startPosX - e.clientY)
	// 				: (diff = startPosX - e.clientX);

	// 			let translateAmount: number;
	// 			// console.log(diff);
	// 			//if gesture is towards the left (diff > 0) then
	// 			//absolute value of diff must be subtracted from previously translated
	// 			//amount (which is itself a negative value) so that the slidesContainer
	// 			//moves towards the left (translate value should be negative)
	// 			if (diff > 0) {
	// 				isVertical
	// 					? (translateAmount =
	// 							prevTranslatedAmount.f - Math.abs(diff))
	// 					: (translateAmount =
	// 							prevTranslatedAmount.e - Math.abs(diff));
	// 			} else {
	// 				//if the gesture is towards the right (diff < 0) then
	// 				//absolute value of diff must be added to previously translated
	// 				//amount (negative value) so that the slidesContainer moves
	// 				//towards the right. Translate value will be less negative, final value
	// 				//will still be negative (unless slideNo === 0 in which case previously translated
	// 				//value = 0) since the previously translated value was negative.
	// 				//Eg - prevTranslatedAmount = -300px, diff = -50px
	// 				//	translateAmount = -300 + 50 = -250 --> container moves towards the right
	// 				isVertical
	// 					? (translateAmount =
	// 							prevTranslatedAmount.f + Math.abs(diff))
	// 					: (translateAmount =
	// 							prevTranslatedAmount.e + Math.abs(diff));
	// 			}

	// 			// queueMicrotask(
	// 			// 	() => (slidesContainer.style.cursor = "grabbing")
	// 			// );

	// 			// isVertical
	// 			// 	? (slidesContainer.style.transform = `translateY(${translateAmount}px)`)
	// 			// 	: (slidesContainer.style.transform = `translateX(${translateAmount}px)`);
	// 			if (isVertical) {
	// 				animation = slidesContainer.animate(
	// 					{
	// 						transform: [
	// 							`translate(${prevX}px,${prevY}px)`,
	// 							`translate(0px,${translateAmount}px)`,
	// 						],
	// 					},
	// 					timingOptions
	// 				);
	// 			} else {
	// 				animation = slidesContainer.animate(
	// 					{
	// 						transform: [
	// 							`translate(${prevX}px,${prevY}px)`,
	// 							`translate(${translateAmount}px,0px)`,
	// 						],
	// 					},
	// 					timingOptions
	// 				);
	// 			}

	// 			// animation.onfinish = function onAnimationFinish() {
	// 			// 	animation.commitStyles();
	// 			// 	animation.cancel();
	// 			// };

	// 			isVertical
	// 				? (prevY = translateAmount)
	// 				: (prevX = translateAmount);
	// 		});
	// 	};

	// 	const HandlePointerUp = (e: PointerEvent) => {
	// 		//if button that triggered the event wasn't left mouse or
	// 		//touch contact or pen contact then return
	// 		//using button property in pointerup instead of button(s)
	// 		if (e.button !== 0) return;

	// 		let diff: number;
	// 		isVertical
	// 			? (diff = startPosX - e.clientY)
	// 			: (diff = startPosX - e.clientX);
	// 		const threshold = 100;

	// 		// console.log("removed");
	// 		if (diff === 0) return;
	// 		// if ((diff > 0 || diff < 0) && Math.abs(diff) < threshold) {
	// 		if (Math.abs(diff) < threshold) {
	// 			// changeSlide(slideNo);
	// 			setSlideNo((prev) => {
	// 				changeSlide(prev);
	// 				return prev;
	// 			});
	// 		} else if (diff > 0 && Math.abs(diff) > threshold) {
	// 			IncrementOrDecrementSlideNo("increment");
	// 		} else if (diff < 0 && Math.abs(diff) > threshold) {
	// 			IncrementOrDecrementSlideNo("decrement");
	// 		}

	// 		//set cursor to default style
	// 		// requestAnimationFrame(() => {
	// 		// setTimeout(() => (slidesContainer.style.cursor = "initial"), 0);
	// 		// });
	// 	};

	// 	//adding event listeners
	// 	slidesContainer.addEventListener("pointerdown", HandlePointerDown);
	// 	slidesContainer.addEventListener(
	// 		"pointermove",
	// 		HandlePointerMove,
	// 		true
	// 	);
	// 	slidesContainer.addEventListener("pointerup", HandlePointerUp);

	// 	return () => {
	// 		slidesContainer.removeEventListener(
	// 			"pointerdown",
	// 			HandlePointerDown
	// 		);
	// 		slidesContainer.removeEventListener(
	// 			"pointermove",
	// 			HandlePointerMove,
	// 			true
	// 		);
	// 		slidesContainer.removeEventListener("pointerup", HandlePointerUp);
	// 		// slidesContainer.style.cursor = "initial";
	// 	};
	// }, [
	// 	IncrementOrDecrementSlideNo,
	// 	changeSlide,
	// 	isVertical,
	// 	slidesContainerRef,
	// ]);

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

			if (secondInstance) {
				// console.log(e.deltaX);
				execute(isVertical ? e.deltaY : e.deltaX);
				secondInstance = false;
			}
			if (firstInstance) {
				// console.log(e.deltaX);
				// execute(isVertical ? e.deltaY : e.deltaX);
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
		// const throttleWheelEvent = (
		// 	callback: (delta: number) => void,
		// 	delay = 200
		// ) => {
		// 	let firstInstance = true;
		// 	let timer: ReturnType<typeof setTimeout>;
		// 	return (e: WheelEvent) => {
		// 		e.stopPropagation();
		// 		if (firstInstance) {
		// 			console.log("first");
		// 			callback(isVertical ? e.deltaY : e.deltaX);
		// 			firstInstance = false;
		// 		}
		// 		if (timer) {
		// 			clearTimeout(timer);
		// 		}
		// 		//last Instance
		// 		timer = setTimeout(() => {
		// 			firstInstance = true;
		// 		}, delay);
		// 	};
		// };
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

		// console.log("isPaused: " + autoSlideChangeIsPaused);
		let timer: ReturnType<typeof setTimeout>;
		//auto changing the slide in setInterval

		if (!autoSlideChangeIsPaused) {
			timer = setInterval(() => {
				// IncrementOrDecrementSlideNo("increment");
				setSlideNo((prev) => {
					if (prev === childrenWithStyleProp.length - 1) {
						return 0;
					}
					return prev + 1;
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
		const changeAutoSlideChangeState = (e: Event) => {
			if (document.visibilityState === "hidden") {
				settingAutoSlideChangePause(true);
			}
			// else {
			// 	settingAutoSlideChangePause(true);
			// }
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
			// console.log("in return statement: " + setActiveSlide);
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
// {/* {RadioButtons} */}

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

// Array.from(
// 	//specify Array length
// 	//with Array like object
// 	//{ length: number }
// 	{ length: childrenWithStyleProp.length },
// 	//map function as second
// 	//argument of Array.from()
// 	(_, index) => {
// 		return (
// 			<RadioBtn
// 				onChange={handleClickOnCarouselDots}
// 				// dataOrder={index}
// 				key={index}
// 				checked={slideNo === index}
// 			/>
// 		);
// 	}
// )
