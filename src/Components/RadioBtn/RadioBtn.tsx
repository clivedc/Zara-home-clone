import React, { forwardRef, useState } from "react";
import styles from "./RadioBtn.module.css";

export interface RadioBtnPropsType
	extends React.ComponentPropsWithRef<"input"> {
	// name?: string;
	// id?: string;
	// onChange?: (e: React.ChangeEvent) => void;
	// checked?: boolean;
	// dataOrder?: number;
	labelName?: string;
	noDots?: boolean;
	// className?: string;
	"data-order"?: number;
	// setActiveSlide?: React.Dispatch<React.SetStateAction<number | null>>;
}

const RadioBtn = forwardRef<HTMLInputElement, RadioBtnPropsType>(
	function RadioBtn(
		{
			labelName,
			noDots = false,
			// dataOrder,
			className,
			// checked = false,
			// setActiveSlide = undefined,
			...props
		},
		ref
	) {
		//setting label styles
		const setLabelStyle = () => {
			return {
				display: "flex",
				gap: "0.5rem",
				alignItems: "center",
			};
		};

		const setRadioClasses = () => {
			if (className) {
				return `${styles.radio} ${className}`;
			} else {
				return `${styles.radio}`;
			}
		};

		const [labelStyle] = useState<React.CSSProperties>(setLabelStyle);
		const [radioClasses] = useState<string>(setRadioClasses);

		return (
			<label style={labelStyle}>
				<input
					type="radio"
					// defaultChecked={checked}
					className={radioClasses}
					style={
						noDots
							? { visibility: "hidden" }
							: { visibility: "visible" }
					}
					// data-order={dataOrder}
					{...props}
					ref={ref}
				/>
				{labelName && (
					<span className={styles["label-name"]}>{labelName}</span>
				)}
			</label>
		);
	}
);

export default React.memo(RadioBtn);
