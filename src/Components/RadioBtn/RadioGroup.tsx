import React, {
	forwardRef,
	useState,
	useCallback,
	useRef,
	HTMLAttributes,
} from "react";
import { RadioBtnPropsType } from "./RadioBtn";

type controlledUnionType =
	| {
			controlled: true;
			name?: never;
	  }
	| {
			controlled: false;
			name: string;
	  };

type RadioGroupPropsType = React.ComponentPropsWithRef<"div"> &
	controlledUnionType & { onRadioBtnChange?: (e: React.ChangeEvent) => void };

// type RadioGroupChildren = typeof RadioBtn & typeof HTMLInputElement;

// interface RadioGroupPropsType extends React.ComponentPropsWithRef<"div"> {
// 	name?: string;
// 	controlled: boolean;
// 	onRadioBtnChange?: (e: React.ChangeEvent) => void;
// 	// defaultCheckedRadio?: number;
// 	// checkedRadio?: number;
// 	// style?: React.CSSProperties;
// 	// children: React.ReactNode;
// 	// className?: string;
// }

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupPropsType>(
	function RadioGroup(
		{
			name,
			children,
			controlled,
			style,
			onRadioBtnChange,
			...remainingProps
		},
		ref
	) {
		//set container styles
		const setContainerStyles = () => {
			const defaultStyle: React.CSSProperties = {
				display: "flex",
				gap: "1rem",
			};
			if (style) {
				return { ...defaultStyle, ...style };
			} else {
				return defaultStyle;
			}
		};
		//----- state variables ----------------------------------------
		const [containerStyles] =
			useState<React.CSSProperties>(setContainerStyles);
		const [radioChecked, setRadioChecked] = useState<number>(0);
		const childrenLength = useRef<number | null>(null);

		//--------------------------------------------------------------

		//custom event handler
		const eventHandler = useCallback(
			(e: React.ChangeEvent) => {
				if (onRadioBtnChange) {
					onRadioBtnChange(e);
				} else {
					const ele = e.currentTarget as HTMLInputElement;
					setRadioChecked(Number(ele.dataset.order));
				}
			},
			[onRadioBtnChange]
		);

		//map children and add additional prop
		function addPropsToChildren() {
			//if inputs are meant to be uncontrolled then
			//return children unchanged
			//return mapped children
			const childrenArr = React.Children.toArray(
				children
			) as React.ReactElement[];
			if (
				childrenArr[0].props["data-radio-grp-optimized"] &&
				childrenArr.length === childrenLength.current
			) {
				return childrenArr;
			}
			childrenLength.current = childrenArr.length;
			// console.log(childrenArr);
			// return React.Children.map(children, (child, index) => {
			return childrenArr.map((child, index) => {
				//check if child is a valid JSX element
				if (!React.isValidElement(child)) {
					throw new Error(
						`child at index '${index}' of children is not a valid React Element`
					);
				}

				if (
					(child as React.ReactElement).props.checked !== undefined &&
					!onRadioBtnChange &&
					!(child as React.ReactElement).props.onChange
				) {
					throw new Error(
						"You provided a `checked` prop to a form field without an `onChange` handler. If the input must be a controlled component then both `checked` as well as `onChange` must be defined.\nEither provide the `onChange` prop on each radio input/RadioBtn or provide the `onRadioBtnChange` prop on the RadioGroup component."
					);
				}

				if (!controlled) {
					return React.cloneElement(child, {
						name: name,
						"data-radio-grp-optimized": true,
					} as HTMLAttributes<HTMLInputElement> | RadioBtnPropsType);
				}

				return React.cloneElement(child, {
					"data-radio-grp-optimized": true,
					"data-order": index,
					checked: radioChecked === index,
					onChange: eventHandler,
					...(child as React.ReactElement).props,
				});
			});
		}
		const childrenWithProps = addPropsToChildren();
		// const childrenWithProps = useMemo(() => {
		// 	//if inputs are meant to be uncontrolled then
		// 	//return children unchanged
		// 	//return mapped children
		// 	return React.Children.map(children, (child, index) => {
		// 		//check if child is a valid JSX element
		// 		if (!React.isValidElement(child)) {
		// 			throw new Error(
		// 				`child at index '${index}' of children is not a valid React Element`
		// 				);
		// 			}

		// 			if (
		// 				child.type !== "input" &&
		// 				!(
		// 					typeof child.type === "object" &&
		// 					(child.type as any).type.render.name === "RadioBtn"
		// 					)
		// 					) {
		// 						throw new Error(
		// 							`Children must be of type radio or the RadioBtn component.\nChild at index '${index}' of children does not match this condition.`
		// 							);
		// 						}

		// 						if (
		// 							child.props.checked !== undefined &&
		// 			!onRadioBtnChange &&
		// 			!child.props.onChange
		// 			) {
		// 				throw new Error(
		// 					"You provided a `checked` prop to a form field without an `onChange` handler. If the input must be a controlled component then both `checked` as well as `onChange` must be defined.\nEither provide the `onChange` prop on each radio input/RadioBtn or provide the `onRadioBtnChange` prop on the RadioGroup component."
		// 			);
		// 		}

		// 		if (!controlled) {
		// 			return React.cloneElement(child, {
		// 				name: name,
		// 				"data-radio-grp-optimized": true,
		// 				...child.props,
		// 			});
		// 		}

		// 		return React.cloneElement(child, {
		// 			"data-radio-grp-optimized": true,
		// 			"data-order": index,
		// 			checked: radioChecked === index,
		// 			onChange: eventHandler,
		// 			...child.props,
		// 		});
		// 	});
		// }, [
		// 	children,
		// 	controlled,
		// 	eventHandler,
		// 	name,
		// 	onRadioBtnChange,
		// 	radioChecked,
		// ]);

		return (
			<div style={containerStyles} ref={ref} {...remainingProps}>
				{childrenWithProps}
			</div>
		);
	}
);

export default React.memo(RadioGroup);
