import React from "react";

export const convertSuperscript = (item: string): React.ReactNode => {
	if (item.match(/(\snew)$/gi)) {
		const modifiedItem = item.replace(/^(.+)(\snew)$/i, "$1");
		return (
			<li className="tabpanel-list-item" key={modifiedItem}>
				{modifiedItem}
				<sup className="superscript">{" NEW"}</sup>
			</li>
		);
	} else {
		return (
			<li className="tabpanel-list-item" key={item}>
				{item}
			</li>
		);
	}
};
