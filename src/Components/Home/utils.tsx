import { NavLink } from "react-router-dom";

export const setVerticalCarouselLastSlide = () => {
	return (
		<div className="vert-carousel-container__last-slide">
			<p className="vert-carousel-container__last-slide__newsletter-para">
				JOIN OUR NEWSLETTER
			</p>
			<section className="vert-carousel-container__last-slide__social-links-container">
				<NavLink
					to="#"
					// className={(isActive) =>
					// 	!isActive
					// 		? "social-links-container__social-link"
					// 		: "social-links-container__social-link--active-social-link"
					// }
					className="social-links-container__social-link"
				>
					Instagram
				</NavLink>
				<NavLink
					to="#"
					// className={(isActive) =>
					// 	!isActive
					// 		? "social-links-container__social-link"
					// 		: "social-links-container__social-link--active-social-link"
					// }
					className="social-links-container__social-link"
				>
					Facebook
				</NavLink>
				<NavLink
					to="#"
					// className={(isActive) =>
					// 	!isActive
					// 		? "social-links-container__social-link"
					// 		: "social-links-container__social-link--active-social-link"
					// }
					className="social-links-container__social-link"
				>
					Twitter
				</NavLink>
				<NavLink
					to="#"
					// className={(isActive) =>
					// 	!isActive
					// 		? "social-links-container__social-link"
					// 		: "social-links-container__social-link--active-social-link"
					// }
					className="social-links-container__social-link"
				>
					Pinterest
				</NavLink>
				<NavLink
					to="#"
					// className={(isActive) =>
					// 	!isActive
					// 		? "social-links-container__social-link"
					// 		: "social-links-container__social-link--active-social-link"
					// }
					className="social-links-container__social-link"
				>
					Youtube
				</NavLink>
				<NavLink
					to="#"
					// className={(isActive) =>
					// 	!isActive
					// 		? "social-links-container__social-link"
					// 		: "social-links-container__social-link--active-social-link"
					// }
					className="social-links-container__social-link"
				>
					Spotify
				</NavLink>
			</section>
			<section className="vert-carousel-container__last-slide__additional-info">
				<p>Lorem ipsum dolor sit amet.</p>
				<p>Loremipsd ips dolores sit ametsadbf sum.</p>
				<p>
					Lorempo ip su idimdolor sitque ametop consectetur
					adipisicing elit.
				</p>
			</section>
		</div>
	);
};

export const setVerticalCarouselDotsWithLabels = () => {
	return {
		Woman: ["NEW", "BASICS", "SHOES", "SHIRTS", ""],
		Man: ["NEW", "ZARA ATHLETICZ", ""],
		Kids: [
			"BACK TO SCHOOL",
			"GIRL",
			"BABY GIRL",
			"BABY BOY",
			"MINI",
			"ACCESSORIES",
			"JOIN LIFE",
			"",
		],
	};
};
