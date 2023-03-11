import { useEffect, useRef } from "react";

export default function usePrevious(state: number) {
	const previousState = useRef<number>(-1);

	useEffect(() => {
		previousState.current = state;
	}, [state]);

	return previousState;
}
