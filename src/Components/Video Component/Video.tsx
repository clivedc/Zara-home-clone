import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../Hooks/useIntersectionObserver";
import styles from "./Video.module.css";

export interface VideoPropsType
	extends React.ComponentPropsWithoutRef<"video"> {
	// dataDesktopSmallSrc?: string;
	dataDesktopMedSrc?: string;
	dataDesktopLargeSrc: string;
	dataPhonePortraitSrc?: string;
	dataIpadPortraitSrc: string;
	posterPortrait: string;
	posterLandscape: string;
	classNameForContainer?: string;
	seekToStartWhenNotVisible?: boolean;
}

const Video = ({
	dataDesktopMedSrc,
	dataDesktopLargeSrc,
	dataPhonePortraitSrc,
	dataIpadPortraitSrc,
	posterPortrait,
	posterLandscape,
	seekToStartWhenNotVisible = false,
	className,
	classNameForContainer,
	...restProps
}: VideoPropsType) => {
	// function immediateMediaState(mediaQuery:string) {
	// 	window.matchMedia(mediaQuery).matches
	// }
	const [classes] = useState(() => {
		if (className) {
			return `${styles.Video} ${className}`;
		} else {
			return styles.Video;
		}
	});
	const [mediaQuery_767PX, setMediaQuery_767PX] = useState(
		window.matchMedia("(max-width: 767px)").matches
	);
	const [mediaQuery_768PX, setMediaQuery_768PX] = useState(
		window.matchMedia("(min-width: 768px) and (orientation: portrait)")
			.matches
	);
	const [mediaQuery_1024PX, setMediaQuery_1024PX] = useState(
		window.matchMedia("(min-width: 1024px)").matches
	);
	const [mediaQuery_2400PX, setMediaQuery_2400PX] = useState(
		window.matchMedia("(min-width: 2400px)").matches
	);
	const [mediaQuery_Portrait, setMediaQuery_Portrait] = useState(
		window.matchMedia("(orientation: portrait)").matches
	);
	const sourceRef = useRef<HTMLSourceElement>(null);
	// const videoRef = useRef<HTMLVideoElement>(null);
	const [isVideoVisible, videoRef] =
		useIntersectionObserver<HTMLVideoElement>({ threshold: 0.7 });

	useEffect(() => {
		if (!sourceRef.current) return;

		// orientation portrait
		const setMediaOrientation = (e: MediaQueryListEvent) => {
			if (e.matches) {
				setMediaQuery_Portrait(true);
			} else {
				setMediaQuery_Portrait(false);
			}
		};
		window
			.matchMedia("(orientation: portrait)")
			.addEventListener("change", setMediaOrientation);

		// < 767px
		const setMediaPhone = (e: MediaQueryListEvent) => {
			if (e.matches) {
				setMediaQuery_767PX(true);
			} else {
				setMediaQuery_767PX(false);
			}
		};
		window
			.matchMedia("(max-width: 767px)")
			.addEventListener("change", setMediaPhone);

		// > 768px
		const setMediaIpad = (e: MediaQueryListEvent) => {
			if (e.matches) {
				setMediaQuery_768PX(true);
			} else {
				setMediaQuery_768PX(false);
			}
		};
		window
			.matchMedia("(min-width: 768px) and (orientation: portrait)")
			.addEventListener("change", setMediaIpad);

		// > 1024px
		const setMediaDesktop_Med = (e: MediaQueryListEvent) => {
			if (e.matches) {
				setMediaQuery_1024PX(true);
			} else {
				setMediaQuery_1024PX(false);
			}
		};
		window
			.matchMedia("(min-width: 1024px)")
			.addEventListener("change", setMediaDesktop_Med);

		// > 2400px
		const setMediaDesktop_Large = (e: MediaQueryListEvent) => {
			if (e.matches) {
				setMediaQuery_2400PX(true);
			} else {
				setMediaQuery_2400PX(false);
			}
		};
		window
			.matchMedia("(min-width: 2400px)")
			.addEventListener("change", setMediaDesktop_Large);

		return () => {
			window
				.matchMedia("(max-width: 767px)")
				.removeEventListener("change", setMediaPhone);
			window
				.matchMedia("(min-width: 768px) and (orientation: portrait)")
				.removeEventListener("change", setMediaIpad);
			window
				.matchMedia("(min-width: 1024px)")
				.removeEventListener("change", setMediaDesktop_Med);
			window
				.matchMedia("(min-width: 2400px)")
				.removeEventListener("change", setMediaDesktop_Large);
		};
	}, []);

	//max-width: 767px
	useEffect(() => {
		if (!mediaQuery_767PX) return;
		if (!sourceRef.current || !videoRef.current) return;

		if (!dataPhonePortraitSrc) {
			sourceRef.current.src = dataIpadPortraitSrc as string;
		} else {
			sourceRef.current.src = dataPhonePortraitSrc as string;
		}
		//load the video on render
		videoRef.current.load();
	}, [dataIpadPortraitSrc, dataPhonePortraitSrc, mediaQuery_767PX, videoRef]);

	//min-width: 768px
	useEffect(() => {
		if (!mediaQuery_768PX) return;
		if (!sourceRef.current || !videoRef.current) return;

		sourceRef.current.src = dataIpadPortraitSrc;
		//load the video on render
		videoRef.current.load();
	}, [dataIpadPortraitSrc, mediaQuery_768PX, videoRef]);

	//min-width: 1024px
	useEffect(() => {
		if (!mediaQuery_1024PX) return;
		if (!sourceRef.current || !videoRef.current) return;

		if (!dataDesktopMedSrc) {
			sourceRef.current.src = dataDesktopLargeSrc;
		} else {
			sourceRef.current.src = dataDesktopMedSrc;
		}
		//load the video on render
		videoRef.current.load();
	}, [dataDesktopLargeSrc, dataDesktopMedSrc, mediaQuery_1024PX, videoRef]);

	//min-width: 2400px
	useEffect(() => {
		if (!mediaQuery_2400PX) return;
		if (!sourceRef.current || !videoRef.current) return;

		sourceRef.current.src = dataDesktopLargeSrc;
		//load the video on render
		videoRef.current.load();
	}, [dataDesktopLargeSrc, mediaQuery_2400PX, videoRef]);

	// set poster image based on orientation of device
	useEffect(() => {
		if (!videoRef.current) return;

		const video = videoRef.current as HTMLVideoElement;
		if (mediaQuery_Portrait) {
			video.poster = posterPortrait;
		} else {
			video.poster = posterLandscape;
		}
	}, [mediaQuery_Portrait, posterLandscape, posterPortrait, videoRef]);

	//play when in viewport and pause it
	//when out of view
	useEffect(() => {
		if (!videoRef.current) return;
		if (!sourceRef.current || !sourceRef.current.src) return;

		if (isVideoVisible && videoRef.current.paused) {
			// videoRef.current.muted = true;
			videoRef.current.play();
		} else {
			videoRef.current.pause();
			if (seekToStartWhenNotVisible) {
				videoRef.current.currentTime = 0;
			}
		}
	}, [isVideoVisible, seekToStartWhenNotVisible, videoRef]);

	//check if user has switched tabs or
	//has opened another window
	useEffect(() => {
		if (!videoRef.current) return;
		if (sourceRef.current !== null && !sourceRef.current.src) return;

		const video = videoRef.current;

		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden" && !video.paused) {
				video.pause();
			} else {
				// videoRef.current.muted = true;
				if (video.paused && isVideoVisible) {
					video.play();
				}
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
	}, [isVideoVisible, videoRef]);

	return (
		<div
			className={
				classNameForContainer
					? `${classNameForContainer} ${styles["Video-wrapper"]}`
					: styles["Video-wrapper"]
			}
		>
			<video className={classes} {...restProps} ref={videoRef} muted>
				<source ref={sourceRef}></source>
			</video>
		</div>
	);
};

// assign a name to the function
// to be used by the carousel component
Object.defineProperty(Video, "name", {
	value: "Video",
	writable: true,
	configurable: true,
});

export default Video;
