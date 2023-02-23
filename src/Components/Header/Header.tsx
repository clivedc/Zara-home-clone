import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Header.css";
import jsonList from "../../jsonData/sideNavList.json";
import { convertSuperscript } from "./utils";
import { jsonListType } from "./types";
// import { Link, Outlet, useOutletContext } from "react-router-dom";

const navList = jsonList as jsonListType;

type category = "man" | "woman" | "kids";
interface HeaderPropsType {
	setCategory: React.Dispatch<React.SetStateAction<category | undefined>>;
	headerLogoColor: "black" | "white";
}

const Header = ({ setCategory, headerLogoColor }: HeaderPropsType) => {
	const sideMenuRef = useRef<HTMLElement>(null!);
	const tabPanelContainerRef = useRef<HTMLDivElement>(null!);
	// const [category, setCategory] = useState<string | undefined>("");
	// const [headerLogoColor, setHeaderLogoColor] = useState("black");

	const openMenu: React.MouseEventHandler = (e) => {
		sideMenuRef.current.classList.add("side-menu-wrapper--open");
	};

	const closeSideMenu: React.MouseEventHandler = (e) => {
		sideMenuRef.current.classList.remove("side-menu-wrapper--open");
	};

	// const contextProviderValue = useMemo(
	// 	() => ({ category, setHeaderLogoColor }),
	// 	[category]
	// );

	const showActiveTabPanel: React.MouseEventHandler = (e) => {
		if (e.currentTarget.classList.contains("active-tab")) {
			// setCategory((prev) => {
			// 	if (prev === "") {
			// 		setTimeout(() => setCategory("woman"), 0);
			// 	}
			// 	setTimeout(() => setCategory(prev), 0);
			// 	return undefined;
			// });
			setCategory((prevVal) => {
				queueMicrotask(() => setCategory(prevVal));
				return undefined;
			});
			return;
		}
		const ele = e.currentTarget;
		const parent = ele.parentElement;
		const tabsArray = Array.from(
			parent?.children as HTMLCollection
		) as HTMLButtonElement[];
		tabsArray.forEach((tab) => tab.classList.remove("active-tab"));
		ele.classList.add("active-tab");

		const id = ele.id as category;
		tabPanelContainerRef.current.dataset.activeTabpanel = id;
		setCategory(id);
	};

	// useEffect(() => {
	// 	console.log(category);
	// }, [category]);

	//handle click outside
	//side menu when open
	useEffect(() => {
		const handleClickOutside = (e: PointerEvent) => {
			//if side menu isn't
			//open then return
			if (
				!sideMenuRef.current.classList.contains(
					"side-menu-wrapper--open"
				)
			) {
				return;
			}

			//if click is outside the side
			//menu then close the side menu
			if (!sideMenuRef.current.contains(e.target as HTMLElement)) {
				sideMenuRef.current.classList.remove("side-menu-wrapper--open");
			}
		};

		document.addEventListener("pointerup", handleClickOutside);

		return () => {
			document.removeEventListener("pointerup", handleClickOutside);
		};
	}, []);

	return (
		<>
			<header className="site-header">
				<div className="site-header__left-section">
					<button
						type="button"
						onClick={openMenu}
						className="site-header__hamburger-btn"
						aria-label="open menu"
					>
						<svg
							// style={{ backgroundColor: "red" }}
							height="30"
							width="15"
							className="hamburger-icon"
							viewBox="10 10 22 32"
							xmlns="http://www.w3.org/2000/svg"
							fill={headerLogoColor}
						>
							<path
								d="M6 36v-3h36v3Zm0-10.5v-3h36v3ZM6 15v-3h36v3Z"
								stroke="white"
								strokeWidth="1.2"
							/>
						</svg>
					</button>
					<svg
						className="site-header__logo"
						viewBox="0 0 132 55"
						xmlns="http://www.w3.org/2000/svg"
						fill={headerLogoColor}
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M105.673.035l19.557 53.338 6.77.002v.383h-21.548v-.383h6.344l-6.431-17.54H97.311v.007l.07.204c.521 1.548.78 3.17.764 4.803v6.575c0 3.382 1.494 6.81 4.347 6.81 1.675 0 3.012-.59 4.604-2.046l.227.211C105.594 54.224 103.5 55 100.36 55c-2.37 0-4.398-.57-6.03-1.693l-.309-.222c-2.148-1.624-3.542-4.278-4.142-7.89l-.096-.583-.1-.882-.01-.152-3.599 9.792h5.107v.384H80.496v-.384h5.162l3.951-10.753v-.023a34.924 34.924 0 0 1-.075-1.906v-4.693c0-5.77-4.29-9.08-11.771-9.08H70.41v26.458h6.371v.383h-24.9v-.383h6.345l-6.431-17.54H33.948l-6.371 17.346.266-.044c8.366-1.442 12.213-7.827 12.265-14.55h.388v15.171H0L30.06 2.185H17.972C7.954 2.185 3.42 9.922 3.35 17.635h-.387V1.8h36.488l-.222.385L9.396 53.373h15.695c.39 0 .778-.019 1.169-.05.26-.018.522-.044.788-.077l.095-.01L46.703 0h.387l.013.035 15.369 41.916V2.185h-6.328v-.39h21.778c10.467 0 17.774 5.372 17.774 13.068 0 5.612-5.005 10.27-12.45 11.595l-1.367.174 1.377.14c4.515.517 8.1 1.906 10.641 4.127l.017.016L105.273 0h.386l.014.035zm-8.552 35.32l.038.094h13.061l-8.773-23.928-7.221 19.67.039.037.367.364a11.876 11.876 0 0 1 2.489 3.762zM70.415 26.53V2.185h5.611c7.496 0 11.454 4.414 11.454 12.76 0 8.877-2.272 11.585-9.717 11.585h-7.348zM42.882 11.521L34.09 35.45h17.565L42.882 11.52z"
						></path>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M105.673.035l19.557 53.338 6.77.002v.383h-21.548v-.383h6.344l-6.431-17.54H97.311v.007l.07.204c.521 1.548.78 3.17.764 4.803v6.575c0 3.382 1.494 6.81 4.347 6.81 1.675 0 3.012-.59 4.604-2.046l.227.211C105.594 54.224 103.5 55 100.36 55c-2.37 0-4.398-.57-6.03-1.693l-.309-.222c-2.148-1.624-3.542-4.278-4.142-7.89l-.096-.583-.1-.882-.01-.152-3.599 9.792h5.107v.384H80.496v-.384h5.162l3.951-10.753v-.023a34.924 34.924 0 0 1-.075-1.906v-4.693c0-5.77-4.29-9.08-11.771-9.08H70.41v26.458h6.371v.383h-24.9v-.383h6.345l-6.431-17.54H33.948l-6.371 17.346.266-.044c8.366-1.442 12.213-7.827 12.265-14.55h.388v15.171H0L30.06 2.185H17.972C7.954 2.185 3.42 9.922 3.35 17.635h-.387V1.8h36.488l-.222.385L9.396 53.373h15.695c.39 0 .778-.019 1.169-.05.26-.018.522-.044.788-.077l.095-.01L46.703 0h.387l.013.035 15.369 41.916V2.185h-6.328v-.39h21.778c10.467 0 17.774 5.372 17.774 13.068 0 5.612-5.005 10.27-12.45 11.595l-1.367.174 1.377.14c4.515.517 8.1 1.906 10.641 4.127l.017.016L105.273 0h.386l.014.035zm-8.552 35.32l.038.094h13.061l-8.773-23.928-7.221 19.67.039.037.367.364a11.876 11.876 0 0 1 2.489 3.762zM70.415 26.53V2.185h5.611c7.496 0 11.454 4.414 11.454 12.76 0 8.877-2.272 11.585-9.717 11.585h-7.348zM42.882 11.521L34.09 35.45h17.565L42.882 11.52z"
						></path>
					</svg>
				</div>
				<div className="site-header__right-section">
					<section className="cart">
						<svg
							className="cart__bag"
							// style={{ backgroundColor: "red" }}
							height="28" //22
							width="24" //21
							viewBox="4 6 44 44" //40
							xmlns="http://www.w3.org/2000/svg"
							fill={headerLogoColor}
						>
							<path
								d="M8 44V12h8.5v-.5q0-3.15 2.175-5.325Q20.85 4 24 4q3.15 0 5.325 2.175Q31.5 8.35 31.5 11.5v.5H40v32Zm11.5-32.5v.5h9v-.5q0-1.9-1.3-3.2Q25.9 7 24 7q-1.9 0-3.2 1.3-1.3 1.3-1.3 3.2ZM11 41h26V15h-5.5v6h-3v-6h-9v6h-3v-6H11Zm0 0V15Z"
								stroke="white"
								strokeWidth="1"
							/>
							<foreignObject x="6" y="18" width="22" height="21">
								<span
									className="cart__bag__no"
									style={
										headerLogoColor === "white"
											? { color: "white" }
											: { color: "black" }
									}
								>
									0
								</span>
							</foreignObject>
							<g className="cart__ribbon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="12"
									width="10"
									viewBox="0 0 40 40"
									fill={
										headerLogoColor === "black"
											? "white"
											: "black"
									}
								>
									<path
										d="M10 42V8.75q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1V42l-14-6Z"
										strokeWidth="4px"
										stroke={headerLogoColor}
									/>
								</svg>
							</g>
						</svg>
					</section>
					<section data-header-links>
						<button
							type="button"
							className="site-header__search-bar"
						>
							SEARCH
						</button>
						<a href="#" className="site-header__log-in">
							LOG IN
						</a>
						<a href="#" className="site-header__help">
							HELP
						</a>
					</section>
				</div>
			</header>

			{/*---------------------------SIDE MENU--------------------------------------*/}

			<section className="side-menu-wrapper" ref={sideMenuRef}>
				<div className="side-menu">
					<header className="side-menu__header">
						<div className="site-header__left-section">
							<button
								type="button"
								className="side-menu__header__close"
								onClick={closeSideMenu}
							>
								<svg
									// style={{ backgroundColor: "darksalmon" }}
									className="side-menu__header__close-icon"
									xmlns="http://www.w3.org/2000/svg"
									height="25" //25
									width="25" //25
									viewBox="4 6 34 34" //4 6 34 34
								>
									<path
										d="m12.7 36.1-.8-.8L23.2 24 11.9 12.7l.8-.8L24 23.2l11.3-11.3.8.8L24.8 24l11.3 11.3-.8.8L24 24.8Z"
										stroke="black"
										strokeWidth="0.5"
									/>
								</svg>
							</button>
							<svg
								className="site-header__logo"
								viewBox="0 0 132 55"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M105.673.035l19.557 53.338 6.77.002v.383h-21.548v-.383h6.344l-6.431-17.54H97.311v.007l.07.204c.521 1.548.78 3.17.764 4.803v6.575c0 3.382 1.494 6.81 4.347 6.81 1.675 0 3.012-.59 4.604-2.046l.227.211C105.594 54.224 103.5 55 100.36 55c-2.37 0-4.398-.57-6.03-1.693l-.309-.222c-2.148-1.624-3.542-4.278-4.142-7.89l-.096-.583-.1-.882-.01-.152-3.599 9.792h5.107v.384H80.496v-.384h5.162l3.951-10.753v-.023a34.924 34.924 0 0 1-.075-1.906v-4.693c0-5.77-4.29-9.08-11.771-9.08H70.41v26.458h6.371v.383h-24.9v-.383h6.345l-6.431-17.54H33.948l-6.371 17.346.266-.044c8.366-1.442 12.213-7.827 12.265-14.55h.388v15.171H0L30.06 2.185H17.972C7.954 2.185 3.42 9.922 3.35 17.635h-.387V1.8h36.488l-.222.385L9.396 53.373h15.695c.39 0 .778-.019 1.169-.05.26-.018.522-.044.788-.077l.095-.01L46.703 0h.387l.013.035 15.369 41.916V2.185h-6.328v-.39h21.778c10.467 0 17.774 5.372 17.774 13.068 0 5.612-5.005 10.27-12.45 11.595l-1.367.174 1.377.14c4.515.517 8.1 1.906 10.641 4.127l.017.016L105.273 0h.386l.014.035zm-8.552 35.32l.038.094h13.061l-8.773-23.928-7.221 19.67.039.037.367.364a11.876 11.876 0 0 1 2.489 3.762zM70.415 26.53V2.185h5.611c7.496 0 11.454 4.414 11.454 12.76 0 8.877-2.272 11.585-9.717 11.585h-7.348zM42.882 11.521L34.09 35.45h17.565L42.882 11.52z"
								></path>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M105.673.035l19.557 53.338 6.77.002v.383h-21.548v-.383h6.344l-6.431-17.54H97.311v.007l.07.204c.521 1.548.78 3.17.764 4.803v6.575c0 3.382 1.494 6.81 4.347 6.81 1.675 0 3.012-.59 4.604-2.046l.227.211C105.594 54.224 103.5 55 100.36 55c-2.37 0-4.398-.57-6.03-1.693l-.309-.222c-2.148-1.624-3.542-4.278-4.142-7.89l-.096-.583-.1-.882-.01-.152-3.599 9.792h5.107v.384H80.496v-.384h5.162l3.951-10.753v-.023a34.924 34.924 0 0 1-.075-1.906v-4.693c0-5.77-4.29-9.08-11.771-9.08H70.41v26.458h6.371v.383h-24.9v-.383h6.345l-6.431-17.54H33.948l-6.371 17.346.266-.044c8.366-1.442 12.213-7.827 12.265-14.55h.388v15.171H0L30.06 2.185H17.972C7.954 2.185 3.42 9.922 3.35 17.635h-.387V1.8h36.488l-.222.385L9.396 53.373h15.695c.39 0 .778-.019 1.169-.05.26-.018.522-.044.788-.077l.095-.01L46.703 0h.387l.013.035 15.369 41.916V2.185h-6.328v-.39h21.778c10.467 0 17.774 5.372 17.774 13.068 0 5.612-5.005 10.27-12.45 11.595l-1.367.174 1.377.14c4.515.517 8.1 1.906 10.641 4.127l.017.016L105.273 0h.386l.014.035zm-8.552 35.32l.038.094h13.061l-8.773-23.928-7.221 19.67.039.037.367.364a11.876 11.876 0 0 1 2.489 3.762zM70.415 26.53V2.185h5.611c7.496 0 11.454 4.414 11.454 12.76 0 8.877-2.272 11.585-9.717 11.585h-7.348zM42.882 11.521L34.09 35.45h17.565L42.882 11.52z"
								></path>
							</svg>
						</div>
					</header>
					<nav className="side-menu__nav">
						<div className="side-menu__nav__tabs">
							<button
								className="active-tab"
								role="tab"
								id="woman"
								onClick={showActiveTabPanel}
							>
								WOMAN
							</button>
							<button
								role="tab"
								id="man"
								onClick={showActiveTabPanel}
							>
								MAN
							</button>
							<button
								role="tab"
								id="kids"
								onClick={showActiveTabPanel}
							>
								KIDS
							</button>
						</div>
						<div
							className="side-menu__nav__tabpanels"
							ref={tabPanelContainerRef}
							data-active-tabpanel="woman"
						>
							<ul role="tabpanel" aria-labelledby="woman">
								{navList.woman.map(convertSuperscript)}
							</ul>
							<ul role="tabpanel" aria-labelledby="man">
								{navList.man.map(convertSuperscript)}
							</ul>
							<ul role="tabpanel" aria-labelledby="kids">
								{navList.kids.map(convertSuperscript)}
							</ul>
						</div>
					</nav>
					<footer className="side-menu__footer">
						<button className="side-menu__footer__btn">HOME</button>
						<button className="side-menu__footer__btn">
							MY ACCOUNT
						</button>
					</footer>
				</div>
			</section>
			{/* <Outlet context={contextProviderValue} /> */}
		</>
	);
};

export default Header;

// interface CategoryContext {
// 	category: string | undefined;
// 	setHeaderLogoColor: React.Dispatch<React.SetStateAction<string>>;
// }

// export const useCategoryContext = () => {
// 	return useOutletContext<CategoryContext>();
// };
