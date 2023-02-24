import "./index.css";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import { useState } from "react";

function App() {
	const [category, setCategory] = useState<
		"man" | "woman" | "kids" | undefined
	>("woman");
	const [headerLogoColor, setHeaderLogoColor] = useState<"black" | "white">(
		"black"
	);

	return (
		<>
			<Header
				setCategory={setCategory}
				headerLogoColor={headerLogoColor}
			/>
			<Home category={category} setHeaderLogoColor={setHeaderLogoColor} />
		</>
	);
}

export default App;
