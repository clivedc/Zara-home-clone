import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import { useState } from "react";
// import Carousel from "./Components/Carousel/Carousel";

function App() {
	const [category, setCategory] = useState<"man" | "woman" | "kids">("woman");
	const [headerLogoColor, setHeaderLogoColor] = useState<"black" | "white">(
		"black"
	);
	// const [lazyLoadedComponent, setLazyLoadedComponent] =
	// 	useState<JSX.Element | null>(null);

	// useEffect(() => {
	// 	async function load() {
	// 		const { default: Carousel } = await import(
	// 			/* webpackChunkName: "Carousel" */ /* webpackPreload: true */ "./Components/Carousel/Carousel"
	// 		);
	// 		console.log("loaded");
	// 		setLazyLoadedComponent(
	// 			<Carousel
	// 				AnimateOnWheelEvent={true}
	// 				AnimationOptions={{
	// 					AnimationDuration: 800,
	// 					AnimationType: "stack",
	// 				}}
	// 				// AutoSlideChange={{
	// 				// 	isTrue: true,
	// 				// 	timer: 3000,
	// 				// }}
	// 				CarouselDots={{
	// 					isTrue: true,
	// 					CarouselDotsContainerPosition: "bottom-right-vertical",
	// 					label: ["first", "second", "third", "fourth"],
	// 				}}
	// 				CarouselContainerStyles={{
	// 					marginInline: "auto",
	// 					width: "30rem",
	// 					height: "30rem",
	// 				}}
	// 			>
	// 				<picture>
	// 					<img
	// 						src="https://source.unsplash.com/random/300x301/?fruit"
	// 						alt="fruit"
	// 					/>
	// 				</picture>
	// 				<picture>
	// 					<img
	// 						src="https://source.unsplash.com/random/300x302/?fruit"
	// 						alt="fruit"
	// 					/>
	// 				</picture>
	// 				<picture>
	// 					<img
	// 						src="https://source.unsplash.com/random/300x303/?fruit"
	// 						alt="fruit"
	// 					/>
	// 				</picture>
	// 				<picture>
	// 					<img
	// 						src="https://source.unsplash.com/random/300x304/?fruit"
	// 						alt="fruit"
	// 					/>
	// 				</picture>
	// 			</Carousel>
	// 		);
	// 	}

	// 	load();
	// }, []);

	return (
		<>
			<Header
				category={category}
				setCategory={setCategory}
				headerLogoColor={headerLogoColor}
			/>
			<Home
				category={category}
				setCategory={setCategory}
				setHeaderLogoColor={setHeaderLogoColor}
			/>
			{/* {lazyLoadedComponent} */}
		</>
	);
}

export default App;
