import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import { useState } from "react";

function App() {
	const [category, setCategory] = useState<"man" | "woman" | "kids">("woman");
	const [headerLogoColor, setHeaderLogoColor] = useState<"black" | "white">(
		"black"
	);

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
		</>
	);
}

export default App;
