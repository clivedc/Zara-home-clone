import { useState, useEffect, useRef } from "react";

export type useIntersectionObserverOptions = IntersectionObserverInit;

export default function useIntersectionObserver<T extends HTMLElement>(
	options?: useIntersectionObserverOptions,
	conditionallyRendered: boolean = false
) {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const elementRef = useRef<T>(null);

	useEffect(() => {
		if (!elementRef.current) return;

		const ele = elementRef.current;
		const callback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				} else {
					setIsVisible(false);
				}
			});
		};

		let observer: IntersectionObserver;
		if (options) {
			observer = new IntersectionObserver(callback, options);
		} else {
			observer = new IntersectionObserver(callback);
		}

		if (ele) observer.observe(elementRef.current);

		return () => {
			if (ele) observer.disconnect();
		};

		//haven't included options (object) as a dep as I
		//didn't want to do deep check and I'm also
		//assuming that options isn't going to be changed dynamically
	}, [conditionallyRendered]);

	return [isVisible, elementRef] as const;
}
