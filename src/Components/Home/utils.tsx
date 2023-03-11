// import { a } from "react-router-dom";

export const setVerticalCarouselLastSlide = () => {
	return (
		<div className="vert-carousel-container__last-slide">
			<p className="vert-carousel-container__last-slide__newsletter-para">
				JOIN OUR NEWSLETTER
			</p>
			<section className="vert-carousel-container__last-slide__social-links-container">
				<a href="#" className="social-links-container__social-link">
					TikTok
				</a>
				<a href="#" className="social-links-container__social-link">
					Instagram
				</a>
				<a href="#" className="social-links-container__social-link">
					Facebook
				</a>
				<a href="#" className="social-links-container__social-link">
					Twitter
				</a>
				<a href="#" className="social-links-container__social-link">
					Pinterest
				</a>
				<a href="#" className="social-links-container__social-link">
					Youtube
				</a>
				<a href="#" className="social-links-container__social-link">
					Spotify
				</a>
			</section>
			<section className="vert-carousel-container__last-slide__additional-info">
				<a href="#">COOKIE SETTINGS</a>
				<a href="#">PRIVACY AND COOKIES POLICY</a>
				<a href="#">TERMS OF USE</a>
			</section>
		</div>
	);
};

export const setVerticalCarouselDotsWithLabels = () => {
	return {
		Woman: ["NEW", "COLLECTION", "JEANS", "DRESSES", "SHOES", ""],
		Man: ["NEW", "UTILITY", "ZARA ATHLETICZ", "SHOES", ""],
		Kids: [
			"NEW BABY SIZE",
			"GIRL",
			"BOY",
			"BABY GIRL",
			"BABY BOY",
			"NEWBORN",
			"SWIMWEAR",
			"SHOES",
			"",
		],
	};
};
